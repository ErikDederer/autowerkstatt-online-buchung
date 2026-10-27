import type { Metadata } from "next";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { Phone } from "lucide-react";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { siteConfig } from "@/lib/site-config";
import { getSiteCatalog } from "@/lib/werkplan/catalog";

// The catalog is cached for 5 minutes; free slots are always fetched live.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Termin online buchen",
  description: `Buchen Sie in wenigen Schritten Ihren Werkstatttermin bei ${siteConfig.business.name} in Braunschweig – Leistung wählen, Termin wählen, fertig.`,
};

export default async function TerminPage() {
  const catalog = await getSiteCatalog();
  const { phone, phoneDisplay } = siteConfig.business;

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
              {catalog.bookingMode === "instant"
                ? "In drei Schritten zum festen Termin — live aus unserem Werkstattkalender."
                : "In drei Schritten zum angefragten Termin — ganz ohne Anruf."}
            </p>
          </div>

          <div className="mt-10">
            {catalog.live ? (
              <BookingWizard services={catalog.services} bookingMode={catalog.bookingMode} />
            ) : (
              <div role="status" className="rounded-2xl border bg-card p-8 text-center">
                <p className="font-heading text-lg font-semibold">
                  Die Online-Buchung ist gerade nicht erreichbar.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bitte versuchen Sie es in ein paar Minuten erneut oder rufen Sie uns an.
                </p>
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="mt-4 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {phoneDisplay}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
