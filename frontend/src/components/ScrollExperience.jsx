import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { isMobile } from '@/utils/device';
import { SceneEntry } from './scenes/SceneEntry';
import { ScenePain } from './scenes/ScenePain';
import { SceneHow } from './scenes/SceneHow';
import { Header } from './Header';
import { ProgressIndicator } from './effects/ProgressIndicator';

const SceneAbout = lazy(() => import('./scenes/SceneAbout').then(m => ({ default: m.SceneAbout })));
const SceneCases = lazy(() => import('./scenes/SceneCases').then(m => ({ default: m.SceneCases })));
const SceneProof = lazy(() => import('./scenes/SceneProof').then(m => ({ default: m.SceneProof })));
const SceneFaq = lazy(() => import('./scenes/SceneFaq').then(m => ({ default: m.SceneFaq })));
const SceneDecision = lazy(() => import('./scenes/SceneDecision').then(m => ({ default: m.SceneDecision })));
const SceneAction = lazy(() => import('./scenes/SceneAction').then(m => ({ default: m.SceneAction })));

const LivingSystemBackground = lazy(() => import('./effects/LivingSystemBackground').then(m => ({ default: m.LivingSystemBackground })));

export const ScrollExperience = () => {
  const sceneCount = 9;
  const containerRef = useRef(null);
  const [currentScene, setCurrentScene] = useState(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollVelocity = useMotionValue(0);
  const mobile = useRef(typeof window !== 'undefined' && isMobile());
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: mobile.current ? 50 : 30,
    damping: mobile.current ? 40 : 30,
    restDelta: mobile.current ? 0.005 : 0.001
  });
  
  const smoothScrollVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30,
    restDelta: mobile.current ? 0.01 : 0.001
  });
  
  useEffect(() => {
    let decayInterval;
    const isMob = mobile.current;
    
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
    
    const decayMs = isMob ? 150 : 50;
    decayInterval = setInterval(() => {
      const timeSinceScroll = Date.now() - lastScrollTime.current;
      if (timeSinceScroll > 100) {
        const currentVel = scrollVelocity.get();
        scrollVelocity.set(currentVel * (isMob ? 0.7 : 0.9));
      }
    }, decayMs);
    
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
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <LivingSystemBackground
            progress={smoothProgress}
            scrollVelocity={smoothScrollVelocity}
          />
        </Suspense>
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
        <Suspense fallback={null}>
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
        </Suspense>
      </div>
      
      {!mobile.current && <div className="fixed inset-0 z-20 pointer-events-none noise-overlay" />}
    </main>
  );
};
