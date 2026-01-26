import { useRef, useEffect, useCallback } from 'react';

// Narrative tension curve - maps scroll progress to emotional state
const getNarrativeTension = (progress) => {
  // Entry (0-8%): Subtle uncertainty
  if (progress < 0.08) {
    return {
      phase: 'entry',
      chaos: 0.3 + progress * 2, // Slight chaos
      stability: 0.2,
      tension: 0.15,
      motionScale: 0.6
    };
  }
  
  // Pain (8-35%): Cumulative chaos building
  if (progress < 0.35) {
    const painProgress = (progress - 0.08) / 0.27;
    // Chaos builds cumulatively - not linear, but accelerating
    const cumulativeChaos = Math.pow(painProgress, 0.7); // Accelerating curve
    // Peak tension at end of pain section
    const tensionCurve = Math.sin(painProgress * Math.PI * 0.9) * 0.5 + cumulativeChaos * 0.5;
    
    return {
      phase: 'pain',
      chaos: 0.4 + cumulativeChaos * 0.6, // Builds from 0.4 to 1.0
      stability: 0.15 - cumulativeChaos * 0.1, // Decreases
      tension: 0.3 + tensionCurve * 0.7, // High tension
      motionScale: 0.7 + cumulativeChaos * 0.4, // More motion as chaos builds
      painLevel: Math.floor(painProgress * 3) + 1 // 1, 2, or 3
    };
  }
  
  // How (35-60%): Active reorganization - chaos collapses into structure
  if (progress < 0.60) {
    const howProgress = (progress - 0.35) / 0.25;
    // Chaos actively collapsing - fast at first, then settling
    const chaosCollapse = 1 - Math.pow(howProgress, 0.5);
    // Structure emerging - slow at first, then accelerating
    const structureEmergence = Math.pow(howProgress, 1.5);
    
    return {
      phase: 'how',
      chaos: 0.8 * chaosCollapse, // Drops from 0.8 to 0
      stability: 0.2 + structureEmergence * 0.5, // Rises
      tension: 0.4 * chaosCollapse, // Drops
      motionScale: 0.8 - howProgress * 0.3, // Settling
      reorganizing: true,
      reorganizeStrength: 1 - chaosCollapse // How strongly nodes seek order
    };
  }
  
  // Proof (60-80%): Stable, confident, minimal motion
  if (progress < 0.80) {
    const proofProgress = (progress - 0.60) / 0.20;
    
    return {
      phase: 'proof',
      chaos: 0.05,
      stability: 0.7 + proofProgress * 0.15,
      tension: 0.05,
      motionScale: 0.3 - proofProgress * 0.1 // Very little motion
    };
  }
  
  // Decision (80-95%): Near silence - the system is complete
  if (progress < 0.95) {
    const decisionProgress = (progress - 0.80) / 0.15;
    
    return {
      phase: 'decision',
      chaos: 0.02,
      stability: 0.85 + decisionProgress * 0.1,
      tension: 0.02,
      motionScale: 0.15 - decisionProgress * 0.1 // Almost no motion
    };
  }
  
  // Action (95-100%): Complete trust
  return {
    phase: 'action',
    chaos: 0.01,
    stability: 0.95,
    tension: 0.01,
    motionScale: 0.08 // Minimal breathing only
  };
};

// System node - represents connection points in the network
class SystemNode {
  constructor(x, y, layer, index) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.layer = layer;
    this.index = index;
    this.connections = [];
    
    // Phase offsets for organic variation
    this.breathPhase = Math.random() * Math.PI * 2;
    this.driftPhase = Math.random() * Math.PI * 2;
    this.noisePhase = Math.random() * Math.PI * 2;
    
    // Visual properties
    this.size = 1.3 + layer * 0.4;
    this.baseOpacity = 0.12 + layer * 0.06;
    
    // Chaos state - unique displacement when chaotic
    this.chaosVector = {
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100
    };
    
    // Ordered grid position
    this.orderedX = x;
    this.orderedY = y;
    
