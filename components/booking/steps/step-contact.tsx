"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { WizardNav } from "@/components/booking/wizard-nav";
import { bookingContactSchema, type BookingContactValues } from "@/lib/validations/booking";
import { submitBookingRequest } from "@/lib/actions/booking";
import { formatFullDateLabel } from "@/lib/booking/slots";
import type { Service } from "@/lib/site-config";

export type StepContactProps = {
  service: Service;
  dateISO: string;
  time: string;
  onBack: () => void;
  onEditService: () => void;
  onEditDateTime: () => void;
  onSuccess: (values: BookingContactValues) => void;
};

const defaultValues: BookingContactValues = {
  name: "",
  email: "",
  phone: "",
  notes: "",
  consent: false,
  website: "",
};

export function StepContact({
  service,
  dateISO,
  time,
  onBack,
  onEditService,
  onEditDateTime,
  onSuccess,
}: StepContactProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookingContactValues>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues,
  });

  const onSubmit = async (values: BookingContactValues) => {
    setSubmitError(null);
    const result = await submitBookingRequest({
      ...values,
      serviceId: service.id,
      dateISO,
      time,
    });

    if (result.success) {
      onSuccess(values);
    } else {
      setSubmitError(result.message);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold uppercase tracking-wide">
        Ihre Kontaktdaten
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fast geschafft — wir bestätigen Ihren Termin telefonisch oder per E-Mail.
      </p>

      <div className="mt-6 space-y-2 rounded-xl border bg-secondary/40 p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{service.title}</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-primary">{service.priceLabel}</span>
            <button
              type="button"
              onClick={onEditService}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-3" aria-hidden="true" />
              Ändern
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatFullDateLabel(dateISO)}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono">
              <Clock className="size-3.5" aria-hidden="true" />
              {time} Uhr
            </span>
            <button
              type="button"
              onClick={onEditDateTime}
              className="flex items-center gap-1 text-xs hover:text-foreground"
            >
              <Pencil className="size-3" aria-hidden="true" />
              Ändern
            </button>
          </div>
        </div>
      </div>

      <form id="booking-contact-form" onSubmit={handleSubmit(onSubmit)} noValidate className="relative mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="booking-name">Name</Label>
            <Input
              id="booking-name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-email">E-Mail</Label>
            <Input
              id="booking-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-phone">Telefon</Label>
          <Input
            id="booking-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-notes">Anmerkungen (optional)</Label>
          <Textarea
            id="booking-notes"
            rows={3}
            placeholder="z. B. Fahrzeugmodell, Symptome oder Wünsche"
            aria-invalid={!!errors.notes}
            {...register("notes")}
          />
          {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
        </div>

        {/* Honeypot field: hidden from sighted users and screen readers, real users never fill it in. */}
        <div className="absolute -left-[9999px] top-auto size-px overflow-hidden" aria-hidden="true">
          <label htmlFor="booking-website">Firma</label>
          <input
            id="booking-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <div className="flex items-start gap-3">
              <Checkbox
                id="booking-consent"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.consent}
              />
              <Label
                htmlFor="booking-consent"
                className="text-sm font-normal leading-snug text-muted-foreground"
              >
                Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Terminanfrage
                gemäß der{" "}
                <a href="/datenschutz" className="underline underline-offset-2 hover:text-foreground">
                  Datenschutzerklärung
                </a>{" "}
                gespeichert und verarbeitet werden.
              </Label>
            </div>
          )}
        />
        {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}

        {submitError && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {submitError}
          </p>
        )}

        <WizardNav
          onBack={onBack}
          nextLabel="Termin anfragen"
          nextType="submit"
          nextLoading={isSubmitting}
        />
      </form>
    </div>
  );
}
