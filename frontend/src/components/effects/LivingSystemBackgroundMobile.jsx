// Lightweight mobile version - static gradient background
import { useRef, useEffect } from 'react';

export const LivingSystemBackgroundMobile = ({ progress }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Lower DPR for mobile
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    
    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentProgress = typeof progress.get === 'function' ? progress.get() : 0;
      
      // Simple color interpolation based on progress
      let hue = 28;
      let saturation = 18;
      let lightness = 6;
      
      if (currentProgress < 0.45) {
        hue = 20 - currentProgress * 15;
        saturation = 18 + currentProgress * 10;
      } else if (currentProgress < 0.65) {
        const t = (currentProgress - 0.45) / 0.2;
        hue = 5 + t * 185;
        saturation = 28 - t * 15;
      } else {
        hue = 190 + (currentProgress - 0.65) * 20;
        saturation = 13 - (currentProgress - 0.65) * 10;
      }
      
      // Simple gradient background
      const gradient = ctx.createRadialGradient(
        width * 0.5, height * 0.5, 0,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, `hsl(${hue}, ${saturation + 5}%, ${lightness + 3}%)`);
      gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      requestAnimationFrame(draw);
    };
    
    resize();
    draw();
    
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [progress]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
    />
  );
};