    // Velocity for smooth transitions
    this.vx = 0;
    this.vy = 0;
  }
  
  setOrderedPosition(x, y) {
    this.orderedX = x;
    this.orderedY = y;
  }
  
  update(narrative, time, scrollVelocity, isPaused, pauseDuration) {
    const { chaos, stability, tension, motionScale, reorganizing, reorganizeStrength, phase } = narrative;
    
    // Pause calming effect - system settles when user pauses
    const pauseCalm = isPaused ? Math.min(pauseDuration / 3000, 0.5) : 0;
    const effectiveChaos = chaos * (1 - pauseCalm * 0.6);
    const effectiveMotion = motionScale * (1 - pauseCalm * 0.4);
    
    // Scroll speed tension - faster scrolling adds subtle tension
    const scrollTension = Math.min(Math.abs(scrollVelocity) * 0.02, 0.15);
    const effectiveTension = tension + scrollTension * (1 - stability);
    
    // === MOTION CALCULATIONS ===
    
    // 1. Breathing - always present but scaled by motionScale
    const breathSpeed = 0.05 * effectiveMotion;
    const breathAmount = (2 + effectiveChaos * 4) * effectiveMotion;
    const breathX = Math.sin(time * breathSpeed + this.breathPhase) * breathAmount;
    const breathY = Math.cos(time * breathSpeed * 0.7 + this.breathPhase) * breathAmount;
    
    // 2. Drift - organic wandering, more when chaotic
    const driftSpeed = 0.03 + effectiveChaos * 0.05;
    const driftAmount = (5 * effectiveChaos + 1 * stability) * effectiveMotion;
    const driftX = Math.sin(time * driftSpeed + this.driftPhase) * driftAmount;
    const driftY = Math.cos(time * driftSpeed * 0.8 + this.driftPhase * 1.3) * driftAmount;
    
    // 3. Noise/jitter - tension creates micro-instability
    const noiseAmount = effectiveTension * 3 * effectiveMotion;
    const noiseX = Math.sin(time * 0.5 + this.noisePhase * 7) * noiseAmount;
    const noiseY = Math.cos(time * 0.6 + this.noisePhase * 5) * noiseAmount;
    
    // 4. Chaos displacement - pulls nodes away from order
    const chaosX = this.chaosVector.x * effectiveChaos;
    const chaosY = this.chaosVector.y * effectiveChaos;
    
    // 5. Order pull - pulls nodes toward grid positions
    const orderPull = stability * (reorganizing ? reorganizeStrength * 1.5 : 1);
    
    // Calculate base position (blend between chaotic and ordered)
    const baseX = this.baseX * (1 - orderPull) + this.orderedX * orderPull;
    const baseY = this.baseY * (1 - orderPull) + this.orderedY * orderPull;
    
    // 6. Scroll velocity response
    const velocityOffsetY = scrollVelocity * (0.2 + this.layer * 0.15) * (1 - stability * 0.5);
    
    // Combine all motion
    this.targetX = baseX + breathX + driftX + noiseX + chaosX;
    this.targetY = baseY + breathY + driftY + noiseY + chaosY + velocityOffsetY;
    
    // Smooth interpolation with momentum
    // Slower when stable (feels solid), faster when chaotic (feels unstable)
    const lerpSpeed = 0.008 + effectiveChaos * 0.02 + (reorganizing ? 0.015 : 0);
    
    // Add subtle momentum for organic feel
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.vx = this.vx * 0.8 + dx * lerpSpeed;
    this.vy = this.vy * 0.8 + dy * lerpSpeed;
    
    this.x += this.vx;
    this.y += this.vy;
  }
  
  getOpacity(narrative, time) {
    const { stability, tension, phase } = narrative;
    
    // Base opacity varies slightly
    const pulse = Math.sin(time * 0.15 + this.breathPhase) * 0.05;
    
    // More visible when stable
    const stabilityBoost = stability * 0.15;
    
    // Slight dimming during high tension
    const tensionDim = tension * 0.1;
    
    // Decision phase - nodes become clearer
    const phaseBoost = phase === 'decision' || phase === 'action' ? 0.1 : 0;
    
    return Math.max(0.06, Math.min(0.4, 
      this.baseOpacity + pulse + stabilityBoost - tensionDim + phaseBoost
    ));
  }
  
  getSize(narrative) {
    const { stability, phase } = narrative;
    // Slightly larger and more consistent when stable
    const stabilityScale = 0.9 + stability * 0.15;
    // Decision phase - nodes feel more solid
    const phaseScale = phase === 'decision' || phase === 'action' ? 1.05 : 1;
    return this.size * stabilityScale * phaseScale;
  }
}

