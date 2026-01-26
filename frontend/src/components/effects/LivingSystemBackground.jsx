import { useRef, useEffect, useCallback } from 'react';

// Color state based on narrative phase
const getColorState = (progress) => {
  // Entry (0-8%): Warm, tense - stressed system
  if (progress < 0.08) {
    return {
      hue: 25, // Amber/orange undertone
      saturation: 22,
      lightness: 42,
      bgWarmth: 0.15, // Subtle warm tint to background
      contrast: 1.0
    };
  }
  
  // Pain (8-38%): Increasing warmth and tension
  if (progress < 0.38) {
    const painProgress = (progress - 0.08) / 0.30;
    
    // Warmth increases through pain - from amber toward slightly more red
    const hue = 25 - painProgress * 12; // 25 -> 13 (more red/stressed)
    const saturation = 22 + painProgress * 8; // Slightly more saturated tension
    const lightness = 42 - painProgress * 4; // Slightly darker
    const bgWarmth = 0.15 + painProgress * 0.12; // Background gets warmer
    const contrast = 1.0 + painProgress * 0.15; // Heavier contrast
    
    return { hue, saturation, lightness, bgWarmth, contrast };
  }
  
  // Pain peak / How transition (38-42%): Maximum tension before relief
  if (progress < 0.42) {
    const transitionProgress = (progress - 0.38) / 0.04;
    
    // Peak warm, then starting to cool
    const hue = 13 + transitionProgress * 30; // 13 -> 43 (starting toward yellow/neutral)
    const saturation = 30 - transitionProgress * 5;
    const lightness = 38 + transitionProgress * 2;
    const bgWarmth = 0.27 - transitionProgress * 0.08;
    const contrast = 1.15 - transitionProgress * 0.05;
    
    return { hue, saturation, lightness, bgWarmth, contrast };
  }
  
  // How (42-62%): Cooling transition - warm to cool
  if (progress < 0.62) {
    const howProgress = (progress - 0.42) / 0.20;
    
    // Gradual shift from warm-neutral to cool
    // Using eased curve for natural feeling transition
    const easedProgress = howProgress * howProgress * (3 - 2 * howProgress);
    
    const hue = 43 + easedProgress * 120; // 43 -> 163 (yellow-green -> teal)
    const saturation = 25 - easedProgress * 8; // Desaturating toward calm
    const lightness = 40 + easedProgress * 6; // Slightly lighter
    const bgWarmth = 0.19 - easedProgress * 0.19; // Warmth fades to zero
    const contrast = 1.1 - easedProgress * 0.2; // Lower contrast = calmer
    
    return { hue, saturation, lightness, bgWarmth, contrast };
  }
  
  // Proof (62-82%): Cool, stable, calm
  if (progress < 0.82) {
    const proofProgress = (progress - 0.62) / 0.20;
    
    const hue = 163 + proofProgress * 15; // 163 -> 178 (deep teal)
    const saturation = 17 - proofProgress * 4; // Further desaturating
    const lightness = 46 + proofProgress * 3;
    const bgWarmth = 0;
    const contrast = 0.9 - proofProgress * 0.05;
    
    return { hue, saturation, lightness, bgWarmth, contrast };
  }
  
  // Decision (82-96%): Near-monochrome, resolved
  if (progress < 0.96) {
    const decisionProgress = (progress - 0.82) / 0.14;
    
    const hue = 178 + decisionProgress * 5; // Slight shift toward pure cyan
    const saturation = 13 - decisionProgress * 8; // Very desaturated
    const lightness = 49 + decisionProgress * 3;
    const bgWarmth = 0;
    const contrast = 0.85 - decisionProgress * 0.1;
    
    return { hue, saturation, lightness, bgWarmth, contrast };
  }
  
  // Action (96-100%): Complete calm, trustworthy
  return {
    hue: 183,
    saturation: 5, // Near monochrome
    lightness: 52,
    bgWarmth: 0,
    contrast: 0.75
  };
};

