import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from '@/i18n/translations';

export const SceneFAQ = () => {
  const { t, language } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  
  // Get FAQ items directly from translations
  const faqItems = translations[language]?.faq?.items || [];
  
  return (
    <section ref={sectionRef} className="min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-3xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-scene-statement mb-4">{t('faq.title')}</h2>
          <p className="text-scene-small text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export const SceneFaq = SceneFAQ;
