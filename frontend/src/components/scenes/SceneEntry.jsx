import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText, AnimatedLine, StaggeredText } from '../effects/AnimatedText';

export const SceneEntry = () => {
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative"
    >
      <motion.div 
        className="max-w-4xl mx-auto px-6 text-center"
        style={{ opacity, y, scale }}
      >
        {/* Main headline */}
        <div className="mb-12">
          <StaggeredText 
            text="Turn chaos into a working system."
            className="text-scene-hero text-glow mb-8"
          />
        </div>
        
        {/* Supporting statements */}
        <AnimatedText delay={0.6} className="mb-8">
          <p className="text-scene-body max-w-2xl mx-auto">
            Build, automate, manage, support — in one team.
          </p>
        </AnimatedText>
        
        <AnimatedLine 
          className="h-px w-24 mx-auto mb-8" 
          delay={0.8}
        />
        
        <AnimatedText delay={1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-scene-small">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              Clear deadlines
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              Transparent process
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              Real support
            </span>
          </div>
        </AnimatedText>
        
        {/* Scroll indicator */}
        <AnimatedText delay={1.5} className="mt-20">
          <motion.div 
            className="flex flex-col items-center gap-2 text-muted-foreground"
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <span className="text-xs uppercase tracking-widest">Scroll to enter</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="opacity-50"
            >
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </motion.div>
        </AnimatedText>
      </motion.div>
    </section>
  );
};