// Narrative tension with accumulated stress
const getNarrativeTension = (progress) => {
  // Get color state
  const colorState = getColorState(progress);
  
  if (progress < 0.08) {
    const entryProgress = progress / 0.08;
    return {
      phase: 'entry',
      accumulatedStress: 0.1,
      chaos: 0.15 + entryProgress * 0.1,
      misalignment: 0.12,
      desync: 0.1,
      stability: 0.3,
      motionScale: 0.5,
      pressure: 0.1,
      ...colorState
    };
  }
  
  if (progress < 0.38) {
    const painProgress = (progress - 0.08) / 0.30;
    
    let accumulatedStress = 0.1;
    let misalignment = 0.12;
    let desync = 0.1;
    let pressure = 0.1;
    
    // Pain 1
    if (painProgress > 0.05) {
      const pain1Factor = Math.min((painProgress - 0.05) / 0.25, 1);
      accumulatedStress += 0.25 * pain1Factor;
      misalignment += 0.15 * pain1Factor;
      desync += 0.12 * pain1Factor;
      pressure += 0.2 * pain1Factor;
    }
    
    // Pain 2
    if (painProgress > 0.35) {
      const pain2Factor = Math.min((painProgress - 0.35) / 0.25, 1);
      accumulatedStress += 0.35 * pain2Factor;
      misalignment += 0.25 * pain2Factor;
      desync += 0.2 * pain2Factor;
      pressure += 0.3 * pain2Factor;
    }
    
    // Pain 3
    if (painProgress > 0.68) {
      const pain3Factor = Math.min((painProgress - 0.68) / 0.25, 1);
      accumulatedStress += 0.4 * pain3Factor;
      misalignment += 0.3 * pain3Factor;
      desync += 0.28 * pain3Factor;
      pressure += 0.5 * pain3Factor;
    }
    
    return {
      phase: 'pain',
      painLevel: painProgress < 0.33 ? 1 : painProgress < 0.66 ? 2 : 3,
      accumulatedStress,
      chaos: 0.2 + accumulatedStress * 0.8,
      misalignment,
      desync,
      stability: Math.max(0.05, 0.25 - accumulatedStress * 0.25),
      motionScale: 0.5 + accumulatedStress * 0.3,
      pressure,
      ...colorState
    };
  }
  
  if (progress < 0.42) {
    const transitionProgress = (progress - 0.38) / 0.04;
    const peakStress = 1.0;
    const reliefBeginning = transitionProgress * 0.1;
    
    return {
      phase: 'pain-peak',
      accumulatedStress: peakStress - reliefBeginning * 0.1,
      chaos: 0.85 - reliefBeginning * 0.05,
      misalignment: 0.7 - reliefBeginning * 0.05,
      desync: 0.6 - reliefBeginning * 0.05,
      stability: 0.08 + reliefBeginning * 0.05,
      motionScale: 0.75,
      pressure: 0.9,
      overloaded: true,
      ...colorState
    };
  }
  
  if (progress < 0.62) {
    const howProgress = (progress - 0.42) / 0.20;
    const reliefCurve = Math.pow(howProgress, 0.6);
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
      reorganizeStrength: reliefCurve,
      ...colorState
    };
  }
  
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
      pressure: 0,
      ...colorState
    };
  }
  
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
      pressure: 0,
      ...colorState
    };
  }
  
  return {
    phase: 'action',
    accumulatedStress: 0,
    chaos: 0.01,
    misalignment: 0.02,
    desync: 0.01,
    stability: 0.96,
    motionScale: 0.06,
    pressure: 0,
    ...colorState
  };
};

