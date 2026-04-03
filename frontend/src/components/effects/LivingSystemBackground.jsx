import { useRef, useEffect, useCallback } from 'react';
import { isMobile } from '@/utils/device';

// Optimized color state function
const getColorState = (progress) => {
  if (progress < 0.08) {
    return { hue: 28, saturation: 35, lightness: 45, bgHue: 20, bgSaturation: 18, bgLightness: 6, nodeOpacity: 1.0, lineOpacity: 1.0, glowIntensity: 0.6 };
  }
  if (progress < 0.38) {
    const painProgress = (progress - 0.08) / 0.30;
    return {
      hue: 28 - painProgress * 18,
      saturation: 35 + painProgress * 15,
      lightness: 45 - painProgress * 8,
      bgHue: 20 - painProgress * 12,
      bgSaturation: 18 + painProgress * 10,
      bgLightness: 6 + painProgress * 2,
      nodeOpacity: 1.0 + painProgress * 0.15,
      lineOpacity: 1.0 + painProgress * 0.1,
      glowIntensity: 0.6 + painProgress * 0.2
    };
  }
  if (progress < 0.45) {
    const transitionProgress = (progress - 0.38) / 0.07;
    return {
      hue: 10 + transitionProgress * 40,
      saturation: 50 - transitionProgress * 15,
      lightness: 37 + transitionProgress * 5,
      bgHue: 8 + transitionProgress * 30,
      bgSaturation: 28 - transitionProgress * 10,
      bgLightness: 8 - transitionProgress * 1,
      nodeOpacity: 1.15 - transitionProgress * 0.1,
      lineOpacity: 1.1,
      glowIntensity: 0.8 - transitionProgress * 0.15
    };
  }
  if (progress < 0.65) {
    const howProgress = (progress - 0.45) / 0.20;
    const easedProgress = howProgress * howProgress * (3 - 2 * howProgress);
    return {
      hue: 50 + easedProgress * 140,
      saturation: 35 - easedProgress * 10,
      lightness: 42 + easedProgress * 6,
      bgHue: 38 + easedProgress * 170,
      bgSaturation: 18 - easedProgress * 8,
      bgLightness: 7 - easedProgress * 1,
      nodeOpacity: 1.05,
      lineOpacity: 1.05 + easedProgress * 0.1,
      glowIntensity: 0.65 - easedProgress * 0.15
    };
  }
  if (progress < 0.82) {
    const proofProgress = (progress - 0.65) / 0.17;
    return {
      hue: 190 + proofProgress * 10,
      saturation: 25 - proofProgress * 8,
      lightness: 48 + proofProgress * 4,
      bgHue: 208 + proofProgress * 5,
      bgSaturation: 10 - proofProgress * 3,
      bgLightness: 6,
      nodeOpacity: 1.05 + proofProgress * 0.05,
      lineOpacity: 1.15,
      glowIntensity: 0.5 - proofProgress * 0.1
    };
  }
  if (progress < 0.96) {
    const decisionProgress = (progress - 0.82) / 0.14;
    return {
      hue: 200 + decisionProgress * 10,
      saturation: 17 - decisionProgress * 10,
      lightness: 52 + decisionProgress * 3,
      bgHue: 213,
      bgSaturation: 7 - decisionProgress * 4,
      bgLightness: 6,
      nodeOpacity: 1.1,
      lineOpacity: 1.2,
      glowIntensity: 0.4 - decisionProgress * 0.15
    };
  }
  return { hue: 210, saturation: 7, lightness: 55, bgHue: 213, bgSaturation: 3, bgLightness: 6, nodeOpacity: 1.1, lineOpacity: 1.2, glowIntensity: 0.25 };
};

