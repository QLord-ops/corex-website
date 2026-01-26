import { useRef, useEffect, useCallback } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';

// System node class - represents connection points in the network
class SystemNode {
  constructor(x, y, layer, index) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.layer = layer; // 0 = far, 1 = mid, 2 = near
    this.index = index;
    this.connections = [];
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.driftPhase = Math.random() * Math.PI * 2;
    this.size = 1.5 + layer * 0.5;
    this.baseOpacity = 0.15 + layer * 0.1;
    
    // Chaos/order state
    this.chaosOffset = {
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60
    };
  }
  
  update(progress, time, scrollVelocity, width, height) {
    // Progress: 0 = chaotic, 1 = ordered
    const orderFactor = Math.min(1, Math.max(0, progress));
    const chaosFactor = 1 - orderFactor;
    
    // Pain zone instability (progress 0.1 - 0.3)
    const painFactor = progress > 0.08 && progress < 0.35 
      ? Math.sin((progress - 0.08) * Math.PI / 0.27) * 0.4 
      : 0;
    
    // Calculate drift based on state
    const driftAmount = (15 * chaosFactor + 3 * orderFactor) * (1 + painFactor);
    const driftSpeed = 0.15 + chaosFactor * 0.1 - orderFactor * 0.08;
    
    // Organic drift motion
    const driftX = Math.sin(time * driftSpeed + this.driftPhase) * driftAmount;
    const driftY = Math.cos(time * driftSpeed * 0.7 + this.driftPhase) * driftAmount;
    
    // Chaos offset interpolation
    const chaosX = this.chaosOffset.x * chaosFactor * (1 + painFactor * 0.5);
    const chaosY = this.chaosOffset.y * chaosFactor * (1 + painFactor * 0.5);
    
    // Scroll velocity reaction - subtle displacement
    const velocityReaction = Math.min(Math.abs(scrollVelocity) * 0.3, 8);
    const velocityOffsetY = scrollVelocity * 0.5 * (this.layer + 1) * 0.3;
    
    // Target position
    this.targetX = this.baseX + driftX + chaosX;
    this.targetY = this.baseY + driftY + chaosY + velocityOffsetY;
    
    // Smooth interpolation to target (slower when ordered)
    const lerpFactor = 0.02 + chaosFactor * 0.03;
    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;
    
    // Pulse intensity based on state
    this.pulseIntensity = 0.3 + chaosFactor * 0.4 - orderFactor * 0.15;
  }
  
  getOpacity(progress, time) {
    const orderFactor = Math.min(1, Math.max(0, progress));
    const pulse = Math.sin(time * 0.3 + this.pulsePhase) * this.pulseIntensity;
    
    // More stable opacity when ordered
    const baseOpacity = this.baseOpacity * (0.7 + orderFactor * 0.5);
    return Math.max(0.08, Math.min(0.5, baseOpacity + pulse * 0.1));
  }
}

// Flow particle - moves along connections
class FlowParticle {
  constructor(startNode, endNode, layer) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.layer = layer;
    this.progress = Math.random();
    this.speed = 0.002 + Math.random() * 0.003;
    this.baseSpeed = this.speed;
    this.opacity = 0.1 + layer * 0.05;
    this.size = 1 + layer * 0.3;
  }
  
  update(systemProgress, scrollVelocity) {
    const orderFactor = Math.min(1, Math.max(0, systemProgress));
    
    // Speed varies with system state
    // Chaotic = irregular, Ordered = steady
    const speedVariation = orderFactor > 0.6 
      ? 1 
      : 0.5 + Math.random() * 0.8;
    
    // Scroll velocity affects flow speed
    const velocityBoost = 1 + Math.abs(scrollVelocity) * 0.02;
    
    this.speed = this.baseSpeed * speedVariation * velocityBoost * (0.5 + orderFactor * 0.8);
    this.progress += this.speed;
    
    if (this.progress > 1) {
      this.progress = 0;
    }
  }
  
  getPosition() {
    const t = this.progress;
    // Smooth interpolation along connection
    return {
      x: this.startNode.x + (this.endNode.x - this.startNode.x) * t,
      y: this.startNode.y + (this.endNode.y - this.startNode.y) * t
    };
  }
  
  getOpacity(systemProgress) {
    const orderFactor = Math.min(1, Math.max(0, systemProgress));
    // Fade at edges, more visible when ordered
    const edgeFade = Math.sin(this.progress * Math.PI);
    return this.opacity * edgeFade * (0.4 + orderFactor * 0.8);
  }
}

