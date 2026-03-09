import { useLanguage } from '@/i18n/LanguageContext';
import { AnimatedText } from '../effects/AnimatedText';

export const SceneCases = () => {
  const { t } = useLanguage();
  const getInitials = (name) =>
    String(name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  return (
    <section className="min-h-[80dvh] sm:min-h-[90dvh] flex items-center justify-center px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-5xl w-full">
        <AnimatedText className="text-center mb-10">
          <h2 className="text-scene-statement">{t('sceneCases.title')}</h2>
        </AnimatedText>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {[0, 1, 2].map((idx) => (
            <article key={idx} className="border border-border/60 rounded-sm p-5 bg-secondary/15">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t(`sceneCases.items.${idx}.industry`)}
                </p>
                <div className="w-9 h-9 rounded-full border border-border/60 bg-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                  {getInitials(t(`sceneCases.items.${idx}.client`))}
                </div>
              </div>
              <h3 className="text-base font-medium mb-3">{t(`sceneCases.items.${idx}.title`)}</h3>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {t('sceneCases.labels.problem')}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {t(`sceneCases.items.${idx}.challenge`)}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {t('sceneCases.labels.solution')}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {t(`sceneCases.items.${idx}.solution`)}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {t('sceneCases.labels.result')}
              </p>
              <p className="text-sm text-foreground mb-2">{t(`sceneCases.items.${idx}.result`)}</p>
              <p className="text-xs text-primary/90 font-medium">
                {t(`sceneCases.items.${idx}.metric`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
