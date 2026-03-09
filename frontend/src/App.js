import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/leistungen" element={<MainSite />} />
        <Route path="/ueber-uns" element={<MainSite />} />
        <Route path="/kontakt" element={<MainSite />} />
        <Route path="/en" element={<MainSite />} />
        <Route path="/en/leistungen" element={<MainSite />} />
        <Route path="/en/ueber-uns" element={<MainSite />} />
        <Route path="/en/kontakt" element={<MainSite />} />
        <Route path="/builder" element={<BuilderDashboard />} />
        <Route path="/builder/sites/:siteId" element={<BuilderEditor />} />
        <Route path="/s/:slug" element={<ClientSiteView />} />
        <Route path="/consultation" element={<ConsultationRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
