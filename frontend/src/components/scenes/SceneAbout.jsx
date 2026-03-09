import { useLanguage } from '@/i18n/LanguageContext';
import { AnimatedText } from '../effects/AnimatedText';

export const SceneAbout = () => {
  const { t } = useLanguage();
  const whyItems = [0, 1, 2, 3];
  const industries = [0, 1, 2, 3, 4];
  const technologies = [0, 1, 2, 3, 4, 5];
  const processSteps = [0, 1, 2, 3, 4];
  const supportItems = [0, 1, 2, 3];
  const supportModels = [0, 1, 2];

  return (
    <section className="min-h-[90dvh] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-5xl w-full space-y-12">
        <AnimatedText className="text-center">
          <h2 className="text-scene-statement mb-4">{t('sceneTrust.title')}</h2>
          <p className="text-scene-body text-muted-foreground max-w-3xl mx-auto">
            {t('sceneTrust.description')}
          </p>
        </AnimatedText>

        <div className="border border-border/60 bg-secondary/20 rounded-sm p-5">
          <p className="text-sm text-muted-foreground text-center">
            {t('sceneTrust.note')}
          </p>
        </div>

        <div>
          <h3 className="text-scene-body text-foreground/85 mb-6">{t('sceneWhy.title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {whyItems.map((idx) => (
              <div key={idx} className="border border-border/60 bg-secondary/20 rounded-sm p-4">
                <p className="text-sm text-foreground">{t(`sceneWhy.items.${idx}`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-scene-body text-foreground/85 mb-6">{t('sceneProjectTransparency.title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="border border-border/60 bg-secondary/20 rounded-sm p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t('sceneProjectTransparency.sizeLabel')}
              </p>
              <p className="text-base text-foreground">{t('sceneProjectTransparency.sizeValue')}</p>
            </div>
            <div className="border border-border/60 bg-secondary/20 rounded-sm p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t('sceneProjectTransparency.durationLabel')}
              </p>
              <p className="text-base text-foreground">{t('sceneProjectTransparency.durationValue')}</p>
            </div>
            <div className="border border-border/60 bg-secondary/20 rounded-sm p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t('sceneProjectTransparency.teamLabel')}
              </p>
              <p className="text-base text-foreground">{t('sceneProjectTransparency.teamValue')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-scene-body text-foreground/85 mb-4">{t('sceneIndustries.title')}</h3>
            <div className="flex flex-wrap gap-2">
              {industries.map((idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-2 border border-border/60 rounded-sm text-muted-foreground"
                >
                  {t(`sceneIndustries.items.${idx}`)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-scene-body text-foreground/85 mb-4">{t('sceneTech.title')}</h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-2 border border-border/60 rounded-sm text-muted-foreground"
                >
                  {t(`sceneTech.items.${idx}`)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-scene-body text-foreground/85 mb-6">{t('sceneProcess.title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {processSteps.map((idx) => (
              <div key={idx} className="border border-border/60 bg-secondary/20 rounded-sm p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">{idx + 1}</p>
                <p className="text-sm text-foreground">{t(`sceneProcess.steps.${idx}`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-scene-body text-foreground/85 mb-6">{t('sceneSupport.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {supportItems.map((idx) => (
                <div key={idx} className="border border-border/60 bg-secondary/20 rounded-sm p-4">
                  <p className="text-sm text-foreground">{t(`sceneSupport.items.${idx}`)}</p>
                </div>
              ))}
            </div>
            <div className="border border-border/60 bg-secondary/20 rounded-sm p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                {t('sceneSupport.modelsTitle')}
              </p>
              <div className="space-y-2">
                {supportModels.map((idx) => (
                  <p key={idx} className="text-sm text-foreground">
                    {t(`sceneSupport.models.${idx}`)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
