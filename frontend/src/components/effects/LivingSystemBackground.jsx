import { useRef, useEffect, useCallback } from 'react';
import { isMobile } from '@/utils/device';

const getColorState = (progress) => {
  if (progress < 0.08) {
    return { hue: 28, saturation: 35, lightness: 45, bgHue: 20, bgSaturation: 18, bgLightness: 6, nodeOpacity: 1.0, lineOpacity: 1.0, glowIntensity: 0.6 };
  }
  if (progress < 0.38) {
    const p = (progress - 0.08) / 0.30;
    return { hue: 28 - p * 18, saturation: 35 + p * 15, lightness: 45 - p * 8, bgHue: 20 - p * 12, bgSaturation: 18 + p * 10, bgLightness: 6 + p * 2, nodeOpacity: 1.0 + p * 0.15, lineOpacity: 1.0 + p * 0.1, glowIntensity: 0.6 + p * 0.2 };
  }
  if (progress < 0.45) {
    const p = (progress - 0.38) / 0.07;
    return { hue: 10 + p * 40, saturation: 50 - p * 15, lightness: 37 + p * 5, bgHue: 8 + p * 30, bgSaturation: 28 - p * 10, bgLightness: 8 - p, nodeOpacity: 1.15 - p * 0.1, lineOpacity: 1.1, glowIntensity: 0.8 - p * 0.15 };
  }
  if (progress < 0.65) {
    const p = (progress - 0.45) / 0.20;
    const e = p * p * (3 - 2 * p);
    return { hue: 50 + e * 140, saturation: 35 - e * 10, lightness: 42 + e * 6, bgHue: 38 + e * 170, bgSaturation: 18 - e * 8, bgLightness: 7 - e, nodeOpacity: 1.05, lineOpacity: 1.05 + e * 0.1, glowIntensity: 0.65 - e * 0.15 };
  }
  if (progress < 0.82) {
    const p = (progress - 0.65) / 0.17;
    return { hue: 190 + p * 10, saturation: 25 - p * 8, lightness: 48 + p * 4, bgHue: 208 + p * 5, bgSaturation: 10 - p * 3, bgLightness: 6, nodeOpacity: 1.05 + p * 0.05, lineOpacity: 1.15, glowIntensity: 0.5 - p * 0.1 };
  }
  if (progress < 0.96) {
    const p = (progress - 0.82) / 0.14;
    return { hue: 200 + p * 10, saturation: 17 - p * 10, lightness: 52 + p * 3, bgHue: 213, bgSaturation: 7 - p * 4, bgLightness: 6, nodeOpacity: 1.1, lineOpacity: 1.2, glowIntensity: 0.4 - p * 0.15 };
  }
  return { hue: 210, saturation: 7, lightness: 55, bgHue: 213, bgSaturation: 3, bgLightness: 6, nodeOpacity: 1.1, lineOpacity: 1.2, glowIntensity: 0.25 };
};

