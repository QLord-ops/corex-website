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
      <div className="max-w-6xl w-full">
        <AnimatedText className="text-center mb-10">
          <h2 className="text-scene-statement">{t('sceneCases.title')}</h2>
        </AnimatedText>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {[0, 1, 2].map((idx) => {
            const metrics = t(`sceneCases.items.${idx}.metrics`) || [];
            const techStack = t(`sceneCases.items.${idx}.techStack`) || [];

            return (
              <article key={idx} className="border border-border/60 rounded-sm bg-secondary/15 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t(`sceneCases.items.${idx}.industry`)}
                    </p>
                    <div className="w-9 h-9 rounded-full border border-border/60 bg-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                      {getInitials(t(`sceneCases.items.${idx}.client`))}
                    </div>
                  </div>

                  <h3 className="text-base font-medium mb-3">
                    {t(`sceneCases.items.${idx}.title`)}
                  </h3>

                  {/* Challenge / Solution / Result */}
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
                  <p className="text-sm text-foreground mb-4">
                    {t(`sceneCases.items.${idx}.result`)}
                  </p>

                  {/* Impact metrics */}
                  {Array.isArray(metrics) && metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {metrics.map((m, i) => (
                        <span key={i} className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-sm">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta: tech stack, duration, team */}
                  <div className="border-t border-border/40 pt-3 space-y-1.5">
                    {Array.isArray(techStack) && techStack.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground/70 shrink-0 w-16">
                          {t('sceneCases.labels.techStack')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {techStack.join(' · ')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground/70 shrink-0 w-16">
                        {t('sceneCases.labels.duration')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t(`sceneCases.items.${idx}.duration`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground/70 shrink-0 w-16">
                        {t('sceneCases.labels.teamSize')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t(`sceneCases.items.${idx}.teamSize`)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
