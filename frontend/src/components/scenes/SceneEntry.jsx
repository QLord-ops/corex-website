import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText, AnimatedLine, StaggeredText } from '../effects/AnimatedText';
import { Button } from '../ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { shouldReduceAnimations } from '@/utils/device';

export const SceneEntry = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  
  useEffect(() => {
    setReduceAnimations(shouldReduceAnimations());
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Hooks must be called unconditionally - always call useTransform
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const yFull = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yReduced = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scaleFull = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const scaleReduced = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  
  // Use conditional values in style, not conditional hooks
  const y = reduceAnimations ? yReduced : yFull;
  const scale = reduceAnimations ? scaleReduced : scaleFull;
  
  const scrollToExplore = () => {
    window.scrollTo({
      top: window.innerHeight * 1.2,
      behavior: 'smooth'
    });
  };
  
  return (
    <header 
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center relative"
    >
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-0"
        style={reduceAnimations ? {} : { opacity, y, scale }}
      >
        {/* H1 - Only one per page */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-scene-hero text-glow mb-8">
            Corex Digital – Web Development & System Engineering
          </h1>
        </div>
        
        {/* H2 - Slogan */}
        {reduceAnimations ? (
          <h2 className="text-scene-body max-w-2xl mx-auto mb-8">
            Turn chaos into a working system.
          </h2>
        ) : (
          <AnimatedText delay={0.4} className="mb-8">
            <h2 className="text-scene-body max-w-2xl mx-auto">
              Turn chaos into a working system.
            </h2>
          </AnimatedText>
        )}
        
        {/* Supporting text */}
        {reduceAnimations ? (
          <p className="text-scene-body max-w-2xl mx-auto text-muted-foreground mb-8">
            {t('entry.subtitle')}
          </p>
        ) : (
          <AnimatedText delay={0.6} className="mb-8">
            <p className="text-scene-body max-w-2xl mx-auto text-muted-foreground">
              {t('entry.subtitle')}
            </p>
          </AnimatedText>
        )}
        
        {/* Brand reinforcement SEO paragraph */}
        {reduceAnimations ? (
          <p className="text-scene-small max-w-2xl mx-auto text-muted-foreground/80 mb-8">
            Corex Digital is a Germany-based web development and system engineering company specializing in scalable digital infrastructure, automation, and full-stack solutions for startups and B2B teams.
          </p>
        ) : (
          <AnimatedText delay={0.7} className="mb-8">
            <p className="text-scene-small max-w-2xl mx-auto text-muted-foreground/80">
              Corex Digital is a Germany-based web development and system engineering company specializing in scalable digital infrastructure, automation, and full-stack solutions for startups and B2B teams.
            </p>
          </AnimatedText>
        )}
        
        {!reduceAnimations && (
          <AnimatedLine 
            className="h-px w-24 mx-auto mb-8" 
            delay={0.8}
          />
        )}
        
        {reduceAnimations ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-scene-small mb-12">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t('entry.clearDeadlines')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t('entry.transparentProcess')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t('entry.realSupport')}
            </span>
          </div>
        ) : (
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
        )}
        
        {/* Primary CTA Button */}
        {reduceAnimations ? (
          <button
            onClick={scrollToExplore}
            className="inline-flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded-sm transition-colors duration-300 group"
            aria-label={t('entry.exploreButton')}
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
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </button>
        ) : (
          <AnimatedText delay={1.2}>
            <button
              onClick={scrollToExplore}
              className="inline-flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded-sm transition-colors duration-500 group"
              aria-label={t('entry.exploreButton')}
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
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </button>
          </AnimatedText>
        )}
      </motion.div>
    </header>
  );
};
