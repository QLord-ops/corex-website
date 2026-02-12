import { useRef, useEffect, useCallback } from 'react';

// Detect mobile devices
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Simplified color state for mobile
const getColorState = (progress) => {
  if (progress < 0.08) {
    return { hue: 28, saturation: 35, lightness: 45, bgHue: 20, bgSaturation: 18, bgLightness: 6 };
  }
  if (progress < 0.38) {
    const painProgress = (progress - 0.08) / 0.30;
    return {
      hue: 28 - painProgress * 18,
      saturation: 35 + painProgress * 15,
      lightness: 45 - painProgress * 8,
      bgHue: 20 - painProgress * 12,
      bgSaturation: 18 + painProgress * 10,
      bgLightness: 6 + painProgress * 2
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
      bgLightness: 8 - transitionProgress * 1
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
      bgLightness: 7 - easedProgress * 1
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
      bgLightness: 6
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
      bgLightness: 6
    };
  }
  return {
    hue: 210,
    saturation: 7,
    lightness: 55,
    bgHue: 213,
    bgSaturation: 3,
    bgLightness: 6
  };
};

// Simplified system node for mobile
class SystemNode {
  constructor(x, y, layer, index) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.index = index;
    this.connections = [];
    this.size = 1.2 + layer * 0.3;
    this.baseOpacity = 0.2 + layer * 0.05;
  }
  
  update(narrative, time) {
    const { stability, motionScale } = narrative;
    const breathX = Math.sin(time * 0.05) * 1 * motionScale;
    const breathY = Math.cos(time * 0.04) * 1 * motionScale;
    this.x = this.baseX + breathX;
    this.y = this.baseY + breathY;
  }
  
  getOpacity(narrative) {
    return Math.max(0.1, Math.min(0.5, this.baseOpacity));
  }
  
  getSize(narrative) {
    return this.size;
  }
}

export const LivingSystemBackground = ({ progress, scrollVelocity }) => {
  const canvasRef = useRef(null);
  const systemRef = useRef({
    nodes: [],
    initialized: false,
    time: 0,
    currentHue: 28,
    currentSaturation: 35,
    currentLightness: 45,
    currentBgHue: 20,
    currentBgSaturation: 18,
    currentBgLightness: 6
  });
  
  const mobile = isMobile();
  
  const initSystem = useCallback((width, height) => {
    const system = systemRef.current;
    system.nodes = [];
    
    // Reduced nodes for mobile
    const layers = mobile 
      ? [
          { count: 15, connectionThreshold: 250 },
          { count: 10, connectionThreshold: 220 }
        ]
      : [
          { count: 30, connectionThreshold: 230 },
          { count: 20, connectionThreshold: 200 },
          { count: 12, connectionThreshold: 175 }
        ];
    
    let nodeIndex = 0;
    const padding = 50;
    
    layers.forEach((layerConfig, layerIndex) => {
      for (let i = 0; i < layerConfig.count; i++) {
        const angle = (i / layerConfig.count) * Math.PI * 2;
        const radius = 0.2 + Math.random() * 0.3;
        
        const x = width * 0.5 + Math.cos(angle) * width * radius;
        const y = height * 0.5 + Math.sin(angle) * height * radius;
        
        const node = new SystemNode(
          Math.max(padding, Math.min(width - padding, x)),
          Math.max(padding, Math.min(height - padding, y)),
          layerIndex,
          nodeIndex++
        );
        
        system.nodes.push(node);
      }
      
      // Simplified connections
      const layerNodes = system.nodes.filter(n => n.layer === layerIndex);
      layerNodes.forEach((node, i) => {
        layerNodes.forEach((other, j) => {
          if (i >= j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < layerConfig.connectionThreshold && Math.random() < 0.3) {
            node.connections.push(other);
          }
        });
      });
    });
    
    system.initialized = true;
  }, [mobile]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let lastFrameTime = 0;
    const targetFPS = mobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;
    
    const resize = () => {
      const dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      initSystem(window.innerWidth, window.innerHeight);
    };
    
    const draw = (currentTime) => {
      if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = currentTime;
      
      const system = systemRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (!system.initialized) {
        initSystem(width, height);
      }
      
      const currentProgress = typeof progress.get === 'function' ? progress.get() : 0;
      const colorState = getColorState(currentProgress);
      
      // Smooth color interpolation
      const colorLerpSpeed = mobile ? 0.03 : 0.02;
      system.currentHue += (colorState.hue - system.currentHue) * colorLerpSpeed;
      system.currentSaturation += (colorState.saturation - system.currentSaturation) * colorLerpSpeed;
      system.currentLightness += (colorState.lightness - system.currentLightness) * colorLerpSpeed;
      system.currentBgHue += (colorState.bgHue - system.currentBgHue) * colorLerpSpeed;
      system.currentBgSaturation += (colorState.bgSaturation - system.currentBgSaturation) * colorLerpSpeed;
      system.currentBgLightness += (colorState.bgLightness - system.currentBgLightness) * colorLerpSpeed;
      
      system.time += 0.016;
      
      const narrative = {
        stability: currentProgress > 0.65 ? 0.8 : 0.3,
        motionScale: mobile ? 0.3 : 0.5
      };
      
      // Update nodes (simplified for mobile)
      system.nodes.forEach(node => {
        node.update(narrative, system.time);
      });
      
      // Draw background
      ctx.fillStyle = `hsl(${system.currentBgHue}, ${system.currentBgSaturation}%, ${system.currentBgLightness}%)`;
      ctx.fillRect(0, 0, width, height);
      
      // Draw connections (simplified)
      const hue = system.currentHue;
      const sat = system.currentSaturation;
      const light = system.currentLightness;
      
      system.nodes.forEach(node => {
        node.connections.forEach(other => {
          if (node.index < other.index) {
            const opacity = (node.getOpacity(narrative) + other.getOpacity(narrative)) * 0.5 * 0.6;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${hue}, ${sat * 0.85}%, ${light * 0.9}%, ${opacity})`;
            ctx.lineWidth = mobile ? 0.5 : 0.6;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });
      
      // Draw nodes (simplified)
      system.nodes.forEach(node => {
        const opacity = node.getOpacity(narrative);
        const size = node.getSize(narrative);
        
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${opacity})`;
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(draw);
    };
    
    resize();
    animationId = requestAnimationFrame(draw);
    
    window.addEventListener('resize', resize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [initSystem, progress, scrollVelocity, mobile]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ willChange: 'auto' }}
    />
  );
};
