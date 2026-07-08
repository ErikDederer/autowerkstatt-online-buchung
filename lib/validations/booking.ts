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
  notes: true,
  consent: true,
  website: true,
});

export type BookingContactValues = z.infer<typeof bookingContactSchema>;
