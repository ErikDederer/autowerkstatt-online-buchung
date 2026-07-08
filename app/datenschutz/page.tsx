import type { Metadata } from "next";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten bei ${siteConfig.business.name}.`,
};

export default function DatenschutzPage() {
  const { legal } = siteConfig;
  const { name, legalName, email } = siteConfig.business;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Datenschutzerklärung
          </h1>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="text-base font-semibold">1. Verantwortlicher</h2>
              <p className="mt-2">
                Verantwortlich für die Datenverarbeitung auf dieser Website im
                Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
              </p>
              <p className="mt-2">
                {legalName || name}
                <br />
                {legal.street}
                <br />
                {legal.zipCity}
                <br />
                E-Mail: <a href={`mailto:${email}`}>{email}</a>
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">
                2. Erhebung und Speicherung personenbezogener Daten
              </h2>
              <p className="mt-2">
                Beim Aufruf dieser Website erhebt unser Hosting-Anbieter
                automatisch technische Zugriffsdaten (sogenannte Server-Log-Files),
                darunter IP-Adresse, Datum und Uhrzeit der Anfrage,
                Browsertyp und -version sowie das verwendete Betriebssystem.
                Diese Daten sind technisch notwendig, um die Website
                auszuliefern und die Betriebssicherheit zu gewährleisten
                (Art. 6 Abs. 1 lit. f DSGVO), und werden nicht mit anderen
                Datenquellen zusammengeführt.
              </p>
              <p className="mt-2">
                Diese Website verwendet keine Analyse- oder
                Marketing-Cookies und keine Tracking-Dienste Dritter. Es
                werden daher keine technisch nicht notwendigen Cookies
                gesetzt und kein Cookie-Banner eingeblendet.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">3. Kontaktformular</h2>
              <p className="mt-2">
                Wenn Sie uns über das Kontaktformular eine Anfrage senden,
                werden die von Ihnen angegebenen Daten (Name, E-Mail-Adresse,
                optional Telefonnummer, sowie Ihre Nachricht) zum Zweck der
                Bearbeitung Ihrer Anfrage und für den Fall von
                Anschlussfragen bei uns gespeichert. Die Verarbeitung erfolgt
                auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a
                DSGVO), die Sie durch Absenden des Formulars erteilen und
                jederzeit mit Wirkung für die Zukunft per E-Mail widerrufen
                können.
              </p>
              <p className="mt-2">
                Dieses Projekt ist eine Konzept-Website ohne angebundenes
                Backend: Anfragen über das Formular werden aktuell nicht
                dauerhaft gespeichert oder an Dritte übermittelt.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">4. Online-Terminbuchung</h2>
              <p className="mt-2">
                Über den Buchungsassistenten unter „Termin buchen“ erheben
                wir die von Ihnen angegebenen Daten (Name, E-Mail-Adresse,
                Telefonnummer sowie die gewählte Leistung, Datum und
                Uhrzeit) zum Zweck der Terminvereinbarung und -bestätigung.
                Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung
                (Art. 6 Abs. 1 lit. a DSGVO).
              </p>
              <p className="mt-2">
                Dieses Projekt ist eine Konzept-Website ohne angebundenes
                Backend: Terminanfragen werden aktuell nicht dauerhaft
                gespeichert oder an Dritte übermittelt. Der optional
                herunterladbare Kalendereintrag (.ics-Datei) wird
                ausschließlich lokal in Ihrem Browser erzeugt.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">5. Weitergabe von Daten</h2>
              <p className="mt-2">
                Eine Übermittlung Ihrer personenbezogenen Daten an Dritte
                findet nicht statt, es sei denn, wir sind gesetzlich dazu
                verpflichtet oder Sie haben zuvor ausdrücklich eingewilligt.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">6. Ihre Rechte</h2>
              <p className="mt-2">Sie haben jederzeit das Recht auf:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
              <p className="mt-2">
                Zudem haben Sie das Recht, sich bei einer
                Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
                personenbezogenen Daten durch uns zu beschweren.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">7. SSL-/TLS-Verschlüsselung</h2>
              <p className="mt-2">
                Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-
                Verschlüsselung zur Übertragung vertraulicher Inhalte, wie
                zum Beispiel Anfragen über das Kontaktformular. Eine
                verschlüsselte Verbindung erkennen Sie am Präfix{" "}
                <code>https://</code> in der Adresszeile Ihres Browsers.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">
                8. Aktualität und Änderung dieser Datenschutzerklärung
              </h2>
              <p className="mt-2">
                Diese Datenschutzerklärung ist aktuell gültig. Durch die
                Weiterentwicklung der Website oder aufgrund geänderter
                gesetzlicher Vorgaben kann es notwendig werden, diese
                Datenschutzerklärung zu ändern.
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
