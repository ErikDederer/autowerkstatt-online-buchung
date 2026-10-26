"use client";

import { CalendarDays, CheckCircle2, Clock, Download, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildIcsContent, downloadIcsFile } from "@/lib/booking/ics";
import { formatFullDateLabel } from "@/lib/booking/slots";
import { siteConfig, type Service } from "@/lib/site-config";
import type { BookingContactValues } from "@/lib/validations/booking";
import type { BookingConfirmation, ChosenSlot } from "@/components/booking/booking-wizard";

export type StepConfirmationProps = {
  service: Service;
  slot: ChosenSlot;
  contact: BookingContactValues;
  confirmation: BookingConfirmation;
  onReset: () => void;
};

export function StepConfirmation({
  service,
  slot,
  contact,
  confirmation,
  onReset,
}: StepConfirmationProps) {
  const booked = confirmation.status === "booked";

  const handleDownload = () => {
    const { street, zip, city } = siteConfig.business.address;

    const content = buildIcsContent({
      title: `${service.title} – ${siteConfig.business.name}`,
      description: [
        `Termin für ${service.title} bei ${siteConfig.business.name}.`,
        `Fahrzeug: ${contact.vehicleMake} ${contact.vehicleModel}, ${contact.mileageKm} km`,
        contact.notes ? `Anmerkung: ${contact.notes}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      location: `${street}, ${zip} ${city}`,
      start: new Date(confirmation.startsAt),
      end: new Date(confirmation.endsAt),
    });

    downloadIcsFile(`termin-${slot.date}-${slot.time.replace(":", "")}.ics`, content);
  };

  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </div>

      <h2 className="mt-5 font-heading text-2xl font-semibold uppercase tracking-wide">
        {booked ? "Termin gebucht!" : "Termin angefragt!"}
      </h2>
      <p className="mt-2 text-pretty text-sm text-muted-foreground">
        {booked
          ? `Vielen Dank, ${contact.name.split(" ")[0]}. Ihr Termin ist fest eingeplant — wir freuen uns auf Sie und Ihren ${contact.vehicleMake}.`
          : `Vielen Dank, ${contact.name.split(" ")[0]}. Wir bestätigen Ihren Termin in Kürze telefonisch oder per E-Mail an ${contact.email}.`}
      </p>

      <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl border bg-secondary/40 p-4 text-left text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{service.title}</span>
          <span className="font-mono text-primary">{service.priceLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {formatFullDateLabel(slot.date)}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
          <Clock className="size-3.5" aria-hidden="true" />
          {slot.time} Uhr
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-2 text-muted-foreground">
          <span>
            {contact.vehicleMake} {contact.vehicleModel}
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <Gauge className="size-3.5" aria-hidden="true" />
            {Number(contact.mileageKm).toLocaleString("de-DE")} km
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" className="w-full gap-2 sm:w-auto" onClick={handleDownload}>
          <Download className="size-4" aria-hidden="true" />
          Kalendereintrag herunterladen
        </Button>
        <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={onReset}>
          Weiteren Termin buchen
        </Button>
      </div>
    </div>
  );
}
