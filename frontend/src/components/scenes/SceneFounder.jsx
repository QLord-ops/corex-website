import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

export const SceneFounder = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const bio = t('sceneFounder.bio') || [];

  return (
    <section
      ref={sectionRef}
      className="min-h-[60dvh] flex items-center justify-center px-4 sm:px-6 py-14 sm:py-20"
    >
      <div className="max-w-3xl w-full">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-scene-statement">{t('sceneFounder.title')}</h2>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 border border-border/60 rounded-sm p-8 sm:p-10 bg-secondary/15"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-primary/30 overflow-hidden shrink-0 shadow-lg shadow-primary/5">
            <img
              src="/founder.png"
              alt="Founder"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <ul className="space-y-2 mb-6">
              {Array.isArray(bio) && bio.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-foreground/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="border-t border-border/40 pt-4">
              <p className="text-sm text-muted-foreground italic">
                {t('sceneFounder.directLine')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
