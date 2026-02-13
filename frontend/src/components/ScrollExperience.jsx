import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { SceneEntry } from './scenes/SceneEntry';
import { Header } from './Header';
import { ProgressIndicator } from './effects/ProgressIndicator';
import { shouldReduceAnimations } from '@/utils/device';

// Lazy load heavy components - same background on desktop and mobile
const LivingSystemBackground = lazy(() => import('./effects/LivingSystemBackground').then(m => ({ default: m.LivingSystemBackground })));

const ScenePain = lazy(() => import('./scenes/ScenePain').then(m => ({ default: m.ScenePain })));
const SceneHow = lazy(() => import('./scenes/SceneHow').then(m => ({ default: m.SceneHow })));
const SceneProof = lazy(() => import('./scenes/SceneProof').then(m => ({ default: m.SceneProof })));
const SceneDecision = lazy(() => import('./scenes/SceneDecision').then(m => ({ default: m.SceneDecision })));
const SceneFAQ = lazy(() => import('./scenes/SceneFAQ').then(m => ({ default: m.SceneFAQ })));
const SceneAbout = lazy(() => import('./scenes/SceneAbout').then(m => ({ default: m.SceneAbout })));
const SceneTestimonials = lazy(() => import('./scenes/SceneTestimonials').then(m => ({ default: m.SceneTestimonials })));
const SceneAction = lazy(() => import('./scenes/SceneAction').then(m => ({ default: m.SceneAction })));
const ConsultationBot = lazy(() => import('./ConsultationBot').then(m => ({ default: m.ConsultationBot })));

const LoadingPlaceholder = () => <div className="min-h-[100dvh]" />;

export const ScrollExperience = () => {
  const containerRef = useRef(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollVelocity = useMotionValue(0);
  
  useEffect(() => {
    try {
      setReduceAnimations(shouldReduceAnimations());
    } catch (error) {
      console.error('Error initializing device detection:', error);
      setReduceAnimations(false);
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reduceAnimations ? 50 : 30,
    damping: reduceAnimations ? 50 : 30,
    restDelta: 0.001
  });
  
  const smoothScrollVelocity = useSpring(scrollVelocity, {
    stiffness: reduceAnimations ? 150 : 100,
    damping: reduceAnimations ? 50 : 30,
    restDelta: 0.001
  });
  
  useEffect(() => {
    if (reduceAnimations) return; // Skip velocity tracking on mobile
    
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
  }, [scrollVelocity, reduceAnimations]);
  
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
      
      {!reduceAnimations && (
        <ProgressIndicator progress={smoothProgress} currentScene={currentScene} />
      )}
      
      <div className="relative z-10">
        <SceneEntry />
        <Suspense fallback={<LoadingPlaceholder />}>
          <ScenePain />
          <SceneHow />
          <SceneProof />
          <SceneDecision />
          <SceneFAQ />
          <SceneAbout />
          <SceneTestimonials />
          <ConsultationBot />
          <SceneAction />
        </Suspense>
      </div>
      
      {!reduceAnimations && (
        <div className="fixed inset-0 z-20 pointer-events-none noise-overlay" />
      )}
    </div>
  );
};
