import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText, AnimatedLine } from '../effects/AnimatedText';
import { useTranslation } from '@/hooks/useTranslation';

// Detect mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const SceneEntry = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const mobile = isMobile();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Simplified transforms for mobile
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const y = mobile ? useTransform(scrollYProgress, [0, 1], [0, -30]) : useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = mobile ? useTransform(scrollYProgress, [0, 1], [1, 1]) : useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  
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
      style={{ willChange: 'auto' }}
    >
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-0"
        style={{ 
          opacity, 
          y, 
          scale,
          transform: 'translateZ(0)' // GPU acceleration
        }}
      >
        {/* H1 - Only one per page */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-scene-hero text-glow mb-8">
            Corex Digital – Web Development & System Engineering
          </h1>
        </div>
        
        {/* H2 - Slogan */}
        <AnimatedText delay={mobile ? 0 : 0.4} className="mb-8">
          <h2 className="text-scene-body max-w-2xl mx-auto">
            Turn chaos into a working system.
          </h2>
        </AnimatedText>
        
        {/* Supporting text */}
        <AnimatedText delay={mobile ? 0 : 0.6} className="mb-8">
          <p className="text-scene-body max-w-2xl mx-auto text-muted-foreground">
            {t('entry.subtitle')}
          </p>
        </AnimatedText>
        
        {/* Brand reinforcement SEO paragraph */}
        <AnimatedText delay={mobile ? 0 : 0.7} className="mb-8">
          <p className="text-scene-small max-w-2xl mx-auto text-muted-foreground/80">
            Corex Digital is a Germany-based web development and system engineering company specializing in scalable digital infrastructure, automation, and full-stack solutions for startups and B2B teams.
          </p>
        </AnimatedText>
        
        <AnimatedLine 
          className="h-px w-24 mx-auto mb-8" 
          delay={mobile ? 0 : 0.8}
        />
        
        <AnimatedText delay={mobile ? 0 : 1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-scene-small mb-12">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animation: mobile ? 'none' : undefined }} />
              {t('entry.clearDeadlines')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animation: mobile ? 'none' : undefined }} />
              {t('entry.transparentProcess')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animation: mobile ? 'none' : undefined }} />
              {t('entry.realSupport')}
            </span>
          </div>
        </AnimatedText>
        
        {/* Primary CTA Button */}
        <AnimatedText delay={mobile ? 0 : 1.2}>
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
        </AnimatedText>
      </motion.div>
    </header>
  );
};
