import { useRef, useEffect, useCallback } from 'react';
import { useSpring } from 'framer-motion';

// System node class - represents connection points in the network
class SystemNode {
  constructor(x, y, layer, index, totalNodes) {
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
    this.breathPhase = Math.random() * Math.PI * 2;
    this.size = 1.2 + layer * 0.4;
    this.baseOpacity = 0.12 + layer * 0.08;
    
    // Chaos/order state - each node has unique chaos position
    this.chaosOffset = {
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 80
    };
    
    // Ordered grid position (calculated later)
    this.orderedX = x;
    this.orderedY = y;
  }
  
  setOrderedPosition(x, y) {
    this.orderedX = x;
    this.orderedY = y;
  }
  
  update(progress, time, scrollVelocity, isScrolling) {
    // Progress: 0 = chaotic/loose, 1 = ordered/stable
    const orderFactor = this.easeInOutCubic(Math.min(1, Math.max(0, progress)));
    const chaosFactor = 1 - orderFactor;
    
    // Pain zone instability (progress ~0.1 - 0.35)
    let painFactor = 0;
    if (progress > 0.08 && progress < 0.38) {
      const painProgress = (progress - 0.08) / 0.30;
      painFactor = Math.sin(painProgress * Math.PI) * 0.5;
    }
    
    // Breathing - very slow, always present but subtle
    const breathCycle = time * 0.08 + this.breathPhase;
    const breathAmount = 2 + chaosFactor * 3;
    const breathX = Math.sin(breathCycle) * breathAmount * 0.5;
    const breathY = Math.cos(breathCycle * 0.7) * breathAmount * 0.5;
    
    // Drift motion - more when chaotic, minimal when ordered
    const driftSpeed = 0.06 + chaosFactor * 0.08;
    const driftAmount = (12 * chaosFactor + 2 * orderFactor) * (1 + painFactor * 0.6);
    const driftX = Math.sin(time * driftSpeed + this.driftPhase) * driftAmount;
    const driftY = Math.cos(time * driftSpeed * 0.8 + this.driftPhase * 1.3) * driftAmount;
    
    // Chaos offset - scattered when unordered
    const chaosX = this.chaosOffset.x * chaosFactor * (1 + painFactor * 0.4);
    const chaosY = this.chaosOffset.y * chaosFactor * (1 + painFactor * 0.4);
    
    // Scroll velocity reaction - nodes shift slightly
    const velocityDamping = isScrolling ? 1 : 0.3;
    const velocityReaction = scrollVelocity * velocityDamping;
    const velocityOffsetY = velocityReaction * (0.3 + this.layer * 0.2);
    const velocityOffsetX = velocityReaction * 0.1 * Math.sin(this.driftPhase);
    
    // Interpolate between chaotic and ordered positions
    const baseX = this.baseX * chaosFactor + this.orderedX * orderFactor;
    const baseY = this.baseY * chaosFactor + this.orderedY * orderFactor;
    
    // Target position
    this.targetX = baseX + driftX + chaosX + breathX + velocityOffsetX;
    this.targetY = baseY + driftY + chaosY + breathY + velocityOffsetY;
    
    // Smooth interpolation - slower when ordered for stability
    const lerpFactor = 0.015 + chaosFactor * 0.025;
    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;
  }
  
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  getOpacity(progress, time) {
    const orderFactor = Math.min(1, Math.max(0, progress));
    
    // Subtle pulse - less intense when ordered
    const pulseIntensity = 0.15 * (1 - orderFactor * 0.6);
    const pulse = Math.sin(time * 0.2 + this.pulsePhase) * pulseIntensity;
    
    // Base opacity increases slightly as system stabilizes
    const baseOpacity = this.baseOpacity * (0.8 + orderFactor * 0.4);
    
    return Math.max(0.05, Math.min(0.45, baseOpacity + pulse));
  }
  
  getSize(progress) {
    const orderFactor = Math.min(1, Math.max(0, progress));
    // Slightly larger and more consistent when ordered
    return this.size * (0.85 + orderFactor * 0.2);
  }
}