export const LivingSystemBackground = ({ progress, scrollVelocity }) => {
  const canvasRef = useRef(null);
  const systemRef = useRef({
    nodes: [],
    particles: [],
    initialized: false,
    time: 0
  });
  
  // Smooth progress for gradual transitions
  const smoothProgress = useSpring(progress, {
    stiffness: 15,
    damping: 25
  });
  
  // Smooth scroll velocity
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 50,
    damping: 20
  });
  
  // Initialize the system
  const initSystem = useCallback((width, height) => {
    const system = systemRef.current;
    system.nodes = [];
    system.particles = [];
    
    const layers = [
      { count: 25, parallax: 0.3 },  // Far layer
      { count: 18, parallax: 0.6 },  // Mid layer
      { count: 12, parallax: 1.0 }   // Near layer
    ];
    
    // Create nodes for each layer
    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        // Distribute nodes with some randomness
        const gridCols = Math.ceil(Math.sqrt(layer.count * (width / height)));
        const gridRows = Math.ceil(layer.count / gridCols);
        
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        
        const cellWidth = width / gridCols;
        const cellHeight = height / gridRows;
        
        // Position with randomness
        const x = cellWidth * (col + 0.5) + (Math.random() - 0.5) * cellWidth * 0.7;
        const y = cellHeight * (row + 0.5) + (Math.random() - 0.5) * cellHeight * 0.7;
        
        system.nodes.push(new SystemNode(x, y, layerIndex, i));
      }
    });
    
    // Create connections between nearby nodes on same layer
    system.nodes.forEach((node, i) => {
      system.nodes.forEach((other, j) => {
        if (i >= j || node.layer !== other.layer) return;
        
        const dx = node.baseX - other.baseX;
        const dy = node.baseY - other.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Connection threshold based on layer
        const threshold = 200 + node.layer * 50;
        
        if (distance < threshold && Math.random() > 0.4) {
          node.connections.push(other);
          other.connections.push(node);
          
          // Create flow particles along this connection
          if (Math.random() > 0.5) {
            system.particles.push(new FlowParticle(node, other, node.layer));
          }
        }
      });
    });
    
    system.initialized = true;
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      
      // Reinitialize system on resize
      initSystem(window.innerWidth, window.innerHeight);
    };
    
    const draw = () => {
      const system = systemRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (!system.initialized) {
        initSystem(width, height);
      }
      
      ctx.clearRect(0, 0, width, height);
      
      const currentProgress = smoothProgress.get();
      const currentVelocity = smoothVelocity.get();
      system.time += 0.016;
      
      // Update all nodes
      system.nodes.forEach(node => {
        node.update(currentProgress, system.time, currentVelocity, width, height);
      });
      
      // Update all particles
      system.particles.forEach(particle => {
        particle.update(currentProgress, currentVelocity);
      });
      
      // Draw layers back to front
      for (let layer = 0; layer < 3; layer++) {
        const layerNodes = system.nodes.filter(n => n.layer === layer);
        const layerParticles = system.particles.filter(p => p.layer === layer);
        
        // Calculate parallax offset
        const parallaxFactor = [0.3, 0.6, 1.0][layer];
        const parallaxY = currentVelocity * parallaxFactor * 2;
        
        ctx.save();
        ctx.translate(0, parallaxY);
        
        // Draw connections
        layerNodes.forEach(node => {
          node.connections.forEach(other => {
            if (node.index < other.index) {
              const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
              const opacity = (node.getOpacity(currentProgress, system.time) + 
                             other.getOpacity(currentProgress, system.time)) * 0.3;
              
              gradient.addColorStop(0, `hsla(190, 25%, 35%, ${opacity * 0.4})`);
              gradient.addColorStop(0.5, `hsla(190, 25%, 35%, ${opacity * 0.6})`);
              gradient.addColorStop(1, `hsla(190, 25%, 35%, ${opacity * 0.4})`);
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.5 + layer * 0.2;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        });
        
        // Draw flow particles
        layerParticles.forEach(particle => {
          const pos = particle.getPosition();
          const opacity = particle.getOpacity(currentProgress);
          
          ctx.beginPath();
          ctx.fillStyle = `hsla(180, 30%, 50%, ${opacity})`;
          ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw nodes
        layerNodes.forEach(node => {
          const opacity = node.getOpacity(currentProgress, system.time);
          const size = node.size * (0.8 + currentProgress * 0.3);
          
          // Node glow
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, size * 4
          );
          glowGradient.addColorStop(0, `hsla(180, 30%, 45%, ${opacity * 0.4})`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.fillStyle = glowGradient;
          ctx.arc(node.x, node.y, size * 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Node core
          ctx.beginPath();
          ctx.fillStyle = `hsla(180, 25%, 50%, ${opacity})`;
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.restore();
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    resize();
    draw();
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [initSystem, smoothProgress, smoothVelocity]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ opacity: 0.9 }}
    />
  );
};
