import { useLanguage } from '@/i18n/LanguageContext';
import { AnimatedText } from '../effects/AnimatedText';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export const SceneFaq = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-[70dvh] sm:min-h-[85dvh] flex items-center justify-center px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-4xl w-full">
        <AnimatedText className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground block mb-4">
            {t('sceneFaq.intro')}
          </span>
          <h2 className="text-scene-statement">{t('sceneFaq.title')}</h2>
        </AnimatedText>

        <Accordion type="single" collapsible className="border border-border/60 rounded-sm bg-secondary/10 px-3 sm:px-4">
          {[0, 1, 2, 3].map((idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-border/60">
              <AccordionTrigger className="text-sm">
                {t(`sceneFaq.items.${idx}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {t(`sceneFaq.items.${idx}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
