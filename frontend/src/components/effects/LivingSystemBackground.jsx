import { useRef, useEffect, useCallback } from 'react';

// Narrative tension with ACCUMULATED stress during Pain
const getNarrativeTension = (progress) => {
  // Entry (0-8%): Subtle uncertainty, system is functional but not optimized
  if (progress < 0.08) {
    const entryProgress = progress / 0.08;
    return {
      phase: 'entry',
      accumulatedStress: 0,
      chaos: 0.15 + entryProgress * 0.1,
      misalignment: 0.1,
      desync: 0.1,
      stability: 0.3,
      motionScale: 0.5,
      pressure: 0
    };
  }
  
  // Pain (8-38%): CUMULATIVE stress building - each statement adds permanently
  if (progress < 0.38) {
    const painProgress = (progress - 0.08) / 0.30;
    
    // Three pain thresholds - stress accumulates at each
    // Pain 1: "Projects stall." (0-33% of pain section)
    // Pain 2: "No clear ownership." (33-66% of pain section)
    // Pain 3: "Manual work kills growth." (66-100% of pain section)
    
    let accumulatedStress = 0;
    let misalignment = 0.1;
    let desync = 0.1;
    let pressure = 0;
    
    // Pain 1 stress (permanently added after crossing threshold)
    if (painProgress > 0.05) {
      const pain1Factor = Math.min((painProgress - 0.05) / 0.25, 1);
      accumulatedStress += 0.25 * pain1Factor;
      misalignment += 0.15 * pain1Factor; // Lines start losing alignment
      desync += 0.12 * pain1Factor; // Flows start desyncing
      pressure += 0.2 * pain1Factor;
    }
    
    // Pain 2 stress (adds on top of pain 1)
    if (painProgress > 0.35) {
      const pain2Factor = Math.min((painProgress - 0.35) / 0.25, 1);
      accumulatedStress += 0.35 * pain2Factor;
      misalignment += 0.25 * pain2Factor; // More misalignment
      desync += 0.2 * pain2Factor; // Flows more erratic
      pressure += 0.3 * pain2Factor;
    }
    
    // Pain 3 stress (peak - adds on top of pain 1 + 2)
    if (painProgress > 0.68) {
      const pain3Factor = Math.min((painProgress - 0.68) / 0.25, 1);
      accumulatedStress += 0.4 * pain3Factor;
      misalignment += 0.3 * pain3Factor; // Maximum misalignment
      desync += 0.28 * pain3Factor; // Flows feel broken
      pressure += 0.5 * pain3Factor;
    }
    
    // Chaos is based on accumulated stress
    const chaos = 0.2 + accumulatedStress * 0.8;
    
    return {
      phase: 'pain',
      painLevel: painProgress < 0.33 ? 1 : painProgress < 0.66 ? 2 : 3,
      accumulatedStress,
      chaos,
      misalignment, // How much lines deviate from proper alignment
      desync, // How unsynchronized flows are
      stability: Math.max(0.05, 0.25 - accumulatedStress * 0.25),
      motionScale: 0.5 + accumulatedStress * 0.3, // More agitated motion
      pressure // Operational pressure feeling
    };
  }
  
  // End of Pain / Start of How: System is OVERLOADED
  // This is the peak stress moment before relief begins
  if (progress < 0.42) {
    const transitionProgress = (progress - 0.38) / 0.04;
    
    // Peak accumulated stress - system feels unsustainable
    const peakStress = 1.0;
    const reliefBeginning = transitionProgress * 0.1; // Very slight relief starting
    
    return {
      phase: 'pain-peak',
      accumulatedStress: peakStress - reliefBeginning * 0.1,
      chaos: 0.85 - reliefBeginning * 0.05,
      misalignment: 0.7 - reliefBeginning * 0.05,
      desync: 0.6 - reliefBeginning * 0.05,
      stability: 0.08 + reliefBeginning * 0.05,
      motionScale: 0.75,
      pressure: 0.9,
      overloaded: true
    };
  }
  
  // How (42-62%): Active stress relief - system reorganizes
  if (progress < 0.62) {
    const howProgress = (progress - 0.42) / 0.20;
    
    // Stress relief is gradual and earned
    // Fast relief at first (the "aha" moment), then settling
    const reliefCurve = Math.pow(howProgress, 0.6); // Front-loaded relief
    
    // Accumulated stress slowly drains
    const remainingStress = 1.0 * (1 - reliefCurve * 0.85);
    
    return {
      phase: 'how',
      accumulatedStress: remainingStress,
      chaos: 0.8 * (1 - reliefCurve * 0.9),
      misalignment: 0.7 * (1 - reliefCurve * 0.85),
      desync: 0.6 * (1 - reliefCurve * 0.9),
      stability: 0.1 + reliefCurve * 0.55,
      motionScale: 0.7 - reliefCurve * 0.35,
      pressure: 0.85 * (1 - reliefCurve * 0.9),
      reorganizing: true,
      reorganizeStrength: reliefCurve
    };
  }
  
  // Proof (62-82%): Stable, stress fully resolved
  if (progress < 0.82) {
    const proofProgress = (progress - 0.62) / 0.20;
    
    return {
      phase: 'proof',
      accumulatedStress: 0.1 * (1 - proofProgress),
      chaos: 0.05,
      misalignment: 0.08 * (1 - proofProgress * 0.5),
      desync: 0.05,
      stability: 0.7 + proofProgress * 0.15,
      motionScale: 0.25 - proofProgress * 0.08,
      pressure: 0
    };
  }
  
  // Decision (82-96%): Near silence
  if (progress < 0.96) {
    const decisionProgress = (progress - 0.82) / 0.14;
    
    return {
      phase: 'decision',
      accumulatedStress: 0,
      chaos: 0.02,
      misalignment: 0.03,
      desync: 0.02,
      stability: 0.88 + decisionProgress * 0.08,
      motionScale: 0.12 - decisionProgress * 0.06,
      pressure: 0
    };
  }
  
  // Action (96-100%): Complete trust
  return {
    phase: 'action',
    accumulatedStress: 0,
    chaos: 0.01,
    misalignment: 0.02,
    desync: 0.01,
    stability: 0.96,
    motionScale: 0.06,
    pressure: 0
  };
};

