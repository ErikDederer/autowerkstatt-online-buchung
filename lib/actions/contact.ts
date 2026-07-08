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

  const { website, ...data } = parsed.data;

  // Honeypot triggered: report success to the bot without processing anything.
  if (website) {
    return {
      success: true,
      message: "Vielen Dank für Ihre Nachricht!",
    };
  }

  // Demo project: no real backend is wired up. Replace this with an email
  // or CRM integration (e.g. Resend, HubSpot) when deploying for real.
  console.log("[contact-form] Neue Anfrage:", {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message,
    submittedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Vielen Dank für Ihre Nachricht! Wir melden uns in Kürze bei Ihnen.",
  };
}