// Flow particle - energy moving through connections
class FlowParticle {
  constructor(startNode, endNode, layer) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.layer = layer;
    this.progress = Math.random();
    this.baseSpeed = 0.0012 + Math.random() * 0.0015;
    this.speed = this.baseSpeed;
    this.opacity = 0.06 + layer * 0.03;
    this.size = 0.7 + layer * 0.25;
    this.wobblePhase = Math.random() * Math.PI * 2;
    this.active = true;
  }
  
  update(narrative, time, scrollVelocity, isPaused) {
    const { chaos, stability, tension, motionScale, phase } = narrative;
    
    // Flow behavior changes with narrative
    if (phase === 'decision' || phase === 'action') {
      // Very slow, steady flow
      this.speed = this.baseSpeed * 0.3 * motionScale;
    } else if (phase === 'proof') {
      // Slow, confident flow
      this.speed = this.baseSpeed * 0.5 * motionScale;
    } else if (phase === 'pain') {
      // Erratic, uncertain flow
      const erratic = 0.5 + Math.sin(time * 2 + this.wobblePhase) * 0.4;
      this.speed = this.baseSpeed * erratic * (0.8 + chaos * 0.6) * motionScale;
    } else if (phase === 'how') {
      // Purposeful, aligning flow
      this.speed = this.baseSpeed * (0.6 + stability * 0.5) * motionScale;
    } else {
      // Entry - gentle, uncertain
      this.speed = this.baseSpeed * 0.7 * motionScale;
    }
    
    // Pause slows flow
    if (isPaused) {
      this.speed *= 0.4;
    }
    
    // Scroll affects flow
    const scrollBoost = 1 + Math.abs(scrollVelocity) * 0.008 * (1 - stability);
    this.speed *= scrollBoost;
    
    this.progress += this.speed;
    
    if (this.progress > 1) {
      this.progress = 0;
      // In chaotic states, sometimes skip or stutter
      if (chaos > 0.5 && Math.random() < chaos * 0.3) {
        this.progress = Math.random() * 0.2;
      }
    }
  }
  
  getPosition() {
    const t = this.progress;
    const easedT = t * t * (3 - 2 * t);
    return {
      x: this.startNode.x + (this.endNode.x - this.startNode.x) * easedT,
      y: this.startNode.y + (this.endNode.y - this.startNode.y) * easedT
    };
  }
  
  getOpacity(narrative) {
    const { stability, phase } = narrative;
    const edgeFade = Math.sin(this.progress * Math.PI);
    
    // More visible when stable - reliable data flow
    const stabilityBoost = stability * 0.5;
    
    // Decision phase - subtle, confident
    const phaseOpacity = phase === 'decision' ? 0.6 : 1;
    
    return this.opacity * edgeFade * (0.4 + stabilityBoost) * phaseOpacity;
  }
}

