import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import i18n from '@/i18n/i18n';

/**
 * Updates document title and meta description when language changes.
 */
export const DocumentHead = () => {
  const { language } = useTranslation();

  useEffect(() => {
    const title = i18n.t('seo.title');
    const description = i18n.t('seo.description');
    document.title = title;
    const metaDesc = document.querySelector('#meta-description') || document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
  }, [language]);

  return null;
};
