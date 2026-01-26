import { useRef, useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';

export const GridBackground = ({ progress }) => {
  const canvasRef = useRef(null);
  
  // Transform grid opacity based on scroll progress
  const gridOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.15, 0.25, 0.3, 0.2]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gridSize = 60;
      const dotSize = 1.5;
      
      // Very slow breathing cycle - 45 seconds full cycle
      const breathCycle = time * 0.14;
      const breathValue = Math.sin(breathCycle) * 0.5 + 0.5; // 0 to 1
      
      // Subtle global breathing - affects overall intensity
      const globalBreath = 0.85 + breathValue * 0.15; // 0.85 to 1.0
      
      // Draw flowing grid dots with breathing
      for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
        for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
          // Very subtle position drift - almost imperceptible
          const driftPhase = (x + y) * 0.001;
          const offsetX = Math.sin((y / gridSize + time * 0.08) * 0.2 + driftPhase) * 1.5;
          const offsetY = Math.cos((x / gridSize + time * 0.08) * 0.2 + driftPhase) * 1.5;
          
          // Distance-based falloff from center
          const distance = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) + 
            Math.pow(y - canvas.height / 2, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(canvas.width / 2, 2) + 
            Math.pow(canvas.height / 2, 2)
          );
          const falloff = 1 - (distance / maxDistance) * 0.6;
          
          // Individual dot breathing - offset by position for organic feel
          const dotBreathPhase = breathCycle + (x * 0.002) + (y * 0.003);
          const dotBreath = Math.sin(dotBreathPhase) * 0.12 + 0.88; // 0.76 to 1.0
          
          const finalOpacity = 0.25 * falloff * globalBreath * dotBreath;
          const finalSize = dotSize * falloff * (0.95 + dotBreath * 0.05);
          
          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, finalSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(180, 30%, 40%, ${finalOpacity})`;
          ctx.fill();
        }
      }
      
      // Draw subtle connecting lines with breathing
      const lineBreath = 0.7 + breathValue * 0.3;
      ctx.strokeStyle = `hsla(180, 20%, 30%, ${0.06 * lineBreath})`;
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Increment time slowly
      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };
    
    resize();
    draw();
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ opacity: gridOpacity }}
    />
  );
};
