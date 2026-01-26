import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { AnimatedText } from '../effects/AnimatedText';

const painPoints = [
  { text: "Projects stall.", id: 1 },
  { text: "No clear ownership.", id: 2 },
  { text: "Manual work kills growth.", id: 3 }
];

const PainStatement = ({ text, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-20% 0px -20% 0px" 
  });
  
  return (
    <motion.div
      ref={ref}
      className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={isInView ? { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)'
        } : {}}
        transition={{ 
          duration: 0.8, 
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="text-center"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="text-scene-statement text-foreground/90">
          {text}
        </h2>
        
        {/* Visual element - subtle stress indicator */}
        <motion.div 
          className="mt-8 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-0.5 bg-destructive/30"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ 
                delay: 0.7 + i * 0.1,
                duration: 0.4
              }}
              style={{ transformOrigin: 'left' }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const ScenePain = () => {
  const sectionRef = useRef(null);
  
  return (
    <section ref={sectionRef} className="relative">
      {/* Section intro */}
      <div className="min-h-[30vh] sm:min-h-[40vh] flex items-end justify-center pb-8 sm:pb-12 px-4 sm:px-6">
        <AnimatedText>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            The reality
          </span>
        </AnimatedText>
      </div>
      
      {/* Pain points */}
      {painPoints.map((point, index) => (
        <PainStatement 
          key={point.id} 
          text={point.text} 
          index={index}
        />
      ))}
      
      {/* Transition visual */}
      <div className="h-[20vh] flex items-center justify-center">
        <motion.div
          className="w-px h-full bg-gradient-to-b from-destructive/30 via-primary/50 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          style={{ transformOrigin: 'top' }}
        />
      </div>
    </section>
  );
};
