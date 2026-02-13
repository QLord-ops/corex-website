import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from '@/i18n/translations';

export const SceneAbout = () => {
  const { language } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  const about = translations[language]?.about || {};
  const title = about.title ?? 'About AIONEX';
  const subtitle = about.subtitle ?? 'We turn chaos into systems that work.';
  const paragraph1 = about.paragraph1 ?? '';
  const paragraph2 = about.paragraph2 ?? '';
  const contactLabel = about.contact ?? 'Contact';
  const emailLabel = about.email ?? 'Email';
  const addressLabel = about.address ?? 'Address';
  const addressPlaceholder = about.addressPlaceholder ?? 'Your city, country';

  return (
    <section
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 py-12"
    >
      <div className="max-w-3xl w-full">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-scene-statement mb-4">{title}</h2>
          <p className="text-scene-body text-foreground/80 mb-6">
            {subtitle}
          </p>
          <p className="text-scene-small text-muted-foreground mb-6 text-left">
            {paragraph1}
          </p>
          <p className="text-scene-small text-muted-foreground mb-10 text-left">
            {paragraph2}
          </p>
          <motion.div
            className="border-t border-border pt-8 text-left"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {contactLabel}
            </p>
            <p className="text-scene-small text-foreground/90">
              {emailLabel}: <a href="mailto:corexdigital.info@gmail.com" className="hover:text-primary transition-colors underline">corexdigital.info@gmail.com</a>
            </p>
            <p className="text-scene-small text-foreground/90 mt-1">
              {addressLabel}: {addressPlaceholder}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
