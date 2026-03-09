import { useMemo, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const CONSENT_KEY = "cookie_consent";

export const CookieConsentBanner = () => {
  const { language } = useLanguage();
  const [consent, setConsent] = useState(() => {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (_err) {
      return null;
    }
  });

  const copy = useMemo(() => {
    const dict = {
      de: {
        text:
          "Wir verwenden Analyse-Cookies, um die Website für B2B-Nutzer zu verbessern.",
        accept: "Akzeptieren",
        decline: "Ablehnen",
      },
      ru: {
        text:
          "Мы используем аналитические cookie, чтобы улучшать сайт для B2B-клиентов.",
        accept: "Принять",
        decline: "Отклонить",
      },
      uk: {
        text:
          "Ми використовуємо аналітичні cookie, щоб покращувати сайт для B2B-клієнтів.",
        accept: "Прийняти",
        decline: "Відхилити",
      },
      en: {
        text:
          "We use analytics cookies to improve the website for B2B visitors.",
        accept: "Accept",
        decline: "Decline",
      },
    };
    return dict[language] || dict.en;
  }, [language]);

  const handleConsent = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (_err) {
      // noop
    }
    setConsent(value);
    if (value === "accepted" && typeof window !== "undefined") {
      window.initPosthog?.();
    }
  };

  if (consent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90]">
      <div className="mx-auto max-w-3xl rounded-sm border border-border bg-background/95 backdrop-blur-sm p-4">
        <p className="text-xs text-muted-foreground mb-3">{copy.text}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleConsent("declined")}
            className="px-3 py-1.5 text-xs border border-border rounded-sm text-muted-foreground hover:text-foreground"
          >
            {copy.decline}
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="px-3 py-1.5 text-xs rounded-sm bg-primary text-primary-foreground hover:opacity-90"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
};