export const LivingSystemBackground = ({ progress, scrollVelocity }) => {
  const canvasRef = useRef(null);
  const systemRef = useRef({
    nodes: [],
    particles: [],
    initialized: false,
    time: 0,
    lastProgress: 0,
    isPaused: false,
    pauseStartTime: 0,
    lastScrollTime: Date.now()
  });
  
  const initSystem = useCallback((width, height) => {
    const system = systemRef.current;
    system.nodes = [];
    system.particles = [];
    
    const layers = [
      { count: 38, connectionThreshold: 240 },
      { count: 26, connectionThreshold: 210 },
      { count: 16, connectionThreshold: 185 }
    ];
    
    let nodeIndex = 0;
    const padding = 60;
    
    layers.forEach((layerConfig, layerIndex) => {
      const layerNodes = [];
      
      for (let i = 0; i < layerConfig.count; i++) {
        // Organic initial distribution
        const angle = (i / layerConfig.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
        const radius = 0.15 + Math.random() * 0.4;
        
        let x, y;
        if (Math.random() > 0.35) {
          // Radial distribution
          x = width * 0.5 + Math.cos(angle) * width * radius;
          y = height * 0.5 + Math.sin(angle) * height * radius;
        } else {
          // Random scatter
          x = padding + Math.random() * (width - padding * 2);
          y = padding + Math.random() * (height - padding * 2);
        }
        
        x = Math.max(padding, Math.min(width - padding, x));
        y = Math.max(padding, Math.min(height - padding, y));
        
        const node = new SystemNode(x, y, layerIndex, nodeIndex++);
        
        // Calculate ordered grid position
        const gridCols = Math.ceil(Math.sqrt(layerConfig.count * (width / height)));
        const gridRows = Math.ceil(layerConfig.count / gridCols);
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        const cellWidth = (width - padding * 2) / gridCols;
        const cellHeight = (height - padding * 2) / gridRows;
        
        node.setOrderedPosition(
          padding + cellWidth * (col + 0.5),
          padding + cellHeight * (row + 0.5)
        );
        
        layerNodes.push(node);
        system.nodes.push(node);
      }
      
      // Create connections
      layerNodes.forEach((node, i) => {
        layerNodes.forEach((other, j) => {
          if (i >= j) return;
          
          const dx = node.orderedX - other.orderedX;
          const dy = node.orderedY - other.orderedY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < layerConfig.connectionThreshold) {
            const prob = 1 - (distance / layerConfig.connectionThreshold) * 0.5;
            if (Math.random() < prob) {
              node.connections.push(other);
              
              // Flow particles
              if (Math.random() > 0.55) {
                system.particles.push(new FlowParticle(node, other, layerIndex));
              }
              if (Math.random() > 0.7) {
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
      
      // Detect pause state
      const now = Date.now();
      const isScrolling = Math.abs(currentVelocity) > 0.3;
      
      if (isScrolling) {
        system.lastScrollTime = now;
        system.isPaused = false;
      } else if (now - system.lastScrollTime > 500) {
        if (!system.isPaused) {
          system.isPaused = true;
          system.pauseStartTime = now;
        }
      }
      
      const pauseDuration = system.isPaused ? now - system.pauseStartTime : 0;
      
      // Get narrative state
      const narrative = getNarrativeTension(currentProgress);
      
      system.time += 0.016;
      
      // Update all nodes
      system.nodes.forEach(node => {
        node.update(narrative, system.time, currentVelocity, system.isPaused, pauseDuration);
      });
      
      // Update all particles
      system.particles.forEach(particle => {
        particle.update(narrative, system.time, currentVelocity, system.isPaused);
      });
      
      // Draw layers
      for (let layer = 0; layer < 3; layer++) {
        const layerNodes = system.nodes.filter(n => n.layer === layer);
        const layerParticles = system.particles.filter(p => p.layer === layer);
        
        const parallaxFactor = [0.25, 0.55, 1.0][layer];
        const parallaxY = currentVelocity * parallaxFactor * 1.2;
        
        ctx.save();
        ctx.translate(0, parallaxY);
        
        // Draw connections
        layerNodes.forEach(node => {
          node.connections.forEach(other => {
            if (node.index < other.index) {
              const nodeOpacity = node.getOpacity(narrative, system.time);
              const otherOpacity = other.getOpacity(narrative, system.time);
              const avgOpacity = (nodeOpacity + otherOpacity) * 0.5;
              
              // Connection strength varies with stability
              const stabilityBoost = narrative.stability * 0.3;
              
              const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
              gradient.addColorStop(0, `hsla(185, 18%, 42%, ${(avgOpacity + stabilityBoost) * 0.45})`);
              gradient.addColorStop(0.5, `hsla(185, 18%, 42%, ${(avgOpacity + stabilityBoost) * 0.65})`);
              gradient.addColorStop(1, `hsla(185, 18%, 42%, ${(avgOpacity + stabilityBoost) * 0.45})`);
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.4 + layer * 0.15 + narrative.stability * 0.15;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        });
        
        // Draw flow particles
        layerParticles.forEach(particle => {
          const pos = particle.getPosition();
          const opacity = particle.getOpacity(narrative);
          
          if (opacity > 0.012) {
            // Glow
            const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, particle.size * 2.5);
            glowGrad.addColorStop(0, `hsla(180, 25%, 58%, ${opacity * 0.5})`);
            glowGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.fillStyle = glowGrad;
            ctx.arc(pos.x, pos.y, particle.size * 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Core
            ctx.beginPath();
            ctx.fillStyle = `hsla(180, 25%, 62%, ${opacity})`;
            ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Draw nodes
        layerNodes.forEach(node => {
          const opacity = node.getOpacity(narrative, system.time);
          const size = node.getSize(narrative);
          
          // Glow
          const glowSize = size * (3.5 + layer);
          const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
          glowGradient.addColorStop(0, `hsla(180, 22%, 50%, ${opacity * 0.3})`);
          glowGradient.addColorStop(0.5, `hsla(180, 22%, 50%, ${opacity * 0.12})`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.fillStyle = glowGradient;
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Core
          ctx.beginPath();
          ctx.fillStyle = `hsla(180, 20%, 52%, ${opacity})`;
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Bright center
          ctx.beginPath();
          ctx.fillStyle = `hsla(180, 18%, 68%, ${opacity * 0.7})`;
          ctx.arc(node.x, node.y, size * 0.35, 0, Math.PI * 2);
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
