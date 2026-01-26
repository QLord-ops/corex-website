import { useRef, useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';

export const GridBackground = ({ progress }) => {
  const canvasRef = useRef(null);
  
  // Transform grid opacity based on scroll progress
  const gridOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.15, 0.25, 0.3, 0.2]);
  const dotOpacity = useTransform(progress, [0, 0.5, 1], [0.2, 0.35, 0.25]);
  
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
      
      // Draw flowing grid dots
      for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
        for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
          const offsetX = Math.sin((y / gridSize + time * 0.5) * 0.3) * 2;
          const offsetY = Math.cos((x / gridSize + time * 0.5) * 0.3) * 2;
          
          const distance = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) + 
            Math.pow(y - canvas.height / 2, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(canvas.width / 2, 2) + 
            Math.pow(canvas.height / 2, 2)
          );
          const falloff = 1 - (distance / maxDistance) * 0.6;
          
          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, dotSize * falloff, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(180, 30%, 40%, ${0.3 * falloff})`;
          ctx.fill();
        }
      }
      
      // Draw subtle connecting lines
      ctx.strokeStyle = 'hsla(180, 20%, 30%, 0.08)';
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
      
      time += 0.01;
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
