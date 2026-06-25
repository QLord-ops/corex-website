import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { DocumentHead } from "./components/DocumentHead";
import { ScrollExperience } from "./components/ScrollExperience";
import { ChatWidget } from "./components/ChatWidget";
import { BuilderDashboard } from "./pages/BuilderDashboard";
import { BuilderEditor } from "./pages/BuilderEditor";
import { ClientSiteView } from "./pages/ClientSiteView";
import { ConsultationFlow } from "./pages/ConsultationFlow";
import { ConsultationRedirect } from "./components/ConsultationRedirect";

const ImpressumPage = lazy(() => import("./pages/ImpressumPage"));
const DatenschutzPage = lazy(() => import("./pages/DatenschutzPage"));

function MainSite() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <DocumentHead />
      <main>
        <ScrollExperience />
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/en" element={<MainSite />} />
          <Route path="/de" element={<MainSite />} />
          <Route path="/en/impressum" element={<Suspense fallback={null}><ImpressumPage /></Suspense>} />
          <Route path="/de/impressum" element={<Suspense fallback={null}><ImpressumPage /></Suspense>} />
          <Route path="/en/datenschutz" element={<Suspense fallback={null}><DatenschutzPage /></Suspense>} />
          <Route path="/de/datenschutz" element={<Suspense fallback={null}><DatenschutzPage /></Suspense>} />
          <Route path="/impressum" element={<Suspense fallback={null}><ImpressumPage /></Suspense>} />
          <Route path="/datenschutz" element={<Suspense fallback={null}><DatenschutzPage /></Suspense>} />
          <Route path="/en/*" element={<MainSite />} />
          <Route path="/de/*" element={<MainSite />} />
          <Route path="/builder" element={<BuilderDashboard />} />
          <Route path="/builder/sites/:siteId" element={<BuilderEditor />} />
          <Route path="/s/:slug" element={<ClientSiteView />} />
          <Route path="/consultation" element={<ConsultationRedirect />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
