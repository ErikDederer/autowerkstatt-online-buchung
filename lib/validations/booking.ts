import { z } from "zod";

export const bookingRequestSchema = z.object({
  serviceId: z.string().min(1, "Bitte wählen Sie eine Leistung aus."),
  dateISO: z.string().min(1, "Bitte wählen Sie ein Datum aus."),
  time: z.string().min(1, "Bitte wählen Sie eine Uhrzeit aus."),
  name: z
    .string()
    .trim()
    .min(2, "Bitte geben Sie Ihren Namen ein.")
    .max(100, "Der Name ist zu lang."),
  email: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie Ihre E-Mail-Adresse ein.")
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone: z
    .string()
    .trim()
    .min(6, "Bitte geben Sie eine Telefonnummer ein, damit wir Sie erreichen können.")
    .max(30, "Die Telefonnummer ist zu lang."),
  vehicleMake: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie die Fahrzeugmarke an.")
    .max(60, "Die Markenbezeichnung ist zu lang."),
  vehicleModel: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie das Fahrzeugmodell an.")
    .max(60, "Die Modellbezeichnung ist zu lang."),
  licensePlate: z
    .string()
    .trim()
    .min(4, "Bitte geben Sie ein gültiges Kennzeichen an.")
    .max(12, "Das Kennzeichen ist zu lang.")
    .regex(
      /^[A-ZÄÖÜ0-9- ]+$/i,
      "Bitte geben Sie ein Kennzeichen ohne Sonderzeichen an, z. B. BS-AB 123."
    )
    .transform((val) => val.toUpperCase()),
  // Kept as a digit string (not coerced to number) so the schema's inferred
  // type matches the text input's raw value with no input/output split.
  mileageKm: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie den Kilometerstand an.")
    .refine((val) => /^\d+$/.test(val), "Bitte geben Sie eine gültige Zahl ein.")
    .refine((val) => Number(val) <= 999999, "Bitte prüfen Sie den Kilometerstand."),
  notes: z.string().trim().max(500, "Ihre Anmerkung ist zu lang.").optional().or(z.literal("")),
  consent: z.boolean().refine((val) => val === true, {
    message: "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.",
  }),
  // Honeypot: must stay empty. Real users never see or fill this field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type BookingRequestValues = z.infer<typeof bookingRequestSchema>;

export const bookingContactSchema = bookingRequestSchema.pick({
  name: true,
  email: true,
  phone: true,
  vehicleMake: true,
  vehicleModel: true,
  licensePlate: true,
  mileageKm: true,
  notes: true,
  consent: true,
  website: true,
});

export type BookingContactValues = z.infer<typeof bookingContactSchema>;
