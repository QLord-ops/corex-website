import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText, AnimatedLine, StaggeredText } from '../effects/AnimatedText';
import { Button } from '../ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export const SceneEntry = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  
  const scrollToExplore = () => {
    window.scrollTo({
      top: window.innerHeight * 1.2,
      behavior: 'smooth'
    });
  };
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center relative"
    >
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-0"
        style={{ opacity, y, scale }}
      >
        {/* Main headline */}
        <div className="mb-10 sm:mb-12">
          <StaggeredText 
            text={t('entry.hero')}
            className="text-scene-hero text-glow mb-8"
          />
        </div>
        
        {/* Supporting statements */}
        <AnimatedText delay={0.6} className="mb-8">
          <p className="text-scene-body max-w-2xl mx-auto">
            {t('entry.subtitle')}
          </p>
        </AnimatedText>
        
        <AnimatedLine 
          className="h-px w-24 mx-auto mb-8" 
          delay={0.8}
        />
        
        <AnimatedText delay={1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-scene-small mb-12">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              {t('entry.clearDeadlines')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              {t('entry.transparentProcess')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              {t('entry.realSupport')}
            </span>
          </div>
        </AnimatedText>
        
        {/* Primary CTA Button - Calm and minimal */}
        <AnimatedText delay={1.2}>
          <button
            onClick={scrollToExplore}
            className="inline-flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded-sm transition-colors duration-500 group"
          >
            <span>{t('entry.exploreButton')}</span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="opacity-50 group-hover:opacity-80 transition-opacity"
            >
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </button>
        </AnimatedText>
      </motion.div>
    </section>
  );
};
