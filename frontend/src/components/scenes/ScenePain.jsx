import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { AnimatedText } from '../effects/AnimatedText';
import { useLanguage } from '@/i18n/LanguageContext';

const PainStatement = ({ text, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-10% 0px -10% 0px" 
  });
  
  return (
    <motion.div
      ref={ref}
      className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.55, delay: 0.05 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
        animate={isInView ? { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)'
        } : {}}
        transition={{ 
          duration: 0.6, 
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="text-center"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-scene-statement text-foreground/90">
          {text}
        </h3>
        
        {/* Visual element - subtle stress indicator */}
        <motion.div 
          className="mt-8 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25, duration: 0.35 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-0.5 bg-destructive/30"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ 
                delay: 0.3 + i * 0.08,
                duration: 0.3
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
  const { t } = useLanguage();
  const painPoints = [
    t('scenePain.points.0'),
    t('scenePain.points.1'),
    t('scenePain.points.2'),
    t('scenePain.points.3'),
  ];
  
  return (
    <section ref={sectionRef} className="relative">
      {/* Section intro */}
      <div className="min-h-[20vh] sm:min-h-[24vh] flex items-end justify-center pb-8 sm:pb-12 px-4 sm:px-6">
        <AnimatedText className="text-center">
          <h2 className="text-scene-body text-foreground/80">
            {t('scenePain.intro')}
          </h2>
        </AnimatedText>
      </div>
      
      {/* Pain points */}
      {painPoints.map((point, index) => (
        <PainStatement 
          key={index} 
          text={point}
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'top' }}
        />
      </div>
    </section>
  );
};
