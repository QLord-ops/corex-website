import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { ScrollExperience } from "./components/ScrollExperience";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import ConsultationPage from "./pages/ConsultationPage";
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";

const MetadataUpdater = () => {
  const { t, language, supportedLanguages } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const title = t("meta.title");
    const description = t("meta.description");
    const keywords = t("meta.keywords");
    const baseUrl = process.env.REACT_APP_SITE_URL || "http://localhost:3000";
    const canonicalUrl = `${baseUrl}${location.pathname}`;

    document.title = title;

    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag('meta[name="description"]', "name", "description", description);
    setMetaTag('meta[name="keywords"]', "name", "keywords", keywords);
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    document.head
      .querySelectorAll('link[rel="alternate"][data-hreflang="true"]')
      .forEach((node) => node.remove());

    supportedLanguages.forEach((langCode) => {
      const altLink = document.createElement("link");
      altLink.setAttribute("rel", "alternate");
      altLink.setAttribute("hreflang", langCode);
      altLink.setAttribute("href", `${baseUrl}/${langCode}`);
      altLink.setAttribute("data-hreflang", "true");
      document.head.appendChild(altLink);
    });

    const xDefault = document.createElement("link");
    xDefault.setAttribute("rel", "alternate");
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.setAttribute("href", `${baseUrl}/de`);
    xDefault.setAttribute("data-hreflang", "true");
    document.head.appendChild(xDefault);

    let jsonLdNode = document.head.querySelector(
      'script[type="application/ld+json"][data-org-schema="true"]',
    );
    if (!jsonLdNode) {
      jsonLdNode = document.createElement("script");
      jsonLdNode.type = "application/ld+json";
      jsonLdNode.setAttribute("data-org-schema", "true");
      document.head.appendChild(jsonLdNode);
    }
    jsonLdNode.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "AIONEX",
      url: baseUrl,
      areaServed: "DE",
      serviceType: "Digital Systems and Automation",
      inLanguage: [language],
      description,
    });

    let faqJsonLdNode = document.head.querySelector(
      'script[type="application/ld+json"][data-faq-schema="true"]',
    );
    if (!faqJsonLdNode) {
      faqJsonLdNode = document.createElement("script");
      faqJsonLdNode.type = "application/ld+json";
      faqJsonLdNode.setAttribute("data-faq-schema", "true");
      document.head.appendChild(faqJsonLdNode);
    }
    faqJsonLdNode.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [0, 1, 2, 3].map((idx) => ({
        "@type": "Question",
        name: t(`sceneFaq.items.${idx}.q`),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(`sceneFaq.items.${idx}.a`),
        },
      })),
    });
  }, [language, location.pathname, supportedLanguages, t]);

  return null;
};

const LocaleLayout = ({ children }) => {
  const { locale } = useParams();
  const { setLanguage, supportedLanguages } = useLanguage();

  useEffect(() => {
    if (locale && supportedLanguages.includes(locale)) {
      setLanguage(locale);
    }
  }, [locale, setLanguage, supportedLanguages]);

  if (!locale || !supportedLanguages.includes(locale)) {
    return <Navigate to="/de" replace />;
  }

  return children;
};

const LandingPage = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <ScrollExperience />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <MetadataUpdater />
        <CookieConsentBanner />
        <Routes>
          <Route path="/" element={<Navigate to="/de" replace />} />
          <Route
            path="/consultation"
            element={<Navigate to="/de/consultation" replace />}
          />
          <Route
            path="/impressum"
            element={<Navigate to="/de/impressum" replace />}
          />
          <Route
            path="/datenschutz"
            element={<Navigate to="/de/datenschutz" replace />}
          />
          <Route
            path="/:locale"
            element={
              <LocaleLayout>
                <LandingPage />
              </LocaleLayout>
            }
          />
          <Route
            path="/:locale/consultation"
            element={
              <LocaleLayout>
                <ConsultationPage />
              </LocaleLayout>
            }
          />
          <Route
            path="/:locale/impressum"
            element={
              <LocaleLayout>
                <ImpressumPage />
              </LocaleLayout>
            }
          />
          <Route
            path="/:locale/datenschutz"
            element={
              <LocaleLayout>
                <DatenschutzPage />
              </LocaleLayout>
            }
          />
          <Route path="*" element={<Navigate to="/de" replace />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