// System node with stress response
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
    
    // Unique phase offsets
    this.breathPhase = Math.random() * Math.PI * 2;
    this.driftPhase = Math.random() * Math.PI * 2;
    this.stressPhase = Math.random() * Math.PI * 2;
    
    // Visual properties
    this.size = 1.2 + layer * 0.35;
    this.baseOpacity = 0.11 + layer * 0.05;
    
    // Stress displacement - unique per node, activated by accumulated stress
    this.stressVector = {
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120
    };
    
    // Misalignment direction - unique per node
    this.misalignAngle = Math.random() * Math.PI * 2;
    this.misalignMagnitude = 20 + Math.random() * 40;
    
    // Ordered position (grid)
    this.orderedX = x;
    this.orderedY = y;
    
    // Velocity for smooth motion
    this.vx = 0;
    this.vy = 0;
  }
  
  setOrderedPosition(x, y) {
    this.orderedX = x;
    this.orderedY = y;
  }
  
  update(narrative, time, scrollVelocity, isPaused, pauseDuration) {
    const { 
      accumulatedStress, 
      chaos, 
      misalignment, 
      stability, 
      motionScale, 
      pressure,
      reorganizing,
      reorganizeStrength = 0
    } = narrative;
    
    // Pause calming - but stress doesn't fully disappear
    const pauseCalm = isPaused ? Math.min(pauseDuration / 4000, 0.3) : 0;
    const effectiveMotion = motionScale * (1 - pauseCalm * 0.5);
    
    // === STRESS-BASED DISPLACEMENT ===
    
    // 1. Accumulated stress displacement - PERMANENT until How phase
    const stressDisplaceX = this.stressVector.x * accumulatedStress * 0.7;
    const stressDisplaceY = this.stressVector.y * accumulatedStress * 0.7;
    
    // 2. Misalignment - lines/connections feel "off"
    const misalignX = Math.cos(this.misalignAngle) * this.misalignMagnitude * misalignment;
    const misalignY = Math.sin(this.misalignAngle) * this.misalignMagnitude * misalignment;
    
    // 3. Pressure tremor - subtle uncomfortable vibration under stress
    const pressureTremor = pressure * 2 * effectiveMotion;
    const tremorX = Math.sin(time * 1.5 + this.stressPhase * 3) * pressureTremor;
    const tremorY = Math.cos(time * 1.8 + this.stressPhase * 2) * pressureTremor;
    
    // 4. Breathing - always present but affected by stress
    const breathScale = (1 - pressure * 0.5) * effectiveMotion;
    const breathX = Math.sin(time * 0.05 + this.breathPhase) * 2 * breathScale;
    const breathY = Math.cos(time * 0.04 + this.breathPhase) * 2 * breathScale;
    
    // 5. Organic drift - reduced under stress (system is "locked up")
    const driftScale = (1 - accumulatedStress * 0.6) * effectiveMotion;
    const driftX = Math.sin(time * 0.03 + this.driftPhase) * 4 * driftScale;
    const driftY = Math.cos(time * 0.025 + this.driftPhase) * 4 * driftScale;
    
    // 6. Scroll velocity response
    const velocityScale = 1 - stability * 0.5;
    const velocityOffsetY = scrollVelocity * (0.15 + this.layer * 0.1) * velocityScale;
    
    // === POSITION CALCULATION ===
    
    // Base position interpolates between stressed and ordered
    const orderPull = stability + (reorganizing ? reorganizeStrength * 0.8 : 0);
    const stressPull = 1 - orderPull;
    
    // Stressed position = base + stress displacement + misalignment
    const stressedX = this.baseX + stressDisplaceX + misalignX;
    const stressedY = this.baseY + stressDisplaceY + misalignY;
    
    // Blend between stressed and ordered
    const baseX = stressedX * stressPull + this.orderedX * orderPull;
    const baseY = stressedY * stressPull + this.orderedY * orderPull;
    
    // Final target with motion
    this.targetX = baseX + breathX + driftX + tremorX;
    this.targetY = baseY + breathY + driftY + tremorY + velocityOffsetY;
    
    // Interpolation speed - slower when stable, slightly faster under stress
    const lerpSpeed = 0.006 + (reorganizing ? 0.012 : 0) + accumulatedStress * 0.004;
    
    // Velocity-based movement for organic feel
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.vx = this.vx * 0.85 + dx * lerpSpeed;
    this.vy = this.vy * 0.85 + dy * lerpSpeed;
    
    this.x += this.vx;
    this.y += this.vy;
  }
  
  getOpacity(narrative, time) {
    const { stability, pressure, accumulatedStress } = narrative;
    
    // Subtle pulse
    const pulse = Math.sin(time * 0.12 + this.breathPhase) * 0.03;
    
    // Under stress, opacity becomes slightly uneven (system strain)
    const strainFlicker = accumulatedStress * 0.05 * Math.sin(time * 0.8 + this.stressPhase);
    
    // Stability increases visibility
    const stabilityBoost = stability * 0.12;
    
    return Math.max(0.05, Math.min(0.38, 
      this.baseOpacity + pulse + stabilityBoost - strainFlicker
    ));
  }
  
  getSize(narrative) {
    const { stability, pressure } = narrative;
    // Slightly smaller under pressure (system strained)
    const pressureScale = 1 - pressure * 0.1;
    const stabilityScale = 0.9 + stability * 0.12;
    return this.size * pressureScale * stabilityScale;
  }
}

