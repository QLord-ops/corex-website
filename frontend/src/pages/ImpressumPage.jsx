import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ImpressumPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-semibold">Angaben gemäß § 5 TMG</h1>

        <section className="space-y-2 text-sm text-muted-foreground">
          <p className="text-foreground font-medium">AIONEX Digital Systems &amp; Automation</p>
          <p>Einzelunternehmen</p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Vertreten durch</h2>
          <p>Yevhenii Stolovoi</p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Adresse</h2>
          <p>Himmelsruh 14</p>
          <p>37085 Göttingen</p>
          <p>Deutschland</p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Kontakt</h2>
          <p>Telefon: +49 162 2674557</p>
          <p>E-Mail: aionex.info@gmail.com</p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
          <p>Keine USt-IdNr vorhanden.</p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-base text-foreground font-medium">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p>Yevhenii Stolovoi</p>
          <p>Himmelsruh 14</p>
          <p>37085 Göttingen</p>
          <p>Deutschland</p>
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
