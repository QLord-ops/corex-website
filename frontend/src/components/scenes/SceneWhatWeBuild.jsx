import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const ICONS = [
  <path key="chatbot" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  <><path key="auto1" d="M12 2v4" /><path key="auto2" d="M12 18v4" /><path key="auto3" d="M4.93 4.93l2.83 2.83" /><path key="auto4" d="M16.24 16.24l2.83 2.83" /><path key="auto5" d="M2 12h4" /><path key="auto6" d="M18 12h4" /><path key="auto7" d="M4.93 19.07l2.83-2.83" /><path key="auto8" d="M16.24 7.76l2.83-2.83" /></>,
  <><path key="crm1" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle key="crm2" cx="9" cy="7" r="4" /><path key="crm3" d="M22 21v-2a4 4 0 0 0-3-3.87" /><path key="crm4" d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  <><rect key="portal1" x="2" y="3" width="20" height="14" rx="2" /><path key="portal2" d="M8 21h8" /><path key="portal3" d="M12 17v4" /></>,
  <><path key="app1" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path key="app2" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  <><circle key="int1" cx="12" cy="12" r="3" /><path key="int2" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
];

export const SceneWhatWeBuild = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const items = t('sceneWhatWeBuild.items') || [];

  return (
    <section
      ref={sectionRef}
      className="min-h-[80dvh] flex items-center justify-center px-4 sm:px-6 py-14 sm:py-20"
    >
      <div className="max-w-5xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-scene-statement">{t('sceneWhatWeBuild.title')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.isArray(items) && items.map((item, idx) => (
            <motion.div
              key={idx}
              className="border border-border/60 rounded-sm p-6 bg-secondary/15 hover:bg-secondary/25 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  {ICONS[idx]}
                </svg>
              </div>
              <h3 className="text-base font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
