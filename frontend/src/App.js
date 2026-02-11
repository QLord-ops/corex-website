import { ScrollExperience } from "./components/ScrollExperience";
import { DocumentHead } from "./components/DocumentHead";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <DocumentHead />
      <ScrollExperience />
    </div>
  );
}

export default App;