// System node
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
    
    this.breathPhase = Math.random() * Math.PI * 2;
    this.driftPhase = Math.random() * Math.PI * 2;
    this.stressPhase = Math.random() * Math.PI * 2;
    
    this.size = 1.2 + layer * 0.35;
    this.baseOpacity = 0.11 + layer * 0.05;
    
    this.stressVector = {
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120
    };
    
    this.misalignAngle = Math.random() * Math.PI * 2;
    this.misalignMagnitude = 20 + Math.random() * 40;
    
    this.orderedX = x;
    this.orderedY = y;
    
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
      misalignment, 
      stability, 
      motionScale, 
      pressure,
      reorganizing,
      reorganizeStrength = 0
    } = narrative;
    
    const pauseCalm = isPaused ? Math.min(pauseDuration / 4000, 0.3) : 0;
    const effectiveMotion = motionScale * (1 - pauseCalm * 0.5);
    
    const stressDisplaceX = this.stressVector.x * accumulatedStress * 0.7;
    const stressDisplaceY = this.stressVector.y * accumulatedStress * 0.7;
    
    const misalignX = Math.cos(this.misalignAngle) * this.misalignMagnitude * misalignment;
    const misalignY = Math.sin(this.misalignAngle) * this.misalignMagnitude * misalignment;
    
    const pressureTremor = pressure * 2 * effectiveMotion;
    const tremorX = Math.sin(time * 1.5 + this.stressPhase * 3) * pressureTremor;
    const tremorY = Math.cos(time * 1.8 + this.stressPhase * 2) * pressureTremor;
    
    const breathScale = (1 - pressure * 0.5) * effectiveMotion;
    const breathX = Math.sin(time * 0.05 + this.breathPhase) * 2 * breathScale;
    const breathY = Math.cos(time * 0.04 + this.breathPhase) * 2 * breathScale;
    
    const driftScale = (1 - accumulatedStress * 0.6) * effectiveMotion;
    const driftX = Math.sin(time * 0.03 + this.driftPhase) * 4 * driftScale;
    const driftY = Math.cos(time * 0.025 + this.driftPhase) * 4 * driftScale;
    
    const velocityScale = 1 - stability * 0.5;
    const velocityOffsetY = scrollVelocity * (0.15 + this.layer * 0.1) * velocityScale;
    
    const orderPull = stability + (reorganizing ? reorganizeStrength * 0.8 : 0);
    const stressPull = 1 - orderPull;
    
    const stressedX = this.baseX + stressDisplaceX + misalignX;
    const stressedY = this.baseY + stressDisplaceY + misalignY;
    
    const baseX = stressedX * stressPull + this.orderedX * orderPull;
    const baseY = stressedY * stressPull + this.orderedY * orderPull;
    
    this.targetX = baseX + breathX + driftX + tremorX;
    this.targetY = baseY + breathY + driftY + tremorY + velocityOffsetY;
    
    const lerpSpeed = 0.006 + (reorganizing ? 0.012 : 0) + accumulatedStress * 0.004;
    
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.vx = this.vx * 0.85 + dx * lerpSpeed;
    this.vy = this.vy * 0.85 + dy * lerpSpeed;
    
    this.x += this.vx;
    this.y += this.vy;
  }
  
  getOpacity(narrative, time) {
    const { stability, accumulatedStress, contrast } = narrative;
    
    const pulse = Math.sin(time * 0.12 + this.breathPhase) * 0.03;
    const strainFlicker = accumulatedStress * 0.05 * Math.sin(time * 0.8 + this.stressPhase);
    const stabilityBoost = stability * 0.12;
    
    // Apply contrast from narrative
    const baseOpacity = this.baseOpacity * contrast;
    
    return Math.max(0.05, Math.min(0.4, 
      baseOpacity + pulse + stabilityBoost - strainFlicker
    ));
  }
  
  getSize(narrative) {
    const { stability, pressure } = narrative;
    const pressureScale = 1 - pressure * 0.1;
    const stabilityScale = 0.9 + stability * 0.12;
    return this.size * pressureScale * stabilityScale;
  }
}

