import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { StaggeredText } from '../effects/AnimatedText';

export const SceneDecision = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  
  const isInView = useInView(contentRef, { 
    once: true, 
    margin: "-20% 0px -20% 0px" 
  });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0.2, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.8, 1], [0, 1, 1, 0.5]);
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative px-6"
    >
      <motion.div
        ref={contentRef}
        className="max-w-3xl text-center"
        style={{ scale, opacity }}
      >
        {/* Visual divider */}
        <motion.div 
          className="mb-12 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="w-12 h-px bg-border" />
          <div className="w-2 h-2 rotate-45 border border-primary/50" />
          <div className="w-12 h-px bg-border" />
        </motion.div>
        
        {/* Main statement */}
        <motion.h2
          className="text-scene-statement mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <span className="text-foreground/50">No sales.</span>
          <br />
          <span className="text-foreground/50">No experiments.</span>
          <br />
          <span className="text-foreground">Just systems that work.</span>
        </motion.h2>
        
        {/* Subtle emphasis line */}
        <motion.div
          className="w-32 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
        />
        
        {/* Confidence indicators */}
        <motion.div
          className="mt-16 flex justify-center gap-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-muted-foreground">Proven</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-muted-foreground">Secure</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-muted-foreground">Fast</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
