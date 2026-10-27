import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/blocks/contact-form";
import { OpeningHoursTable } from "@/components/blocks/opening-hours-table";
import { siteConfig, type OpeningHoursRow } from "@/lib/site-config";

export type ContactSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  openingHours?: OpeningHoursRow[];
};

export function ContactSection({
  id = "kontakt",
  eyebrow = "Kontakt",
  title = "Lassen Sie uns über Ihr Projekt sprechen",
  text = "Füllen Sie das Formular aus oder rufen Sie uns direkt an — wir melden uns in der Regel innerhalb eines Werktags.",
  openingHours,
}: ContactSectionProps) {
  const { phone, phoneDisplay, email, address } = siteConfig.business;

  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">{text}</p>

          <ul className="mt-8 space-y-4 text-sm">
            {phone && (
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`tel:${phone}`} className="hover:underline">
                  {phoneDisplay}
                </a>
              </li>
            )}
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {address.street}
                <br />
                {address.zip} {address.city}
              </span>
            </li>
          </ul>

          <OpeningHoursTable className="mt-10" rows={openingHours} />
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8 lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
