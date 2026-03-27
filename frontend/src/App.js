import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { DocumentHead } from "./components/DocumentHead";
import { ScrollExperience } from "./components/ScrollExperience";
import { BuilderDashboard } from "./pages/BuilderDashboard";
import { BuilderEditor } from "./pages/BuilderEditor";
import { ClientSiteView } from "./pages/ClientSiteView";
import { ConsultationFlow } from "./pages/ConsultationFlow";
import { ConsultationRedirect } from "./components/ConsultationRedirect";

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
          <Route path="/en/*" element={<MainSite />} />
          <Route path="/de" element={<MainSite />} />
          <Route path="/de/*" element={<MainSite />} />
          <Route path="/builder" element={<BuilderDashboard />} />
          <Route path="/builder/sites/:siteId" element={<BuilderEditor />} />
          <Route path="/s/:slug" element={<ClientSiteView />} />
          <Route path="/consultation" element={<ConsultationRedirect />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
