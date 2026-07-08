import type { Metadata } from "next";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung gemäß § 5 TMG von ${siteConfig.business.name}.`,
};

export default function ImpressumPage() {
  const { legal } = siteConfig;
  const { name, legalName, phone, phoneDisplay, email } = siteConfig.business;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Impressum
          </h1>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="text-base font-semibold">Angaben gemäß § 5 TMG</h2>
              <p className="mt-2">
                {legalName || name}
                <br />
                {legal.street}
                <br />
                {legal.zipCity}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">Vertreten durch</h2>
              <p className="mt-2">{legal.representative}</p>
            </section>

            <section>
              <h2 className="text-base font-semibold">Kontakt</h2>
              <p className="mt-2">
                Telefon: {phone ? <a href={`tel:${phone}`}>{phoneDisplay}</a> : phoneDisplay}
                <br />
                E-Mail: <a href={`mailto:${email}`}>{email}</a>
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">Registereintrag</h2>
              <p className="mt-2">
                Eintragung im Handelsregister.
                <br />
                Registergericht: {legal.registerCourt}
                <br />
                Registernummer: {legal.registerNumber}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">Umsatzsteuer-ID</h2>
              <p className="mt-2">
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
                <br />
                {legal.vatId}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p className="mt-2">
                {legal.responsibleForContent}
                <br />
                {legal.street}
                <br />
                {legal.zipCity}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">EU-Streitschlichtung</h2>
              <p className="mt-2">
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  className="underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                <br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </h2>
              <p className="mt-2">
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <p className="text-xs text-muted-foreground">
              Hinweis: Dies ist ein Konzeptprojekt. Die mit [ ] gekennzeichneten
              Angaben sind Platzhalter und werden vor einem echten Launch durch
              reale Daten ersetzt.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