// Flow particle with desync behavior
class FlowParticle {
  constructor(startNode, endNode, layer) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.layer = layer;
    this.progress = Math.random();
    this.baseSpeed = 0.001 + Math.random() * 0.0012;
    this.speed = this.baseSpeed;
    this.opacity = 0.055 + layer * 0.025;
    this.size = 0.65 + layer * 0.22;
    
    // Desync properties - unique timing offset
    this.syncPhase = Math.random() * Math.PI * 2;
    this.desyncSensitivity = 0.5 + Math.random() * 0.5;
  }
  
  update(narrative, time, scrollVelocity, isPaused) {
    const { desync, stability, motionScale, phase, pressure } = narrative;
    
    // Base speed varies by phase
    let speedMod = 1;
    
    if (phase === 'decision' || phase === 'action') {
      speedMod = 0.25; // Very slow, reliable
    } else if (phase === 'proof') {
      speedMod = 0.4; // Slow, confident
    } else if (phase === 'pain' || phase === 'pain-peak') {
      // Desync causes erratic timing - flows feel "off"
      const desyncOffset = Math.sin(time * 1.2 + this.syncPhase) * desync * this.desyncSensitivity;
      speedMod = 0.5 + desyncOffset + pressure * 0.2;
      
      // Sometimes flows stutter under pressure
      if (pressure > 0.5 && Math.sin(time * 2 + this.syncPhase * 5) > 0.7) {
        speedMod *= 0.3;
      }
    } else if (phase === 'how') {
      // Flows synchronizing - becoming purposeful
      speedMod = 0.5 + stability * 0.4;
    } else {
      speedMod = 0.6;
    }
    
    // Pause slows flow
    if (isPaused) {
      speedMod *= 0.5;
    }
    
    this.speed = this.baseSpeed * speedMod * motionScale;
    this.progress += this.speed;
    
    if (this.progress > 1) {
      this.progress = 0;
      // Under stress, some flows hesitate before restarting
      if (pressure > 0.3 && Math.random() < pressure * 0.4) {
        this.progress = -0.1 * Math.random(); // Brief pause
      }
    }
    
    // Clamp to valid range
    this.progress = Math.max(0, this.progress);
  }
  
  getPosition() {
    const t = Math.max(0, Math.min(1, this.progress));
    const easedT = t * t * (3 - 2 * t);
    return {
      x: this.startNode.x + (this.endNode.x - this.startNode.x) * easedT,
      y: this.startNode.y + (this.endNode.y - this.startNode.y) * easedT
    };
  }
  
  getOpacity(narrative) {
    const { stability, desync, phase } = narrative;
    
    if (this.progress < 0) return 0; // Hidden during hesitation
    
    const edgeFade = Math.sin(this.progress * Math.PI);
    
    // Desync makes flows inconsistent in visibility
    const desyncFade = 1 - desync * 0.3 * Math.abs(Math.sin(this.syncPhase * 3));
    
    // More visible when stable
    const stabilityBoost = stability * 0.4;
    
    return this.opacity * edgeFade * desyncFade * (0.5 + stabilityBoost);
  }
}

