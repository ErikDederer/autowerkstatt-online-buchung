"use server";

import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

export type ContactActionState = {
  success: boolean;
  message: string;
};

export async function submitContactForm(
  values: ContactFormValues
): Promise<ContactActionState> {
  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte überprüfen Sie Ihre Angaben und versuchen Sie es erneut.",
    };
  }

  const { website } = parsed.data;

  // Honeypot triggered: report success to the bot without processing anything.
  if (website) {
    return {
      success: true,
      message: "Vielen Dank für Ihre Nachricht!",
    };
  }

  // Demo-only: do not persist or log visitors' personal information.

  return {
    success: true,
    message: "Demo: Ihre Eingaben wurden geprüft, aber nicht gespeichert oder versendet.",
  };
}
