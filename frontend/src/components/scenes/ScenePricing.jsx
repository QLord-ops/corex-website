import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

export const ScenePricing = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const items = t('scenePricing.items') || [];

  return (
    <section
      ref={sectionRef}
      className="min-h-[60dvh] flex items-center justify-center px-4 sm:px-6 py-14 sm:py-20"
    >
      <div className="max-w-4xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-scene-statement">{t('scenePricing.title')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {Array.isArray(items) && items.map((item, idx) => (
            <motion.div
              key={idx}
              className="border border-border/60 rounded-sm p-6 bg-secondary/15 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h3 className="text-base font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <p className="text-2xl sm:text-3xl font-light text-primary tracking-tight">
                {item.range}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {t('scenePricing.note')}
        </motion.p>
      </div>
    </section>
  );
};
