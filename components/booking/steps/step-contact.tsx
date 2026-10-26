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
import { HsnTsnLookup } from "@/components/booking/hsn-tsn-lookup";
import { bookingContactSchema, type BookingContactValues } from "@/lib/validations/booking";
import { submitBookingRequest } from "@/lib/actions/booking";
import { formatFullDateLabel, toDayOption } from "@/lib/booking/slots";
import type { Service } from "@/lib/site-config";
import type { BookingConfirmation, ChosenSlot } from "@/components/booking/booking-wizard";

export type StepContactProps = {
  service: Service;
  slot: ChosenSlot;
  bookingMode: "instant" | "request";
  onBack: () => void;
  onEditService: () => void;
  onEditDateTime: () => void;
  /** Slot was taken meanwhile and the customer picked one of the alternatives. */
  onPickAlternative: (slot: ChosenSlot) => void;
  onSuccess: (values: BookingContactValues, confirmation: BookingConfirmation) => void;
};

function shortDay(dateISO: string) {
  const d = toDayOption(dateISO);
  return `${d.weekdayShort} ${d.dayNumber}. ${d.monthShort}`;
}

const defaultValues: BookingContactValues = {
  name: "",
  email: "",
  phone: "",
  vehicleMake: "",
  vehicleModel: "",
  licensePlate: "",
  mileageKm: "",
  notes: "",
  consent: false,
  remindersOptIn: false,
  marketingOptIn: false,
  honeypot: "",
};

export function StepContact({
  service,
  slot,
  bookingMode,
  onBack,
  onEditService,
  onEditDateTime,
  onPickAlternative,
  onSuccess,
}: StepContactProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<ChosenSlot[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingContactValues>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues,
  });

  const onSubmit = async (values: BookingContactValues) => {
    setSubmitError(null);
    setAlternatives([]);
    let result;
    try {
      result = await submitBookingRequest({
        ...values,
        serviceId: service.id,
        startsAt: slot.startsAt,
      });
    } catch {
      // Network failure or crashed action — without this the button just
      // stops spinning and the customer gets no feedback at all.
      setSubmitError(
        "Ihre Anfrage konnte nicht gesendet werden. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
      );
      return;
    }

    if (result.success) {
      onSuccess(values, {
        status: result.result.status,
        startsAt: result.result.startsAt,
        endsAt: result.result.endsAt,
      });
    } else {
      setSubmitError(result.message);
      setAlternatives(result.alternatives ?? []);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold uppercase tracking-wide">
        Ihre Kontaktdaten
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {bookingMode === "instant"
          ? "Fast geschafft — der Termin wird mit dem Absenden fest für Sie reserviert."
          : "Fast geschafft — wir bestätigen Ihren Termin telefonisch oder per E-Mail."}
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
            {formatFullDateLabel(slot.date)}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono">
              <Clock className="size-3.5" aria-hidden="true" />
              {slot.time} Uhr
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

        <div className="space-y-4 border-t pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Fahrzeugdaten</h3>

          <HsnTsnLookup
            onDecoded={({ make, model }) => {
              setValue("vehicleMake", make, { shouldValidate: true });
              setValue("vehicleModel", model, { shouldValidate: true });
            }}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-vehicle-make">Marke</Label>
              <Input
                id="booking-vehicle-make"
                placeholder="z. B. Volkswagen"
                aria-invalid={!!errors.vehicleMake}
                {...register("vehicleMake")}
              />
              {errors.vehicleMake && (
                <p className="text-sm text-destructive">{errors.vehicleMake.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-vehicle-model">Modell</Label>
              <Input
                id="booking-vehicle-model"
                placeholder="z. B. Golf VII"
                aria-invalid={!!errors.vehicleModel}
                {...register("vehicleModel")}
              />
              {errors.vehicleModel && (
                <p className="text-sm text-destructive">{errors.vehicleModel.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-license-plate">Kennzeichen</Label>
              <Input
                id="booking-license-plate"
                placeholder="z. B. BS-AB 123"
                className="uppercase"
                aria-invalid={!!errors.licensePlate}
                {...register("licensePlate")}
              />
              {errors.licensePlate && (
                <p className="text-sm text-destructive">{errors.licensePlate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-mileage">Kilometerstand</Label>
              <div className="relative">
                <Input
                  id="booking-mileage"
                  type="text"
                  inputMode="numeric"
                  placeholder="z. B. 128000"
                  aria-invalid={!!errors.mileageKm}
                  className="pr-10"
                  {...register("mileageKm")}
                />
                <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-sm text-muted-foreground">
                  km
                </span>
              </div>
              {errors.mileageKm && (
                <p className="text-sm text-destructive">{errors.mileageKm.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t pt-5">
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
          <label htmlFor="booking-hp-field">Dieses Feld bitte leer lassen</label>
          <input
            id="booking-hp-field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            data-bwignore
            data-form-type="other"
            {...register("honeypot")}
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
                className="block text-sm font-normal leading-snug text-muted-foreground"
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

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Freiwillig — jederzeit mit einem Klick abbestellbar</legend>
          <Controller
            control={control}
            name="remindersOptIn"
            render={({ field }) => (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="booking-reminders"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <Label htmlFor="booking-reminders" className="block text-sm font-normal leading-snug text-muted-foreground">
                  Terminbestätigung und Erinnerung 24 Stunden vorher per E-Mail und SMS.
                </Label>
              </div>
            )}
          />
          <Controller
            control={control}
            name="marketingOptIn"
            render={({ field }) => (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="booking-marketing"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <Label htmlFor="booking-marketing" className="block text-sm font-normal leading-snug text-muted-foreground">
                  Erinnerungen an HU-Termin, Reifenwechsel und Inspektion per E-Mail.
                </Label>
              </div>
            )}
          />
        </fieldset>

        {submitError && (
          <div role="alert" className="space-y-2">
            <p className="text-sm font-medium text-destructive">{submitError}</p>
            {alternatives.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {alternatives.map((alt) => (
                  <button
                    key={alt.startsAt}
                    type="button"
                    onClick={() => {
                      onPickAlternative(alt);
                      setAlternatives([]);
                      setSubmitError(null);
                    }}
                    className="rounded-lg border border-primary px-3 py-1.5 font-mono text-sm text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {shortDay(alt.date)}, {alt.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <WizardNav
          onBack={onBack}
          nextLabel={bookingMode === "instant" ? "Termin verbindlich buchen" : "Termin anfragen"}
          nextType="submit"
          nextLoading={isSubmitting}
        />
      </form>
    </div>
  );
}
