import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from '@/i18n/translations';

export const SceneTestimonials = () => {
  const { t, language } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  const items = translations[language]?.testimonials?.items || [];

  return (
    <section
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 py-12"
    >
      <div className="max-w-4xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-scene-statement mb-4">{t('testimonials.title')}</h2>
          <p className="text-scene-small text-muted-foreground">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="bg-secondary/30 border border-border rounded-sm p-6 flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <p className="text-scene-small text-foreground/90 flex-1 mb-6 italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground/90">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
