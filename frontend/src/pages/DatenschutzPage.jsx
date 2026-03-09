import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

export default function DatenschutzPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-semibold">Datenschutz</h1>

        <section className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Verantwortliche Stelle</h2>
          <p>
            AIONEX Digital Systems &amp; Automation
            <br />
            Yevhenii Stolovoi
            <br />
            Himmelsruh 14, 37085 Göttingen, Deutschland
            <br />
            E-Mail: aionex.info@gmail.com
            <br />
            Telefon: +49 162 2674557
          </p>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Zweck und Rechtsgrundlage</h2>
          <p>
            Wir verarbeiten personenbezogene Daten zur Bearbeitung von Kontaktanfragen und für die
            Geschäftskommunikation.
          </p>
          <p>
            Rechtsgrundlage: Einwilligung und berechtigtes Interesse nach DSGVO.
          </p>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Hosting</h2>
          <p>
            Diese Website wird bei folgendem Anbieter gehostet:
            <br />
            Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland.
          </p>
          <p>
            Der Hostinganbieter speichert automatisch Server-Logfiles (z. B. IP-Adresse, Datum und
            Uhrzeit der Anfrage, Browsertyp, Betriebssystem, Referrer-URL). Diese Daten dienen
            ausschließlich der technischen Bereitstellung und Sicherheit der Website.
          </p>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Analyse-Tools</h2>
          <p>
            Für statistische Auswertungen nutzen wir PostHog, sofern Sie der Nutzung von
            Analyse-Cookies zugestimmt haben.
          </p>
          <p>Weitere Tracking-Tools wie Google Analytics, Meta Pixel oder Hotjar werden nicht verwendet.</p>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Kommunikation</h2>
          <p>
            Kontaktanfragen werden per E-Mail bearbeitet. Als E-Mail-Dienst wird Google Mail
            eingesetzt.
          </p>
          <p>
            Ein Auftragsverarbeitungsvertrag (AVV) kann auf Anfrage abgeschlossen werden.
          </p>
        </section>

        <section className="space-y-3 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Ihre Rechte</h2>
          <p>
            Sie haben nach DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
            Verarbeitung, Datenübertragbarkeit und Widerspruch.
          </p>
          <p>Für Datenschutzanfragen kontaktieren Sie uns unter: aionex.info@gmail.com</p>
        </section>

        <Link
          to={`/${language}`}
          className="inline-block text-sm underline text-muted-foreground hover:text-foreground"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