const getNarrativeTension = (progress) => {
  const colorState = getColorState(progress);
  if (progress < 0.08) return { phase: 'entry', accumulatedStress: 0.1, chaos: 0.15, misalignment: 0.12, desync: 0.1, stability: 0.3, motionScale: 0.5, pressure: 0.1, ...colorState };
  if (progress < 0.38) {
    const painProgress = (progress - 0.08) / 0.30;
    let accumulatedStress = 0.1, misalignment = 0.12, desync = 0.1, pressure = 0.1;
    if (painProgress > 0.05) {
      const f = Math.min((painProgress - 0.05) / 0.25, 1);
      accumulatedStress += 0.25 * f; misalignment += 0.15 * f; desync += 0.12 * f; pressure += 0.2 * f;
    }
    if (painProgress > 0.35) {
      const f = Math.min((painProgress - 0.35) / 0.25, 1);
      accumulatedStress += 0.35 * f; misalignment += 0.25 * f; desync += 0.2 * f; pressure += 0.3 * f;
    }
    if (painProgress > 0.68) {
      const f = Math.min((painProgress - 0.68) / 0.25, 1);
      accumulatedStress += 0.4 * f; misalignment += 0.3 * f; desync += 0.28 * f; pressure += 0.5 * f;
    }
    return { phase: 'pain', accumulatedStress, chaos: 0.2 + accumulatedStress * 0.8, misalignment, desync, stability: Math.max(0.05, 0.25 - accumulatedStress * 0.25), motionScale: 0.5 + accumulatedStress * 0.3, pressure, ...colorState };
  }
  if (progress < 0.45) {
    const t = (progress - 0.38) / 0.07;
    return { phase: 'pain-peak', accumulatedStress: 1.0 - t * 0.15, chaos: 0.85 - t * 0.1, misalignment: 0.7 - t * 0.1, desync: 0.6 - t * 0.1, stability: 0.08 + t * 0.1, motionScale: 0.75 - t * 0.1, pressure: 0.9 - t * 0.15, overloaded: true, ...colorState };
  }
  if (progress < 0.65) {
    const t = (progress - 0.45) / 0.20;
    const relief = Math.pow(t, 0.6);
    return { phase: 'how', accumulatedStress: 0.85 * (1 - relief * 0.9), chaos: 0.75 * (1 - relief * 0.92), misalignment: 0.6 * (1 - relief * 0.88), desync: 0.5 * (1 - relief * 0.9), stability: 0.15 + relief * 0.55, motionScale: 0.65 - relief * 0.35, pressure: 0.75 * (1 - relief * 0.95), reorganizing: true, reorganizeStrength: relief, ...colorState };
  }
  if (progress < 0.82) {
    const t = (progress - 0.65) / 0.17;
    return { phase: 'proof', accumulatedStress: 0.08 * (1 - t), chaos: 0.04, misalignment: 0.06 * (1 - t * 0.5), desync: 0.04, stability: 0.72 + t * 0.15, motionScale: 0.22 - t * 0.08, pressure: 0, ...colorState };
  }
  if (progress < 0.96) {
    const t = (progress - 0.82) / 0.14;
    return { phase: 'decision', accumulatedStress: 0, chaos: 0.02, misalignment: 0.02, desync: 0.02, stability: 0.88 + t * 0.08, motionScale: 0.1 - t * 0.05, pressure: 0, ...colorState };
  }
  return { phase: 'action', accumulatedStress: 0, chaos: 0.01, misalignment: 0.01, desync: 0.01, stability: 0.96, motionScale: 0.05, pressure: 0, ...colorState };
};

