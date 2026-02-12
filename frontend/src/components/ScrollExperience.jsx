import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { SceneEntry } from './scenes/SceneEntry';
import { ScenePain } from './scenes/ScenePain';
import { SceneHow } from './scenes/SceneHow';
import { SceneProof } from './scenes/SceneProof';
import { SceneDecision } from './scenes/SceneDecision';
import { SceneAction } from './scenes/SceneAction';
import { SceneFAQ } from './scenes/SceneFAQ';
import { SceneAbout } from './scenes/SceneAbout';
import { SceneTestimonials } from './scenes/SceneTestimonials';
import { LivingSystemBackground } from './effects/LivingSystemBackground';
import { ProgressIndicator } from './effects/ProgressIndicator';
import { Header } from './Header';

// Detect mobile and reduced motion preference
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const ScrollExperience = () => {
  const containerRef = useRef(null);
  const [currentScene, setCurrentScene] = useState(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollVelocity = useMotionValue(0);
  
  const mobile = isMobile();
  const reducedMotion = prefersReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Reduced animation complexity for mobile
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: mobile ? 50 : 30,
    damping: mobile ? 40 : 30,
    restDelta: mobile ? 0.01 : 0.001
  });
  
  const smoothScrollVelocity = useSpring(scrollVelocity, {
    stiffness: mobile ? 150 : 100,
    damping: mobile ? 40 : 30,
    restDelta: mobile ? 0.01 : 0.001
  });
  
  useEffect(() => {
    let rafId;
    let decayInterval;
    
    const handleScroll = () => {
      const currentY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = currentY - lastScrollY.current;
      const deltaTime = Math.max(currentTime - lastScrollTime.current, 1);
      
      const velocity = (deltaY / deltaTime) * 16;
      scrollVelocity.set(velocity);
      
      lastScrollY.current = currentY;
      lastScrollTime.current = currentTime;
    };
    
    // Throttle decay interval on mobile
    decayInterval = setInterval(() => {
      const timeSinceScroll = Date.now() - lastScrollTime.current;
      if (timeSinceScroll > 100) {
        const currentVel = scrollVelocity.get();
        scrollVelocity.set(currentVel * 0.9);
      }
    }, mobile ? 100 : 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(decayInterval);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollVelocity, mobile]);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const sceneIndex = Math.floor(value * 9);
      setCurrentScene(Math.min(sceneIndex, 8));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div 
      ref={containerRef}
      className="relative bg-background min-h-[600vh]"
      style={{ 
        willChange: mobile ? 'auto' : 'transform',
        transform: 'translateZ(0)' // GPU acceleration
      }}
    >
      <Header />
      
      <div className="fixed inset-0 z-0">
        <LivingSystemBackground 
          progress={smoothProgress} 
          scrollVelocity={smoothScrollVelocity}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, hsl(var(--background)) 100%)'
          }}
        />
      </div>
      
      {!reducedMotion && <ProgressIndicator progress={smoothProgress} currentScene={currentScene} />}
      
      <div className="relative z-10">
        <SceneEntry />
        <ScenePain />
        <SceneHow />
        <SceneProof />
        <SceneDecision />
        <SceneFAQ />
        <SceneAbout />
        <SceneTestimonials />
        <SceneAction />
      </div>
      
      {!mobile && <div className="fixed inset-0 z-20 pointer-events-none noise-overlay" />}
    </div>
  );
};
