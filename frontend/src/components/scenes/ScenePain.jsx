import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { AnimatedText } from '../effects/AnimatedText';
import { useTranslation } from '@/hooks/useTranslation';

const PainStatement = ({ text, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-30% 0px -30% 0px" 
  });
  
  return (
    <motion.div
      ref={ref}
      className="min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.8, delay: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
        animate={isInView ? { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)'
        } : {}}
        transition={{ 
          duration: 1.4, 
          delay: 0.6,
          ease: [0.16, 1, 0.3, 1]
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
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-0.5 bg-destructive/30"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ 
                delay: 1.4 + i * 0.15,
                duration: 0.6
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
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  
  const painPoints = [
    { text: t('pain.point1'), id: 1 },
    { text: t('pain.point2'), id: 2 },
    { text: t('pain.point3'), id: 3 }
  ];
  
  return (
    <section ref={sectionRef} className="relative">
      {/* Section intro */}
      <div className="min-h-[30vh] sm:min-h-[40vh] flex items-end justify-center pb-8 sm:pb-12 px-4 sm:px-6">
        <AnimatedText>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t('pain.sectionTitle')}
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
      <div className="h-[30vh] flex items-center justify-center">
        <motion.div
          className="w-px h-full bg-gradient-to-b from-destructive/30 via-primary/50 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'top' }}
        />
      </div>
    </section>
  );
};