// Flow particle
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
    this.syncPhase = Math.random() * Math.PI * 2;
    this.desyncSensitivity = 0.5 + Math.random() * 0.5;
  }
  
  update(narrative, time, scrollVelocity, isPaused) {
    const { desync, stability, motionScale, phase, pressure } = narrative;
    
    let speedMod = 1;
    
    if (phase === 'decision' || phase === 'action') {
      speedMod = 0.25;
    } else if (phase === 'proof') {
      speedMod = 0.4;
    } else if (phase === 'pain' || phase === 'pain-peak') {
      const desyncOffset = Math.sin(time * 1.2 + this.syncPhase) * desync * this.desyncSensitivity;
      speedMod = 0.5 + desyncOffset + pressure * 0.2;
      if (pressure > 0.5 && Math.sin(time * 2 + this.syncPhase * 5) > 0.7) {
        speedMod *= 0.3;
      }
    } else if (phase === 'how') {
      speedMod = 0.5 + stability * 0.4;
    } else {
      speedMod = 0.6;
    }
    
    if (isPaused) speedMod *= 0.5;
    
    this.speed = this.baseSpeed * speedMod * motionScale;
    this.progress += this.speed;
    
    if (this.progress > 1) {
      this.progress = 0;
      if (pressure > 0.3 && Math.random() < pressure * 0.4) {
        this.progress = -0.1 * Math.random();
      }
    }
    
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
    const { stability, desync, contrast } = narrative;
    
    if (this.progress < 0) return 0;
    
    const edgeFade = Math.sin(this.progress * Math.PI);
    const desyncFade = 1 - desync * 0.3 * Math.abs(Math.sin(this.syncPhase * 3));
    const stabilityBoost = stability * 0.4;
    
    return this.opacity * edgeFade * desyncFade * (0.5 + stabilityBoost) * contrast;
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
    lastScrollTime: Date.now(),
    // Smooth color interpolation
    currentHue: 25,
    currentSaturation: 22,
    currentLightness: 42,
    currentBgWarmth: 0.15
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
      
      const currentProgress = typeof progress.get === 'function' ? progress.get() : 0;
      const currentVelocity = typeof scrollVelocity.get === 'function' ? scrollVelocity.get() : 0;
      
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
      const narrative = getNarrativeTension(currentProgress);
      
      // Very smooth color interpolation (slow transitions)
      const colorLerpSpeed = 0.015;
      system.currentHue += (narrative.hue - system.currentHue) * colorLerpSpeed;
      system.currentSaturation += (narrative.saturation - system.currentSaturation) * colorLerpSpeed;
      system.currentLightness += (narrative.lightness - system.currentLightness) * colorLerpSpeed;
      system.currentBgWarmth += (narrative.bgWarmth - system.currentBgWarmth) * colorLerpSpeed;
      
      system.time += 0.016;
      
      // Update nodes and particles
      system.nodes.forEach(node => {
        node.update(narrative, system.time, currentVelocity, system.isPaused, pauseDuration);
      });
      
      system.particles.forEach(particle => {
        particle.update(narrative, system.time, currentVelocity, system.isPaused);
      });
      
      // Clear with subtle warm/cool tinted background
      const bgHue = system.currentBgWarmth > 0 ? 20 : 200;
      const bgSat = system.currentBgWarmth * 15;
      const bgLight = 4 + system.currentBgWarmth * 1.5;
      ctx.fillStyle = `hsl(${bgHue}, ${bgSat}%, ${bgLight}%)`;
      ctx.fillRect(0, 0, width, height);
      
      // Subtle radial gradient overlay for depth
      const gradientRadius = Math.max(width, height) * 0.8;
      const gradient = ctx.createRadialGradient(
        width * 0.5, height * 0.5, 0,
        width * 0.5, height * 0.5, gradientRadius
      );
      
      // Warm center during stress, neutral during calm
      const centerHue = system.currentBgWarmth > 0.1 ? 25 : 200;
      const centerSat = system.currentBgWarmth * 12;
      gradient.addColorStop(0, `hsla(${centerHue}, ${centerSat}%, 8%, 0.3)`);
      gradient.addColorStop(0.5, `hsla(${centerHue}, ${centerSat * 0.5}%, 5%, 0.15)`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Current colors for elements
      const hue = system.currentHue;
      const sat = system.currentSaturation;
      const light = system.currentLightness;
      
      // Draw layers
      for (let layer = 0; layer < 3; layer++) {
        const layerNodes = system.nodes.filter(n => n.layer === layer);
        const layerParticles = system.particles.filter(p => p.layer === layer);
        
        const parallaxFactor = [0.22, 0.52, 1.0][layer];
        const parallaxY = currentVelocity * parallaxFactor * 1.0;
        
        ctx.save();
        ctx.translate(0, parallaxY);
        
        // Draw connections with narrative color
        layerNodes.forEach(node => {
          node.connections.forEach(other => {
            if (node.index < other.index) {
              const nodeOpacity = node.getOpacity(narrative, system.time);
              const otherOpacity = other.getOpacity(narrative, system.time);
              const avgOpacity = (nodeOpacity + otherOpacity) * 0.5;
              
              const stabilityBoost = narrative.stability * 0.25;
              const lineOpacity = (avgOpacity + stabilityBoost) * (0.4 + narrative.stability * 0.25);
              
              // Line color shifts with narrative
              const lineSat = sat * 0.8;
              const lineLight = light * 0.95;
              
              const lineGradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
              lineGradient.addColorStop(0, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity * 0.6})`);
              lineGradient.addColorStop(0.5, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity * 0.85})`);
              lineGradient.addColorStop(1, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity * 0.6})`);
              
              ctx.beginPath();
              ctx.strokeStyle = lineGradient;
              ctx.lineWidth = 0.35 + layer * 0.12 + narrative.stability * 0.18;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        });
        
        // Draw flow particles with narrative color
        layerParticles.forEach(particle => {
          const pos = particle.getPosition();
          const opacity = particle.getOpacity(narrative);
          
          if (opacity > 0.01) {
            const particleSat = sat * 1.1;
            const particleLight = light * 1.2;
            
            // Glow
            const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, particle.size * 2.2);
            glowGrad.addColorStop(0, `hsla(${hue}, ${particleSat}%, ${particleLight}%, ${opacity * 0.4})`);
            glowGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.fillStyle = glowGrad;
            ctx.arc(pos.x, pos.y, particle.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Core
            ctx.beginPath();
            ctx.fillStyle = `hsla(${hue}, ${particleSat}%, ${particleLight + 8}%, ${opacity * 0.85})`;
            ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Draw nodes with narrative color
        layerNodes.forEach(node => {
          const opacity = node.getOpacity(narrative, system.time);
          const size = node.getSize(narrative);
          
          const nodeSat = sat;
          const nodeLight = light;
          
          // Glow
          const glowSize = size * (3.2 + layer * 0.8);
          const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
          glowGradient.addColorStop(0, `hsla(${hue}, ${nodeSat}%, ${nodeLight}%, ${opacity * 0.28})`);
          glowGradient.addColorStop(0.5, `hsla(${hue}, ${nodeSat}%, ${nodeLight}%, ${opacity * 0.1})`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.fillStyle = glowGradient;
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Core
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, ${nodeSat}%, ${nodeLight}%, ${opacity * 0.95})`;
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Bright center
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, ${nodeSat * 0.7}%, ${nodeLight + 18}%, ${opacity * 0.55})`;
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