class SystemNode {
  constructor(x, y, layer, index) {
    this.baseX = x; this.baseY = y; this.x = x; this.y = y; this.targetX = x; this.targetY = y;
    this.layer = layer; this.index = index; this.connections = [];
    this.breathPhase = Math.random() * Math.PI * 2;
    this.driftPhase = Math.random() * Math.PI * 2;
    this.stressPhase = Math.random() * Math.PI * 2;
    this.size = 1.6 + layer * 0.5;
    this.baseOpacity = 0.25 + layer * 0.08;
    this.stressVector = { x: (Math.random() - 0.5) * 110, y: (Math.random() - 0.5) * 110 };
    this.misalignAngle = Math.random() * Math.PI * 2;
    this.misalignMagnitude = 18 + Math.random() * 35;
    this.orderedX = x; this.orderedY = y;
    this.vx = 0; this.vy = 0;
  }
  setOrderedPosition(x, y) { this.orderedX = x; this.orderedY = y; }
  update(narrative, time, scrollVelocity, isPaused, pauseDuration) {
    const { accumulatedStress, misalignment, stability, motionScale, pressure, reorganizing, reorganizeStrength = 0 } = narrative;
    const pauseCalm = isPaused ? Math.min(pauseDuration / 4000, 0.3) : 0;
    const effectiveMotion = motionScale * (1 - pauseCalm * 0.5);
    const stressDisplaceX = this.stressVector.x * accumulatedStress * 0.65;
    const stressDisplaceY = this.stressVector.y * accumulatedStress * 0.65;
    const misalignX = Math.cos(this.misalignAngle) * this.misalignMagnitude * misalignment;
    const misalignY = Math.sin(this.misalignAngle) * this.misalignMagnitude * misalignment;
    const pressureTremor = pressure * 1.8 * effectiveMotion;
    const tremorX = Math.sin(time * 1.5 + this.stressPhase * 3) * pressureTremor;
    const tremorY = Math.cos(time * 1.8 + this.stressPhase * 2) * pressureTremor;
    const breathScale = (1 - pressure * 0.5) * effectiveMotion;
    const breathX = Math.sin(time * 0.05 + this.breathPhase) * 1.5 * breathScale;
    const breathY = Math.cos(time * 0.04 + this.breathPhase) * 1.5 * breathScale;
    const driftScale = (1 - accumulatedStress * 0.6) * effectiveMotion;
    const driftX = Math.sin(time * 0.03 + this.driftPhase) * 3 * driftScale;
    const driftY = Math.cos(time * 0.025 + this.driftPhase) * 3 * driftScale;
    const velocityScale = 1 - stability * 0.5;
    const velocityOffsetY = scrollVelocity * (0.12 + this.layer * 0.08) * velocityScale;
    const orderPull = stability + (reorganizing ? reorganizeStrength * 0.8 : 0);
    const stressPull = 1 - orderPull;
    const stressedX = this.baseX + stressDisplaceX + misalignX;
    const stressedY = this.baseY + stressDisplaceY + misalignY;
    const baseX = stressedX * stressPull + this.orderedX * orderPull;
    const baseY = stressedY * stressPull + this.orderedY * orderPull;
    this.targetX = baseX + breathX + driftX + tremorX;
    this.targetY = baseY + breathY + driftY + tremorY + velocityOffsetY;
    const lerpSpeed = 0.008 + (reorganizing ? 0.015 : 0) + accumulatedStress * 0.005;
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.vx = this.vx * 0.85 + dx * lerpSpeed;
    this.vy = this.vy * 0.85 + dy * lerpSpeed;
    this.x += this.vx;
    this.y += this.vy;
  }
  getOpacity(narrative, time) {
    const { stability, accumulatedStress, nodeOpacity } = narrative;
    const pulse = Math.sin(time * 0.1 + this.breathPhase) * 0.04;
    const strainFlicker = accumulatedStress * 0.06 * Math.sin(time * 0.7 + this.stressPhase);
    const stabilityBoost = stability * 0.15;
    const base = (this.baseOpacity + pulse + stabilityBoost - strainFlicker) * nodeOpacity;
    return Math.max(0.15, Math.min(0.7, base));
  }
  getSize(narrative) {
    const { stability, pressure } = narrative;
    return this.size * (1 - pressure * 0.08) * (0.92 + stability * 0.1);
  }
}

