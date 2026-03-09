import { useRef, useEffect, useState } from 'react';
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
  
  const smoothScrollVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  useEffect(() => {
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
    
    decayInterval = setInterval(() => {
      const timeSinceScroll = Date.now() - lastScrollTime.current;
      if (timeSinceScroll > 100) {
        const currentVel = scrollVelocity.get();
        scrollVelocity.set(currentVel * 0.9);
      }
    }, 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(decayInterval);
    };
  }, [scrollVelocity]);
  
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
      className="relative bg-background min-h-[620vh] sm:min-h-[680vh] md:min-h-[720vh] lg:min-h-[760vh]"
      aria-label="AIONEX digital systems overview"
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
      
      <ProgressIndicator progress={smoothProgress} currentScene={currentScene} />
      
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
        <div id="about" className="relative z-[100]">
          <SceneAbout />
        </div>
        <div id="cases" className="relative z-[100]">
          <SceneCases />
        </div>
        <div id="proof" className="relative z-[100]">
          <SceneProof />
        </div>
        <div id="faq" className="relative z-[100]">
          <SceneFaq />
        </div>
        <div id="decision" className="relative z-[100]">
          <SceneDecision />
        </div>
        <div id="contact" className="relative z-[100]">
          <SceneAction />
        </div>
      </div>
      
      <div className="fixed inset-0 z-20 pointer-events-none noise-overlay" />
    </main>
  );
};
