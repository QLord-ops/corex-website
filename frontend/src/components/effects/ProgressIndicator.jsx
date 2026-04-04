import { motion, useTransform } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const SECTION_IDS = ['explore', 'pain', 'how', 'about', 'cases', 'proof', 'faq', 'decision', 'contact'];

export const ProgressIndicator = ({ progress, currentScene }) => {
  const progressHeight = useTransform(progress, [0, 1], ['0%', '100%']);
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);
  const { t } = useLanguage();
  const sceneLabels = [
    t('progress.entry'),
    t('progress.pain'),
    t('progress.how'),
    t('progress.about'),
    t('progress.cases'),
    t('progress.proof'),
    t('progress.faq'),
    t('progress.decision'),
    t('progress.action'),
  ];

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  return (
    <>
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] bg-gradient-to-t from-background/95 via-background/80 to-transparent pointer-events-none"
      aria-label="Page sections"
    >
      <div className="pointer-events-auto max-w-lg mx-auto">
        <div className="h-1 rounded-full bg-border/70 overflow-hidden mb-2">
          <motion.div className="h-full bg-primary rounded-full" style={{ width: progressWidth }} />
        </div>
        <div className="flex gap-1 justify-stretch">
          {SECTION_IDS.map((id, index) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className={`flex-1 min-h-[6px] min-w-0 rounded-sm transition-colors duration-300 ${
                currentScene === index ? 'bg-primary' : currentScene > index ? 'bg-primary/35' : 'bg-muted/40'
              }`}
              aria-label={sceneLabels[index]}
            />
          ))}
        </div>
      </div>
    </div>

    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-4" aria-label="Page sections">
      {/* Progress line */}
      <div className="absolute right-2 top-0 h-full w-px bg-border">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-primary"
          style={{ height: progressHeight }}
        />
      </div>
      
      {/* Scene indicators - clickable */}
      {sceneLabels.map((label, index) => (
        <motion.div
          key={`${index}-${label}`}
          className="flex items-center gap-3 relative z-10"
          initial={{ opacity: 0.4 }}
          animate={{ 
            opacity: currentScene >= index ? 1 : 0.4,
          }}
          transition={{ duration: 0.6 }}
        >
          <button
            type="button"
            onClick={() => scrollToSection(SECTION_IDS[index])}
            className={`text-xs uppercase tracking-widest transition-colors duration-300 text-left hover:opacity-100 ${
              currentScene === index ? 'text-primary' : 'text-muted-foreground'
            }`}
            aria-label={label}
          >
            {label}
          </button>
          <motion.div 
            className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-600 ${
              currentScene >= index ? 'bg-primary' : 'bg-muted'
            }`}
            animate={{
              scale: currentScene === index ? 1.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </div>
    </>
  );
};
