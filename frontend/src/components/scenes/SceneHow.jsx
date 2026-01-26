import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedText, AnimatedLine } from '../effects/AnimatedText';

const howSteps = [
  { 
    text: "We define the system.",
    description: "Clear architecture, documented processes",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
  },
  { 
    text: "We build what matters.",
    description: "Focused development, measured progress",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
  },
  { 
    text: "We automate the flow.",
    description: "Systematic efficiency, reduced friction",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
  },
  { 
    text: "We run and support it.",
    description: "Ongoing operation, continuous improvement",
    icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
  }
];

const HowStep = ({ step, index, total }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-10% 0px -10% 0px" 
  });
  
  return (
    <motion.div
      ref={ref}
      className="min-h-[55vh] sm:min-h-[60vh] flex items-center justify-center px-4 sm:px-6"
    >
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Step indicator and line */}
        <div className="flex items-center gap-6 mb-8">
          <motion.div
            className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ 
              duration: 0.4, 
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-primary"
            >
              <path d={step.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          
          <motion.div
            className="flex-1 h-px bg-border"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left' }}
          />
          
          <motion.span 
            className="text-sm text-muted-foreground font-medium"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </motion.span>
        </div>
        
        {/* Main text */}
        <motion.h2
          className="text-scene-statement mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {step.text}
        </motion.h2>
        
        {/* Description */}
        <motion.p
          className="text-scene-small text-muted-foreground"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.4, 
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {step.description}
        </motion.p>
        
        {/* Progress bar */}
        <motion.div 
          className="mt-8 h-0.5 bg-border rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={isInView ? { width: `${((index + 1) / total) * 100}%` } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const SceneHow = () => {
  return (
    <section className="relative">
      {/* Section intro */}
      <div className="min-h-[30vh] sm:min-h-[40vh] flex items-end justify-center pb-8 sm:pb-12 px-4 sm:px-6">
        <AnimatedText className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground block mb-4">
            The approach
          </span>
          <h2 className="text-scene-body text-foreground/80">
            How we bring order
          </h2>
        </AnimatedText>
      </div>
      
      {/* How steps */}
      {howSteps.map((step, index) => (
        <HowStep 
          key={index} 
          step={step} 
          index={index}
          total={howSteps.length}
        />
      ))}
    </section>
  );
};
