import type { Metadata } from "next";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Termin online buchen",
  description: `Buchen Sie in wenigen Schritten Ihren Werkstatttermin bei ${siteConfig.business.name} in Braunschweig – Leistung wählen, Termin wählen, fertig.`,
};

export default function TerminPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Terminbuchung
            </p>
            <h1 className="mt-2 text-balance font-heading text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
              Ihren Werkstatttermin buchen
            </h1>
            <p className="mt-3 text-pretty text-muted-foreground">
              In drei Schritten zum angefragten Termin — ganz ohne Anruf.
            </p>
          </div>

          <div className="mt-10">
            <BookingWizard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