export const LivingSystemBackground = ({ progress, scrollVelocity }) => {
  const canvasRef = useRef(null);
  const systemRef = useRef({
    nodes: [],
    particles: [],
    initialized: false,
    time: 0,
    isPaused: false,
    pauseStartTime: 0,
    lastScrollTime: Date.now()
  });
  
  const initSystem = useCallback((width, height) => {
    const system = systemRef.current;
    system.nodes = [];
    system.particles = [];
    
    const layers = [
      { count: 40, connectionThreshold: 235 },
      { count: 28, connectionThreshold: 205 },
      { count: 18, connectionThreshold: 180 }
    ];
    
    let nodeIndex = 0;
    const padding = 55;
    
    layers.forEach((layerConfig, layerIndex) => {
      const layerNodes = [];
      
      for (let i = 0; i < layerConfig.count; i++) {
        // Organic initial distribution
        const angle = (i / layerConfig.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
        const radius = 0.18 + Math.random() * 0.38;
        
        let x, y;
        if (Math.random() > 0.3) {
          x = width * 0.5 + Math.cos(angle) * width * radius;
          y = height * 0.5 + Math.sin(angle) * height * radius;
        } else {
          x = padding + Math.random() * (width - padding * 2);
          y = padding + Math.random() * (height - padding * 2);
        }
        
        x = Math.max(padding, Math.min(width - padding, x));
        y = Math.max(padding, Math.min(height - padding, y));
        
        const node = new SystemNode(x, y, layerIndex, nodeIndex++);
        
        // Grid position for ordered state
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
            const prob = 1 - (distance / layerConfig.connectionThreshold) * 0.45;
            if (Math.random() < prob) {
              node.connections.push(other);
              
              if (Math.random() > 0.5) {
                system.particles.push(new FlowParticle(node, other, layerIndex));
              }
              if (Math.random() > 0.65) {
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
      
      const currentProgress = typeof progress.get === 'function' ? progress.get() : 0;
      const currentVelocity = typeof scrollVelocity.get === 'function' ? scrollVelocity.get() : 0;
      
      // Pause detection
      const now = Date.now();
      const isScrolling = Math.abs(currentVelocity) > 0.25;
      
      if (isScrolling) {
        system.lastScrollTime = now;
        system.isPaused = false;
      } else if (now - system.lastScrollTime > 600) {
        if (!system.isPaused) {
          system.isPaused = true;
          system.pauseStartTime = now;
        }
      }
      
      const pauseDuration = system.isPaused ? now - system.pauseStartTime : 0;
      
      // Get narrative state with accumulated stress
      const narrative = getNarrativeTension(currentProgress);
      
      system.time += 0.016;
      
      // Update nodes
      system.nodes.forEach(node => {
        node.update(narrative, system.time, currentVelocity, system.isPaused, pauseDuration);
      });
      
      // Update particles
      system.particles.forEach(particle => {
        particle.update(narrative, system.time, currentVelocity, system.isPaused);
      });
      
      // Draw layers
      for (let layer = 0; layer < 3; layer++) {
        const layerNodes = system.nodes.filter(n => n.layer === layer);
        const layerParticles = system.particles.filter(p => p.layer === layer);
        
        const parallaxFactor = [0.22, 0.52, 1.0][layer];
        const parallaxY = currentVelocity * parallaxFactor * 1.0;
        
        ctx.save();
        ctx.translate(0, parallaxY);
        
        // Draw connections - affected by misalignment
        layerNodes.forEach(node => {
          node.connections.forEach(other => {
            if (node.index < other.index) {
              const nodeOpacity = node.getOpacity(narrative, system.time);
              const otherOpacity = other.getOpacity(narrative, system.time);
              const avgOpacity = (nodeOpacity + otherOpacity) * 0.5;
              
              // Connection stability affects appearance
              const stabilityBoost = narrative.stability * 0.25;
              const stressWobble = narrative.pressure * 0.08;
              
              const lineOpacity = (avgOpacity + stabilityBoost) * (0.45 + narrative.stability * 0.2);
              
              const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
              gradient.addColorStop(0, `hsla(185, 18%, 42%, ${lineOpacity * 0.7})`);
              gradient.addColorStop(0.5, `hsla(185, 18%, 42%, ${lineOpacity})`);
              gradient.addColorStop(1, `hsla(185, 18%, 42%, ${lineOpacity * 0.7})`);
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.35 + layer * 0.12 + narrative.stability * 0.18;
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
          
          if (opacity > 0.01) {
            // Glow
            const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, particle.size * 2.2);
            glowGrad.addColorStop(0, `hsla(180, 22%, 56%, ${opacity * 0.45})`);
            glowGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.fillStyle = glowGrad;
            ctx.arc(pos.x, pos.y, particle.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Core
            ctx.beginPath();
            ctx.fillStyle = `hsla(180, 22%, 60%, ${opacity * 0.9})`;
            ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Draw nodes
        layerNodes.forEach(node => {
          const opacity = node.getOpacity(narrative, system.time);
          const size = node.getSize(narrative);
          
          // Glow
          const glowSize = size * (3.2 + layer * 0.8);
          const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
          glowGradient.addColorStop(0, `hsla(180, 20%, 48%, ${opacity * 0.28})`);
          glowGradient.addColorStop(0.5, `hsla(180, 20%, 48%, ${opacity * 0.1})`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.fillStyle = glowGradient;
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Core
          ctx.beginPath();
          ctx.fillStyle = `hsla(180, 18%, 50%, ${opacity * 0.95})`;
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Bright center
          ctx.beginPath();
          ctx.fillStyle = `hsla(180, 15%, 65%, ${opacity * 0.6})`;
          ctx.arc(node.x, node.y, size * 0.32, 0, Math.PI * 2);
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
