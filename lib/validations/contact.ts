import { z } from "zod";

export const contactFormSchema = z.object({
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
  phone: z.string().trim().max(30, "Die Telefonnummer ist zu lang.").optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Ihre Nachricht sollte mindestens 10 Zeichen enthalten.")
    .max(2000, "Ihre Nachricht ist zu lang."),
  consent: z.boolean().refine((val) => val === true, {
    message: "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.",
  }),
  // Honeypot: must stay empty. Real users never see or fill this field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
