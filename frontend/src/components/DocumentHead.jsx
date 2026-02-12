import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Updates document title and meta description when language changes.
 * Ensures SEO consistency across language switches.
 */
export const DocumentHead = () => {
  const { language } = useTranslation();

  useEffect(() => {
    const baseTitle = 'Corex Digital – Web Development & System Engineering | Germany';
    const baseDescription = 'Corex Digital develops scalable digital infrastructure, automation, and full-stack solutions for startups and B2B teams in Germany. Turn chaos into a working system.';
    
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
