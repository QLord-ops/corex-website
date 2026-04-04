import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText, AnimatedLine } from '../effects/AnimatedText';
import { useLanguage } from '@/i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

export const SceneEntry = () => {
  const sectionRef = useRef(null);
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const headline = t('sceneEntry.headline');
  const headlineWithoutBrand = headline.replace(/^AIONEX\s*[—\-]\s*|^AIONEXX?\s*/i, '').trim();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  
  const openBooking = () => {
    const bookingUrl = process.env.REACT_APP_BOOK_CALL_URL || 'mailto:aionex.info@gmail.com';
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center relative"
    >
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-[max(6rem,calc(env(safe-area-inset-top,0px)+4.5rem))] sm:pt-16 md:pt-8"
        style={{ opacity, y, scale }}
      >
        {/* Main headline */}
        <div className="mb-10 sm:mb-12">
          <h1 className="sr-only">{headline}</h1>
          <AnimatedText>
            <img
              src="/aionex-wordmark.png"
              alt="AIONEX"
              className="h-12 sm:h-16 md:h-20 w-auto mx-auto mb-4"
            />
            <p className="text-scene-hero text-glow">{headlineWithoutBrand}</p>
          </AnimatedText>
        </div>
        
        {/* Supporting statements */}
        <AnimatedText delay={0.6} className="mb-8">
          <p className="text-scene-body max-w-2xl mx-auto">
            {t('sceneEntry.subline')}
          </p>
        </AnimatedText>

        <AnimatedText delay={0.7} className="mb-8">
          <p className="text-scene-small max-w-3xl mx-auto text-muted-foreground">
            {t('sceneEntry.explainer')}
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
              {t('sceneEntry.bullets.0')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              {t('sceneEntry.bullets.1')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              {t('sceneEntry.bullets.2')}
            </span>
          </div>
        </AnimatedText>
        
        {/* Main CTA group */}
        <AnimatedText delay={1.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                trackEvent('cta_click', {
                  cta: 'primary_offer_24h',
                  location: 'hero',
                  language,
                });
                navigate(`/${language}/consultation`);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 text-sm bg-primary text-primary-foreground border border-primary rounded-sm hover:opacity-90 transition-opacity duration-300"
            >
              <span>{t('sceneEntry.primaryCta')}</span>
            </button>
            <button
              onClick={() => {
                trackEvent('cta_click', {
                  cta: 'book_call',
                  location: 'hero',
                  language,
                });
                openBooking();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded-sm transition-colors duration-500 group"
            >
              <span>{t('sceneEntry.cta')}</span>
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
          </div>
        </AnimatedText>
      </motion.div>
    </section>
  );
};
