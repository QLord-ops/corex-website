import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Updates document title and meta description when language changes.
 * Ensures SEO consistency across language switches.
 */
export const DocumentHead = () => {
  const { language } = useTranslation();

  useEffect(() => {
    const baseTitle = 'AIONEX – Digital Systems & Automation | Germany';
    const baseDescription = 'AIONEX Digital Systems & Automation develops and automates digital systems for startups and B2B teams in Germany. Turn chaos into a working system.';
    
    document.title = baseTitle;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', baseDescription);
    }
    
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) {
      metaTitle.setAttribute('content', baseTitle);
    }
  }, [language]);

  return null;
};
