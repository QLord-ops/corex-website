import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { SceneEntry } from './scenes/SceneEntry';
import { ScenePain } from './scenes/ScenePain';
import { SceneHow } from './scenes/SceneHow';
import { SceneAbout } from './scenes/SceneAbout';
import { SceneCases } from './scenes/SceneCases';
import { SceneProof } from './scenes/SceneProof';
import { SceneFaq } from './scenes/SceneFaq';
import { SceneDecision } from './scenes/SceneDecision';
import { SceneAction } from './scenes/SceneAction';
import { LivingSystemBackground } from './effects/LivingSystemBackground';
import { ProgressIndicator } from './effects/ProgressIndicator';
import { Header } from './Header';

export const ScrollExperience = () => {
  const sceneCount = 9;
  const containerRef = useRef(null);
  const [currentScene, setCurrentScene] = useState(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollVelocity = useMotionValue(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 30,
    restDelta: 0.001
  });
  
  // Smooth scroll velocity with decay
  const smoothScrollVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Track scroll velocity
  useEffect(() => {
    let rafId;
    let decayInterval;
    
    const handleScroll = () => {
      const currentY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = currentY - lastScrollY.current;
      const deltaTime = Math.max(currentTime - lastScrollTime.current, 1);
      
      // Calculate velocity (pixels per millisecond, scaled)
      const velocity = (deltaY / deltaTime) * 16; // Normalize to ~60fps
      scrollVelocity.set(velocity);
      
      lastScrollY.current = currentY;
      lastScrollTime.current = currentTime;
    };
    
    // Decay velocity when not scrolling
    decayInterval = setInterval(() => {
      const timeSinceScroll = Date.now() - lastScrollTime.current;
      if (timeSinceScroll > 100) {
        // Gradually decay velocity
        const currentVel = scrollVelocity.get();
        scrollVelocity.set(currentVel * 0.9);
      }
    }, 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(decayInterval);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollVelocity]);
  
  // Track current scene for progress indicator
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const sceneIndex = Math.floor(value * sceneCount);
      setCurrentScene(Math.min(sceneIndex, sceneCount - 1));
    });
    return () => unsubscribe();
  }, [scrollYProgress, sceneCount]);

  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative bg-background min-h-[760vh] sm:min-h-[820vh] md:min-h-[860vh] lg:min-h-[900vh]"
      aria-label="AIONEX digital systems overview"
    >
      {/* Header with AIONEX branding and navigation */}
      <Header />
      
      {/* Fixed background layer - THE LIVING SYSTEM */}
      <div className="fixed inset-0 z-0">
        <LivingSystemBackground 
          progress={smoothProgress} 
          scrollVelocity={smoothScrollVelocity}
        />
        
        {/* Subtle vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, hsl(var(--background)) 100%)'
          }}
        />
      </div>
      
      {/* Progress indicator */}
      <ProgressIndicator progress={smoothProgress} currentScene={currentScene} />
      
      {/* Scenes */}
      <div className="relative z-10">
        <div id="explore">
          <SceneEntry />
        </div>
        <div id="pain">
          <ScenePain />
        </div>
        <div id="how">
          <SceneHow />
        </div>
        <div id="about">
          <SceneAbout />
        </div>
        <div id="cases">
          <SceneCases />
        </div>
        <div id="proof">
          <SceneProof />
        </div>
        <div id="faq">
          <SceneFaq />
        </div>
        <div id="decision">
          <SceneDecision />
        </div>
        <div id="contact">
          <SceneAction />
        </div>
      </div>
      
      {/* Subtle noise overlay for texture */}
      <div className="fixed inset-0 z-20 pointer-events-none noise-overlay" />
    </main>
  );
};