const getNarrativeTension = (progress) => {
  const c = getColorState(progress);
  if (progress < 0.08) return { phase: 'entry', accumulatedStress: 0.1, chaos: 0.15, misalignment: 0.12, desync: 0.1, stability: 0.3, motionScale: 0.5, pressure: 0.1, ...c };
  if (progress < 0.38) {
    const p = (progress - 0.08) / 0.30;
    let s = 0.1, m = 0.12, d = 0.1, pr = 0.1;
    if (p > 0.05) { const f = Math.min((p - 0.05) / 0.25, 1); s += 0.25 * f; m += 0.15 * f; d += 0.12 * f; pr += 0.2 * f; }
    if (p > 0.35) { const f = Math.min((p - 0.35) / 0.25, 1); s += 0.35 * f; m += 0.25 * f; d += 0.2 * f; pr += 0.3 * f; }
    if (p > 0.68) { const f = Math.min((p - 0.68) / 0.25, 1); s += 0.4 * f; m += 0.3 * f; d += 0.28 * f; pr += 0.5 * f; }
    return { phase: 'pain', accumulatedStress: s, chaos: 0.2 + s * 0.8, misalignment: m, desync: d, stability: Math.max(0.05, 0.25 - s * 0.25), motionScale: 0.5 + s * 0.3, pressure: pr, ...c };
  }
  if (progress < 0.45) {
    const t = (progress - 0.38) / 0.07;
    return { phase: 'pain-peak', accumulatedStress: 1.0 - t * 0.15, chaos: 0.85 - t * 0.1, misalignment: 0.7 - t * 0.1, desync: 0.6 - t * 0.1, stability: 0.08 + t * 0.1, motionScale: 0.75 - t * 0.1, pressure: 0.9 - t * 0.15, overloaded: true, ...c };
  }
  if (progress < 0.65) {
    const t = (progress - 0.45) / 0.20;
    const r = Math.pow(t, 0.6);
    return { phase: 'how', accumulatedStress: 0.85 * (1 - r * 0.9), chaos: 0.75 * (1 - r * 0.92), misalignment: 0.6 * (1 - r * 0.88), desync: 0.5 * (1 - r * 0.9), stability: 0.15 + r * 0.55, motionScale: 0.65 - r * 0.35, pressure: 0.75 * (1 - r * 0.95), reorganizing: true, reorganizeStrength: r, ...c };
  }
  if (progress < 0.82) {
    const t = (progress - 0.65) / 0.17;
    return { phase: 'proof', accumulatedStress: 0.08 * (1 - t), chaos: 0.04, misalignment: 0.06 * (1 - t * 0.5), desync: 0.04, stability: 0.72 + t * 0.15, motionScale: 0.22 - t * 0.08, pressure: 0, ...c };
  }
  if (progress < 0.96) {
    const t = (progress - 0.82) / 0.14;
    return { phase: 'decision', accumulatedStress: 0, chaos: 0.02, misalignment: 0.02, desync: 0.02, stability: 0.88 + t * 0.08, motionScale: 0.1 - t * 0.05, pressure: 0, ...c };
  }
  return { phase: 'action', accumulatedStress: 0, chaos: 0.01, misalignment: 0.01, desync: 0.01, stability: 0.96, motionScale: 0.05, pressure: 0, ...c };
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
    this._cachedOpacity = 0;
    this._cachedSize = 0;
  }
  setOrderedPosition(x, y) { this.orderedX = x; this.orderedY = y; }

  update(narrative, time, dt, isMob) {
    const { accumulatedStress, misalignment, stability, motionScale, pressure, reorganizing, reorganizeStrength = 0 } = narrative;
    const effectiveMotion = motionScale;
    const stressDisplaceX = this.stressVector.x * accumulatedStress * 0.65;
    const stressDisplaceY = this.stressVector.y * accumulatedStress * 0.65;
    const misalignX = Math.cos(this.misalignAngle) * this.misalignMagnitude * misalignment;
    const misalignY = Math.sin(this.misalignAngle) * this.misalignMagnitude * misalignment;
    const pressureTremor = pressure * (isMob ? 0.6 : 1.8) * effectiveMotion;
    const tremorX = Math.sin(time * 1.5 + this.stressPhase * 3) * pressureTremor;
    const tremorY = Math.cos(time * 1.8 + this.stressPhase * 2) * pressureTremor;
    const breathScale = (1 - pressure * 0.5) * effectiveMotion;
    const breathX = Math.sin(time * 0.05 + this.breathPhase) * 1.5 * breathScale;
    const breathY = Math.cos(time * 0.04 + this.breathPhase) * 1.5 * breathScale;
    const driftScale = (1 - accumulatedStress * 0.6) * effectiveMotion;
    const driftX = Math.sin(time * 0.03 + this.driftPhase) * 3 * driftScale;
    const driftY = Math.cos(time * 0.025 + this.driftPhase) * 3 * driftScale;
    const orderPull = stability + (reorganizing ? reorganizeStrength * 0.8 : 0);
    const stressPull = 1 - orderPull;
    const stressedX = this.baseX + stressDisplaceX + misalignX;
    const stressedY = this.baseY + stressDisplaceY + misalignY;
    const bX = stressedX * stressPull + this.orderedX * orderPull;
    const bY = stressedY * stressPull + this.orderedY * orderPull;
    this.targetX = bX + breathX + driftX + tremorX;
    this.targetY = bY + breathY + driftY + tremorY;

    const lerpSpeed = isMob
      ? (0.02 + (reorganizing ? 0.01 : 0)) * dt
      : (0.008 + (reorganizing ? 0.015 : 0) + accumulatedStress * 0.005) * dt;
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const damping = isMob ? 0.92 : 0.85;
    this.vx = this.vx * damping + dx * lerpSpeed;
    this.vy = this.vy * damping + dy * lerpSpeed;
    this.x += this.vx;
    this.y += this.vy;

    const { nodeOpacity: nOp } = narrative;
    const pulse = Math.sin(time * 0.1 + this.breathPhase) * 0.04;
    const strainFlicker = accumulatedStress * 0.06 * Math.sin(time * 0.7 + this.stressPhase);
    const stabilityBoost = stability * 0.15;
    const base = (this.baseOpacity + pulse + stabilityBoost - strainFlicker) * nOp;
    this._cachedOpacity = Math.max(0.15, Math.min(0.7, base));
    this._cachedSize = this.size * (1 - pressure * 0.08) * (0.92 + stability * 0.1);
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
    this._x = 0; this._y = 0; this._cachedOpacity = 0;
  }
  update(narrative, time, dt) {
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
    this.speed = this.baseSpeed * speedMod * motionScale;
    this.progress += this.speed * dt;
    if (this.progress > 1) {
      this.progress = 0;
      if (pressure > 0.3 && Math.random() < pressure * 0.35) this.progress = -0.08 * Math.random();
    }
    this.progress = Math.max(0, this.progress);

    const t = Math.max(0, Math.min(1, this.progress));
    const easedT = t * t * (3 - 2 * t);
    this._x = this.startNode.x + (this.endNode.x - this.startNode.x) * easedT;
    this._y = this.startNode.y + (this.endNode.y - this.startNode.y) * easedT;

    if (this.progress < 0) { this._cachedOpacity = 0; return; }
    const edgeFade = Math.sin(this.progress * Math.PI);
    const desyncFade = 1 - desync * 0.25 * Math.abs(Math.sin(this.syncPhase * 3));
    const stabilityBoost = stability * 0.35;
    this._cachedOpacity = this.opacity * edgeFade * desyncFade * (0.6 + stabilityBoost) * narrative.nodeOpacity;
  }
}