// Flow particle - energy moving through the system
class FlowParticle {
  constructor(startNode, endNode, layer) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.layer = layer;
    this.progress = Math.random();
    this.baseSpeed = 0.0015 + Math.random() * 0.002;
    this.speed = this.baseSpeed;
    this.opacity = 0.08 + layer * 0.04;
    this.size = 0.8 + layer * 0.3;
    this.wobblePhase = Math.random() * Math.PI * 2;
  }
  
  update(systemProgress, scrollVelocity, time, isScrolling) {
    const orderFactor = Math.min(1, Math.max(0, systemProgress));
    
    // Pain zone - erratic flow
    let painFactor = 0;
    if (systemProgress > 0.08 && systemProgress < 0.38) {
      const painProgress = (systemProgress - 0.08) / 0.30;
      painFactor = Math.sin(painProgress * Math.PI) * 0.6;
    }
    
    // Speed varies with system state
    // Chaotic = irregular, Ordered = steady and reliable
    const irregularity = (1 - orderFactor) * (0.3 + Math.sin(time * 2 + this.wobblePhase) * 0.3);
    const speedMod = orderFactor > 0.7 
      ? 1.0  // Steady when ordered
      : 0.4 + irregularity + painFactor * 0.3;
    
    // Scroll affects flow - speeds up slightly when scrolling
    const scrollBoost = isScrolling ? 1 + Math.abs(scrollVelocity) * 0.01 : 0.8;
    
    this.speed = this.baseSpeed * speedMod * scrollBoost * (0.6 + orderFactor * 0.6);
    this.progress += this.speed;
    
    // Reset with slight randomness
    if (this.progress > 1) {
      this.progress = 0;
      // In ordered state, flows are more continuous
      if (orderFactor < 0.5) {
        this.progress = Math.random() * 0.1;
      }
    }
  }
  
  getPosition() {
    const t = this.progress;
    // Smooth ease for natural flow
    const easedT = t * t * (3 - 2 * t);
    return {
      x: this.startNode.x + (this.endNode.x - this.startNode.x) * easedT,
      y: this.startNode.y + (this.endNode.y - this.startNode.y) * easedT
    };
  }
  
  getOpacity(systemProgress) {
    const orderFactor = Math.min(1, Math.max(0, systemProgress));
    // Fade at edges
    const edgeFade = Math.sin(this.progress * Math.PI);
    // More visible when ordered - reliable data flow
    return this.opacity * edgeFade * (0.5 + orderFactor * 0.7);
  }
}

