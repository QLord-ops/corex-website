import { createContext, useContext, useMemo, useState, useEffect } from "react";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  translations,
} from "./translations";

const STORAGE_KEY = "site_language";

const LanguageContext = createContext(null);

const getByPath = (obj, path) => {
  if (!path) return obj;
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const detectLanguage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
  } catch (_err) {
    // noop
  }

  const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }
  return "en";
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(detectLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (_err) {
      // noop
    }
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const current = translations[language] || translations.en;
    const fallback = translations.en;

    const t = (path) => {
      const localizedValue = getByPath(current, path);
      if (localizedValue !== undefined) return localizedValue;
      return getByPath(fallback, path);
    };

    return {
      language,
      setLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      languageLabels: LANGUAGE_LABELS,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
