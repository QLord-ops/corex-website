import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { StaggeredText } from '../effects/AnimatedText';
import { useLanguage } from '@/i18n/LanguageContext';

export const SceneDecision = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  
  const isInView = useInView(contentRef, { 
    once: true, 
    margin: "-10% 0px -10% 0px" 
  });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0.1, 0.35], [0.97, 1]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.25, 0.8, 1], [0, 1, 1, 0.6]);
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-[75dvh] sm:min-h-[85dvh] flex items-center justify-center relative px-4 sm:px-6"
    >
      <motion.div
        ref={contentRef}
        className="max-w-3xl text-center"
        style={{ scale, opacity }}
      >
        {/* Visual divider - appears first */}
        <motion.div 
          className="mb-10 sm:mb-16 flex items-center justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <div className="w-12 h-px bg-border" />
          <div className="w-2 h-2 rotate-45 border border-primary/50" />
          <div className="w-12 h-px bg-border" />
        </motion.div>
        
        {/* Main statement - delayed pause before appearing */}
        <motion.h2
          className="text-scene-statement mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.6, 
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <motion.span 
            className="text-foreground/50 block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {t('sceneDecision.lines.0')}
          </motion.span>
          <motion.span 
            className="text-foreground/50 block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {t('sceneDecision.lines.1')}
          </motion.span>
          <motion.span 
            className="text-foreground block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.45 }}
          >
            {t('sceneDecision.lines.2')}
          </motion.span>
        </motion.h2>
        
        {/* Subtle emphasis line */}
        <motion.div
          className="w-32 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
        />
        
        {/* Confidence indicators */}
        <motion.div
          className="mt-10 sm:mt-16 flex flex-wrap justify-center gap-6 sm:gap-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.65, duration: 0.45 }}
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
            <span className="text-xs text-muted-foreground">{t('sceneDecision.badges.0')}</span>
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
            <span className="text-xs text-muted-foreground">{t('sceneDecision.badges.1')}</span>
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
            <span className="text-xs text-muted-foreground">{t('sceneDecision.badges.2')}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
