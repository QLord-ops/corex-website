import { translations } from './translations';

// Get language from localStorage or browser, default to English
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('corex-language');
  if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
    return savedLang;
  }
  
  // Detect browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('de')) {
    return 'de';
  }
  
  return 'en';
};

// Create i18n context
class I18n {
  constructor() {
    this.currentLanguage = getInitialLanguage();
    this.translations = translations;
  }
  
  setLanguage(lang) {
    if (lang === 'en' || lang === 'de') {
      this.currentLanguage = lang;
      localStorage.setItem('corex-language', lang);
      // Trigger custom event for components to update
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }
  
  getLanguage() {
    return this.currentLanguage;
  }
  
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${this.currentLanguage}"`);
        return key;
      }
    }
    
    return value;
  }
  
  // Get nested translation (for arrays/objects)
  getNested(key) {
    return this.t(key);
  }
  
  // Get all translations for a section
  getSection(section) {
    return this.translations[this.currentLanguage][section] || {};
  }
}

export const i18n = new I18n();
export default i18n;