export const LivingSystemBackground = ({ progress, scrollVelocity }) => {
  const canvasRef = useRef(null);
  const systemRef = useRef({
    nodes: [],
    particles: [],
    initialized: false,
    time: 0,
    lastVelocity: 0,
    isScrolling: false
  });
  
  // Initialize the system
  const initSystem = useCallback((width, height) => {
    const system = systemRef.current;
    system.nodes = [];
    system.particles = [];
    
    // Three depth layers
    const layers = [
      { count: 30, parallax: 0.3, connectionThreshold: 220 },  // Far - more nodes, sparser connections
      { count: 22, parallax: 0.6, connectionThreshold: 200 },  // Mid
      { count: 14, parallax: 1.0, connectionThreshold: 180 }   // Near - fewer, denser connections
    ];
    
    let nodeIndex = 0;
    
    layers.forEach((layerConfig, layerIndex) => {
      const layerNodes = [];
      
      // Create nodes with organic distribution
      for (let i = 0; i < layerConfig.count; i++) {
        // Distribute across screen with some clustering
        const angle = (i / layerConfig.count) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 0.2 + Math.random() * 0.35;
        
        // Mix of radial and grid distribution
        const useRadial = Math.random() > 0.4;
        let x, y;
        
        if (useRadial) {
          x = width * 0.5 + Math.cos(angle) * width * radius;
          y = height * 0.5 + Math.sin(angle) * height * radius;
        } else {
          x = Math.random() * width;
          y = Math.random() * height;
        }
        
        // Keep nodes within bounds with padding
        const padding = 50;
        x = Math.max(padding, Math.min(width - padding, x));
        y = Math.max(padding, Math.min(height - padding, y));
        
        const node = new SystemNode(x, y, layerIndex, nodeIndex++, layerConfig.count);
        
        // Calculate ordered position (more grid-like)
        const gridCols = Math.ceil(Math.sqrt(layerConfig.count * (width / height)));
        const gridRows = Math.ceil(layerConfig.count / gridCols);
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        const cellWidth = (width - padding * 2) / gridCols;
        const cellHeight = (height - padding * 2) / gridRows;
        
        const orderedX = padding + cellWidth * (col + 0.5);
        const orderedY = padding + cellHeight * (row + 0.5);
        node.setOrderedPosition(orderedX, orderedY);
        
        layerNodes.push(node);
        system.nodes.push(node);
      }
      
      // Create connections within layer
      layerNodes.forEach((node, i) => {
        layerNodes.forEach((other, j) => {
          if (i >= j) return;
          
          const dx = node.orderedX - other.orderedX;
          const dy = node.orderedY - other.orderedY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < layerConfig.connectionThreshold) {
            // Probability based on distance
            const connectionProb = 1 - (distance / layerConfig.connectionThreshold) * 0.6;
            if (Math.random() < connectionProb) {
              node.connections.push(other);
              
              // Create flow particles
              if (Math.random() > 0.6) {
                system.particles.push(new FlowParticle(node, other, layerIndex));
              }
              if (Math.random() > 0.75) {
                system.particles.push(new FlowParticle(other, node, layerIndex));
              }
            }
          }
        });
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      
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
      
      // Get current values
      const currentProgress = typeof progress.get === 'function' ? progress.get() : 0;
      const currentVelocity = typeof scrollVelocity.get === 'function' ? scrollVelocity.get() : 0;
      
      // Detect scrolling state
      const velocityDelta = Math.abs(currentVelocity - system.lastVelocity);
      system.isScrolling = Math.abs(currentVelocity) > 0.5 || velocityDelta > 0.1;
      system.lastVelocity = currentVelocity;
      
      system.time += 0.016;
      
      // Update all nodes
      system.nodes.forEach(node => {
        node.update(currentProgress, system.time, currentVelocity, system.isScrolling);
      });
      
      // Update all particles
      system.particles.forEach(particle => {
        particle.update(currentProgress, currentVelocity, system.time, system.isScrolling);
      });
      
      // Draw layers back to front for depth
      for (let layer = 0; layer < 3; layer++) {
        const layerNodes = system.nodes.filter(n => n.layer === layer);
        const layerParticles = system.particles.filter(p => p.layer === layer);
        
        // Parallax offset based on scroll velocity
        const parallaxFactor = [0.3, 0.6, 1.0][layer];
        const parallaxY = currentVelocity * parallaxFactor * 1.5;
        
        ctx.save();
        ctx.translate(0, parallaxY);
        
        // Draw connections first (behind nodes)
        layerNodes.forEach(node => {
          node.connections.forEach(other => {
            if (node.index < other.index) {
              const nodeOpacity = node.getOpacity(currentProgress, system.time);
              const otherOpacity = other.getOpacity(currentProgress, system.time);
              const avgOpacity = (nodeOpacity + otherOpacity) * 0.5;
              
              // Connection line
              const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
              gradient.addColorStop(0, `hsla(185, 20%, 38%, ${avgOpacity * 0.35})`);
              gradient.addColorStop(0.5, `hsla(185, 20%, 38%, ${avgOpacity * 0.5})`);
              gradient.addColorStop(1, `hsla(185, 20%, 38%, ${avgOpacity * 0.35})`);
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.4 + layer * 0.15;
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
          
          if (opacity > 0.02) {
            ctx.beginPath();
            ctx.fillStyle = `hsla(180, 25%, 55%, ${opacity})`;
            ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Draw nodes
        layerNodes.forEach(node => {
          const opacity = node.getOpacity(currentProgress, system.time);
          const size = node.getSize(currentProgress);
          
          // Soft glow around node
          const glowSize = size * (3 + layer);
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, glowSize
          );
          glowGradient.addColorStop(0, `hsla(180, 25%, 45%, ${opacity * 0.3})`);
          glowGradient.addColorStop(0.5, `hsla(180, 25%, 45%, ${opacity * 0.1})`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.fillStyle = glowGradient;
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Node core
          ctx.beginPath();
          ctx.fillStyle = `hsla(180, 20%, 50%, ${opacity})`;
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
  }, [initSystem, progress, scrollVelocity]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
    />
  );
};
