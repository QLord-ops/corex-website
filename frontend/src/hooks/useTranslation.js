import { useState, useEffect } from 'react';
import i18n from '../i18n/i18n';

export const useTranslation = () => {
  const [language, setLanguageState] = useState(i18n.getLanguage());
  
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguageState(event.detail.lang);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);
  
  const t = (key) => {
    return i18n.t(key);
  };
  
  const setLanguage = (lang) => {
    i18n.setLanguage(lang);
    setLanguageState(lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };
  
  return {
    t,
    language,
    setLanguage
  };
};