export const LivingSystemBackground = ({ progress, scrollVelocity }) => {
  const canvasRef = useRef(null);
  const systemRef = useRef({
    nodes: [], particles: [], layerNodes: [[], [], []], layerParticles: [[], [], []],
    initialized: false, time: 0,
    lastScrollTime: Date.now(),
    currentHue: 28, currentSaturation: 35, currentLightness: 45,
    currentBgHue: 20, currentBgSaturation: 18, currentBgLightness: 6,
    width: 0, height: 0
  });

  const initSystem = useCallback((width, height) => {
    const system = systemRef.current;
    system.nodes = [];
    system.particles = [];
    system.layerNodes = [[], [], []];
    system.layerParticles = [[], [], []];
    system.width = width;
    system.height = height;

    const mobile = isMobile();
    const layers = mobile ? [
      { count: 16, connectionThreshold: 280 },
      { count: 11, connectionThreshold: 250 },
      { count: 7, connectionThreshold: 230 }
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
        system.layerNodes[layerIndex].push(node);
      }
      const particleChance = mobile ? 0.3 : 0.6;
      const reverseChance = mobile ? 0.2 : 0.45;
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
              if (Math.random() < particleChance) {
                const p = new FlowParticle(node, other, layerIndex);
                system.particles.push(p);
                system.layerParticles[layerIndex].push(p);
              }
              if (Math.random() < reverseChance) {
                const p = new FlowParticle(other, node, layerIndex);
                system.particles.push(p);
                system.layerParticles[layerIndex].push(p);
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
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationId;
    const mobile = isMobile();
    const dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const parallaxScale = mobile ? 0.12 : 1.0;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initSystem(w, h);
    };

    const paint = (system, narrative, velocity) => {
      const { width, height } = system;
      const hue = system.currentHue;
      const sat = system.currentSaturation;
      const light = system.currentLightness;
      const glowIntensity = narrative.glowIntensity;

      ctx.fillStyle = `hsl(${system.currentBgHue}, ${system.currentBgSaturation}%, ${system.currentBgLightness}%)`;
      ctx.fillRect(0, 0, width, height);

      const grad = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.7);
      grad.addColorStop(0, `hsla(${system.currentBgHue}, ${system.currentBgSaturation + 5}%, ${system.currentBgLightness + 3}%, 0.4)`);
      grad.addColorStop(0.6, `hsla(${system.currentBgHue}, ${system.currentBgSaturation}%, ${system.currentBgLightness}%, 0.15)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const parallaxFactors = [0.2, 0.5, 1.0];

      for (let layer = 0; layer < 3; layer++) {
        const nodes = system.layerNodes[layer];
        const particles = system.layerParticles[layer];
        const parallaxY = velocity * parallaxFactors[layer] * 0.8 * parallaxScale;
        ctx.save();
        if (Math.abs(parallaxY) > 0.1) ctx.translate(0, parallaxY);

        const lineSat = sat * 0.85;
        const lineLight = light * 0.9;
        for (let ci = 0, cl = nodes.length; ci < cl; ci++) {
          const node = nodes[ci];
          const conns = node.connections;
          for (let cj = 0, cjl = conns.length; cj < cjl; cj++) {
            const other = conns[cj];
            if (node.index < other.index) {
              const avgOpacity = (node._cachedOpacity + other._cachedOpacity) * 0.5;
              const lineOpacity = (avgOpacity + narrative.stability * 0.2) * narrative.lineOpacity * 0.8;
              if (mobile) {
                ctx.beginPath();
                ctx.strokeStyle = `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity * 0.75})`;
                ctx.lineWidth = 0.5 + layer * 0.15 + narrative.stability * 0.2;
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              } else {
                const lg = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
                lg.addColorStop(0, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity * 0.5})`);
                lg.addColorStop(0.5, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity})`);
                lg.addColorStop(1, `hsla(${hue}, ${lineSat}%, ${lineLight}%, ${lineOpacity * 0.5})`);
                ctx.beginPath();
                ctx.strokeStyle = lg;
                ctx.lineWidth = 0.6 + layer * 0.2 + narrative.stability * 0.25;
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            }
          }
        }

        const particleSat = sat * 1.15;
        const particleLight = light * 1.25;
        for (let pi = 0, pl = particles.length; pi < pl; pi++) {
          const particle = particles[pi];
          const opacity = particle._cachedOpacity;
          if (opacity > 0.03) {
            if (!mobile) {
              const gs = particle.size * (1.8 + glowIntensity);
              const gg = ctx.createRadialGradient(particle._x, particle._y, 0, particle._x, particle._y, gs);
              gg.addColorStop(0, `hsla(${hue}, ${particleSat}%, ${particleLight}%, ${opacity * 0.5})`);
              gg.addColorStop(0.6, `hsla(${hue}, ${particleSat}%, ${particleLight}%, ${opacity * 0.2})`);
              gg.addColorStop(1, 'transparent');
              ctx.beginPath();
              ctx.fillStyle = gg;
              ctx.arc(particle._x, particle._y, gs, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.beginPath();
            ctx.fillStyle = `hsla(${hue}, ${particleSat}%, ${particleLight + 10}%, ${opacity})`;
            ctx.arc(particle._x, particle._y, particle.size * (mobile ? 1.2 : 1), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        for (let ni = 0, nl = nodes.length; ni < nl; ni++) {
          const node = nodes[ni];
          const opacity = node._cachedOpacity;
          const size = node._cachedSize;
          const glowSize = size * (mobile ? 3.0 : (2.2 + glowIntensity * 1.5));
          const ng = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
          ng.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${opacity * (mobile ? 0.35 : 0.4)})`);
          ng.addColorStop(0.5, `hsla(${hue}, ${sat}%, ${light}%, ${opacity * 0.12})`);
          ng.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.fillStyle = ng;
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${opacity})`;
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fill();
          if (!mobile) {
            ctx.beginPath();
            ctx.fillStyle = `hsla(${hue}, ${sat * 0.6}%, ${light + 22}%, ${opacity * 0.7})`;
            ctx.arc(node.x, node.y, size * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }
    };

    let lastFrameTime = 0;

    const draw = (timestamp) => {
      const system = systemRef.current;
      if (!system.initialized) {
        lastFrameTime = timestamp;
        animationId = requestAnimationFrame(draw);
        return;
      }

      const rawDt = lastFrameTime ? (timestamp - lastFrameTime) / 16.667 : 1;
      const dt = Math.min(rawDt, 2.5);
      lastFrameTime = timestamp;

      const currentProgress = typeof progress.get === 'function' ? progress.get() : 0;
      const currentVelocity = typeof scrollVelocity.get === 'function' ? scrollVelocity.get() : 0;

      const narrative = getNarrativeTension(currentProgress);

      const colorLerpSpeed = mobile ? 0.04 * dt : 0.02 * dt;
      system.currentHue += (narrative.hue - system.currentHue) * colorLerpSpeed;
      system.currentSaturation += (narrative.saturation - system.currentSaturation) * colorLerpSpeed;
      system.currentLightness += (narrative.lightness - system.currentLightness) * colorLerpSpeed;
      system.currentBgHue += (narrative.bgHue - system.currentBgHue) * colorLerpSpeed;
      system.currentBgSaturation += (narrative.bgSaturation - system.currentBgSaturation) * colorLerpSpeed;
      system.currentBgLightness += (narrative.bgLightness - system.currentBgLightness) * colorLerpSpeed;

      system.time += 0.016 * dt;

      const nodes = system.nodes;
      for (let i = 0, l = nodes.length; i < l; i++) {
        nodes[i].update(narrative, system.time, dt, mobile);
      }
      const particles = system.particles;
      for (let i = 0, l = particles.length; i < l; i++) {
        particles[i].update(narrative, system.time, dt);
      }

      paint(system, narrative, currentVelocity);

      animationId = requestAnimationFrame(draw);
    };

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [initSystem, progress, scrollVelocity]);

  return <canvas ref={canvasRef} className="absolute inset-0" style={{ willChange: 'transform' }} />;
};
