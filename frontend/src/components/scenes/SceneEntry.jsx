import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText, AnimatedLine } from '../effects/AnimatedText';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackEvent } from '@/lib/analytics';

export const SceneEntry = () => {
  const sectionRef = useRef(null);
  const { t, language } = useLanguage();
  const headline = t('sceneEntry.headline');
  const headlineWithoutBrand = headline.replace(/^AIONEX\s*[—\-]\s*|^AIONEXX?\s*/i, '').trim();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const badges = t('sceneEntry.badges') || [];

  return (
    <section
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center relative"
    >
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-[max(6rem,calc(env(safe-area-inset-top,0px)+4.5rem))] sm:pt-16 md:pt-8"
        style={{ opacity, y, scale }}
      >
        <div className="mb-8 sm:mb-10">
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

        <AnimatedText delay={0.5} className="mb-8">
          <p className="text-scene-body max-w-2xl mx-auto">
            {t('sceneEntry.subline')}
          </p>
        </AnimatedText>

        <AnimatedText delay={0.7} className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
            {Array.isArray(badges) && badges.map((badge, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-xs sm:text-sm border border-border/60 rounded-sm text-muted-foreground bg-secondary/20"
              >
                {badge}
              </span>
            ))}
          </div>
        </AnimatedText>

        <AnimatedLine className="h-px w-24 mx-auto mb-8" delay={0.9} />

        <AnimatedText delay={1.1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                trackEvent('cta_click', { cta: 'primary_assessment', location: 'hero', language });
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 text-sm bg-primary text-primary-foreground border border-primary rounded-sm hover:opacity-90 transition-opacity duration-300"
            >
              <span>{t('sceneEntry.primaryCta')}</span>
            </button>
            <button
              onClick={() => {
                trackEvent('cta_click', { cta: 'see_services', location: 'hero', language });
                const el = document.getElementById('services');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded-sm transition-colors duration-500 group"
            >
              <span>{t('sceneEntry.cta')}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50 group-hover:opacity-80 transition-opacity">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </button>
          </div>
        </AnimatedText>
      </motion.div>
    </section>
  );
};
