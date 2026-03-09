/**
 * Страница консультации с ботом
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConsultationBot } from '@/components/consultation/ConsultationBot';
import { FixedQuoteFlow } from '@/components/consultation/FixedQuoteFlow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/i18n/LanguageContext';

export default function ConsultationPage() {
  const { language } = useLanguage();
  const [flowType, setFlowType] = useState(() => {
    // Check URL params for flow type
    const params = new URLSearchParams(window.location.search);
    return params.get('flow') === 'fixed' ? 'fixed' : 'full';
  });

  // Listen for custom event to switch to fixed quote tab
  useEffect(() => {
    const handleSwitchToFixedQuote = () => {
      setFlowType('fixed');
    };

    window.addEventListener('switchToFixedQuote', handleSwitchToFixedQuote);
    return () => {
      window.removeEventListener('switchToFixedQuote', handleSwitchToFixedQuote);
    };
  }, []);

  const handlePackageSelected = () => {};

  const handleError = () => {};

  const handleFixedQuoteComplete = () => {};

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Angebot für Ihr Unternehmen</h1>
          <p className="text-muted-foreground">
            Wählen Sie den Weg: vollständige Analyse oder schneller Festpreis.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Wir antworten in der Regel innerhalb von 24 Stunden.
          </p>
        </div>

        <Tabs value={flowType} onValueChange={setFlowType} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-auto">
            <TabsTrigger value="full">Analyse + Empfehlung</TabsTrigger>
            <TabsTrigger value="fixed">Festpreis in 2 Schritten</TabsTrigger>
          </TabsList>

          <TabsContent value="full" className="mt-8">
            <ConsultationBot
              apiBaseUrl={process.env.REACT_APP_BOT_API_URL}
              defaultLanguage="de"
              onPackageSelected={handlePackageSelected}
              onError={handleError}
            />
          </TabsContent>

          <TabsContent value="fixed" className="mt-8">
            <FixedQuoteFlow
              apiBaseUrl={process.env.REACT_APP_BOT_API_URL}
              defaultLanguage="de"
              onComplete={handleFixedQuoteComplete}
              onError={handleError}
            />
          </TabsContent>
        </Tabs>
        <div className="text-center mt-8 space-x-4 text-xs text-muted-foreground">
          <Link to={`/${language}/impressum`} className="underline">
            Impressum
          </Link>
          <Link to={`/${language}/datenschutz`} className="underline">
            Datenschutz
          </Link>
        </div>
      </div>
    </div>
  );
}
