import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { SceneEntry } from './scenes/SceneEntry';
import { ScenePain } from './scenes/ScenePain';
import { SceneHow } from './scenes/SceneHow';
import { SceneProof } from './scenes/SceneProof';
import { SceneDecision } from './scenes/SceneDecision';
import { SceneAction } from './scenes/SceneAction';
import { GridBackground } from './effects/GridBackground';
import { ProgressIndicator } from './effects/ProgressIndicator';

// Ambient breathing glow component
const AmbientGlow = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary ambient glow - very subtle, slow breathing */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[60vw] h-[60vh] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsla(180, 40%, 25%, 0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
          x: [0, 15, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror"
        }}
      />
      
      {/* Secondary ambient glow - offset timing */}
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[50vw] h-[50vh] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsla(200, 30%, 20%, 0.03) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          opacity: [0.25, 0.4, 0.25],
          scale: [1, 1.08, 1],
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
          delay: 8
        }}
      />
    </div>
  );
};

export const ScrollExperience = () => {
  const containerRef = useRef(null);
  const [currentScene, setCurrentScene] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });
  
  // Background opacity based on scroll
  const bgOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.5, 0.7]);
  
  // Track current scene for progress indicator
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const sceneIndex = Math.floor(value * 6);
      setCurrentScene(Math.min(sceneIndex, 5));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div 
      ref={containerRef}
      className="relative bg-background min-h-[600vh]"
    >
      {/* Fixed background layer */}
      <div className="fixed inset-0 z-0">
        <GridBackground progress={smoothProgress} />
        <AmbientGlow />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"
          style={{ opacity: bgOpacity }}
        />
      </div>
      
      {/* Progress indicator */}
      <ProgressIndicator progress={smoothProgress} currentScene={currentScene} />
      
      {/* Scenes */}
      <div className="relative z-10">
        <SceneEntry />
        <ScenePain />
        <SceneHow />
        <SceneProof />
        <SceneDecision />
        <SceneAction />
      </div>
      
      {/* Subtle noise overlay */}
      <div className="fixed inset-0 z-20 pointer-events-none noise-overlay" />
    </div>
  );
};