class FlowParticle {
  constructor(startNode, endNode, layer) {
    this.startNode = startNode; this.endNode = endNode; this.layer = layer;
    this.progress = Math.random();
    this.baseSpeed = 0.0012 + Math.random() * 0.0014;
    this.speed = this.baseSpeed;
    this.opacity = 0.12 + layer * 0.04;
    this.size = 0.9 + layer * 0.3;
    this.syncPhase = Math.random() * Math.PI * 2;
    this.desyncSensitivity = 0.5 + Math.random() * 0.5;
  }
  update(narrative, time, scrollVelocity, isPaused) {
    const { desync, stability, motionScale, phase, pressure } = narrative;
    let speedMod = 1;
    if (phase === 'decision' || phase === 'action') speedMod = 0.3;
    else if (phase === 'proof') speedMod = 0.45;
    else if (phase === 'pain' || phase === 'pain-peak') {
      const desyncOffset = Math.sin(time * 1.2 + this.syncPhase) * desync * this.desyncSensitivity;
      speedMod = 0.55 + desyncOffset + pressure * 0.2;
      if (pressure > 0.5 && Math.sin(time * 2 + this.syncPhase * 5) > 0.7) speedMod *= 0.35;
    } else if (phase === 'how') speedMod = 0.5 + stability * 0.4;
    else speedMod = 0.6;
    if (isPaused) speedMod *= 0.5;
    this.speed = this.baseSpeed * speedMod * motionScale;
    this.progress += this.speed;
    if (this.progress > 1) {
      this.progress = 0;
      if (pressure > 0.3 && Math.random() < pressure * 0.35) this.progress = -0.08 * Math.random();
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
    const { stability, desync, nodeOpacity } = narrative;
    if (this.progress < 0) return 0;
    const edgeFade = Math.sin(this.progress * Math.PI);
    const desyncFade = 1 - desync * 0.25 * Math.abs(Math.sin(this.syncPhase * 3));
    const stabilityBoost = stability * 0.35;
    return this.opacity * edgeFade * desyncFade * (0.6 + stabilityBoost) * nodeOpacity;
  }
}

export const LivingSystemBackground = ({ progress, scrollVelocity }) => {
  const canvasRef = useRef(null);
  const systemRef = useRef({
    nodes: [], particles: [], initialized: false, time: 0, isPaused: false,
    pauseStartTime: 0, lastScrollTime: Date.now(),
    currentHue: 28, currentSaturation: 35, currentLightness: 45,
    currentBgHue: 20, currentBgSaturation: 18, currentBgLightness: 6
  });
  
  const initSystem = useCallback((width, height) => {
    const system = systemRef.current;
    system.nodes = [];
    system.particles = [];
    
    // Reduced nodes/particles for better performance
    const mobile = isMobile();
    const layers = mobile ? [
      { count: 25, connectionThreshold: 250 },
      { count: 18, connectionThreshold: 220 },
      { count: 12, connectionThreshold: 200 }
    ] : [
      { count: 45, connectionThreshold: 230 },
      { count: 32, connectionThreshold: 200 },
      { count: 20, connectionThreshold: 175 }
    ];
    
    let nodeIndex = 0;
    const padding = 50;
    
    layers.forEach((layerConfig, layerIndex) => {
      const layerNodes = [];
      for (let i = 0; i < layerConfig.count; i++) {
        const angle = (i / layerConfig.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const radius = 0.15 + Math.random() * 0.4;
        let x, y;
        if (Math.random() > 0.25) {
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
        node.setOrderedPosition(padding + cellWidth * (col + 0.5), padding + cellHeight * (row + 0.5));
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
            const prob = 1 - (distance / layerConfig.connectionThreshold) * 0.35;
            if (Math.random() < prob) {
              node.connections.push(other);
              if (Math.random() > 0.4) system.particles.push(new FlowParticle(node, other, layerIndex));
              if (Math.random() > 0.55) system.particles.push(new FlowParticle(other, node, layerIndex));
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
    const mobile = isMobile();
    const targetFPS = mobile ? 30 : 60;
    let lastTime = 0;
    
    const resize = () => {
      const dpr = mobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      initSystem(window.innerWidth, window.innerHeight);
    };
    
    const draw = (currentTime) => {
      if (currentTime - lastTime < 1000 / targetFPS) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = currentTime;
      
      const system = systemRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (!system.initialized) initSystem(width, height);
      
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
      
      const colorLerpSpeed = 0.02;
      system.currentHue += (narrative.hue - system.currentHue) * colorLerpSpeed;
      system.currentSaturation += (narrative.saturation - system.currentSaturation) * colorLerpSpeed;
      system.currentLightness += (narrative.lightness - system.currentLightness) * colorLerpSpeed;
      system.currentBgHue += (narrative.bgHue - system.currentBgHue) * colorLerpSpeed;
      system.currentBgSaturation += (narrative.bgSaturation - system.currentBgSaturation) * colorLerpSpeed;
      system.currentBgLightness += (narrative.bgLightness - system.currentBgLightness) * colorLerpSpeed;
      
      system.time += 0.016;
      
      system.nodes.forEach(node => node.update(narrative, system.time, currentVelocity, system.isPaused, pauseDuration));
      system.particles.forEach(particle => particle.update(narrative, system.time, currentVelocity, system.isPaused));
      
      ctx.fillStyle = `hsl(${system.currentBgHue}, ${system.currentBgSaturation}%, ${system.currentBgLightness}%)`;
      ctx.fillRect(0, 0, width, height);
      
      const gradient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.7);
      gradient.addColorStop(0, `hsla(${system.currentBgHue}, ${system.currentBgSaturation + 5}%, ${system.currentBgLightness + 3}%, 0.4)`);
      gradient.addColorStop(0.6, `hsla(${system.currentBgHue}, ${system.currentBgSaturation}%, ${system.currentBgLightness}%, 0.15)`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      const hue = system.currentHue;
      const sat = system.currentSaturation;
      const light = system.currentLightness;
      const glowIntensity = narrative.glowIntensity;
      
      for (let layer = 0; layer < 3; layer++) {
        const layerNodes = system.nodes.filter(n => n.layer === layer);
        const layerParticles = system.particles.filter(p => p.layer === layer);
        const parallaxFactor = [0.2, 0.5, 1.0][layer];
        const parallaxY = currentVelocity * parallaxFactor * 0.8;
        ctx.save();
        ctx.translate(0, parallaxY);
        
        layerNodes.forEach(node => {
          node.connections.forEach(other => {
            if (node.index < other.index) {
              const nodeOpacity = node.getOpacity(narrative, system.time);
              const otherOpacity = other.getOpacity(narrative, system.time);
              const avgOpacity = (nodeOpacity + otherOpacity) * 0.5;
              const stabilityBoost = narrative.stability * 0.2;
              const lineOpacity = (avgOpacity + stabilityBoost) * narrative.lineOpacity * 0.8;
              const lineSat = sat * 0.85;
              const lineLight = light * 0.9;
              const lineGradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
              lineGradient.addColorStop(0, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity * 0.5})`);
              lineGradient.addColorStop(0.5, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity})`);
              lineGradient.addColorStop(1, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity * 0.5})`);
              ctx.beginPath();
              ctx.strokeStyle = lineGradient;
              ctx.lineWidth = 0.6 + layer * 0.2 + narrative.stability * 0.25;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        });
        
        layerParticles.forEach(particle => {
          const pos = particle.getPosition();
          const opacity = particle.getOpacity(narrative);
          if (opacity > 0.02) {
            const particleSat = sat * 1.15;
            const particleLight = light * 1.25;
            const glowSize = particle.size * (1.8 + glowIntensity);
            const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowSize);
            glowGrad.addColorStop(0, `hsla(${hue}, ${particleSat}%, ${particleLight}%, ${opacity * 0.5})`);
            glowGrad.addColorStop(0.6, `hsla(${hue}, ${particleSat}%, ${particleLight}%, ${opacity * 0.2})`);
            glowGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.fillStyle = glowGrad;
            ctx.arc(pos.x, pos.y, glowSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = `hsla(${hue}, ${particleSat}%, ${particleLight + 10}%, ${opacity})`;
            ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        layerNodes.forEach(node => {
          const opacity = node.getOpacity(narrative, system.time);
          const size = node.getSize(narrative);
          const nodeSat = sat;
          const nodeLight = light;
          const glowSize = size * (2.2 + glowIntensity * 1.5);
          const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
          glowGradient.addColorStop(0, `hsla(${hue}, ${nodeSat}%, ${nodeLight}%, ${opacity * 0.4})`);
          glowGradient.addColorStop(0.5, `hsla(${hue}, ${nodeSat}%, ${nodeLight}%, ${opacity * 0.15})`);
          glowGradient.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.fillStyle = glowGradient;
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, ${nodeSat}%, ${nodeLight}%, ${opacity})`;
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, ${nodeSat * 0.6}%, ${nodeLight + 22}%, ${opacity * 0.7})`;
          ctx.arc(node.x, node.y, size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.restore();
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    resize();
    draw(0);
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [initSystem, progress, scrollVelocity]);
  
  return <canvas ref={canvasRef} className="absolute inset-0" />;
};
