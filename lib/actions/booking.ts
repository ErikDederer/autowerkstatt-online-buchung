"use server";

import { bookingRequestSchema, type BookingRequestValues } from "@/lib/validations/booking";

export type BookingActionState = {
  success: boolean;
  message: string;
};

export async function submitBookingRequest(
  values: BookingRequestValues
): Promise<BookingActionState> {
  const parsed = bookingRequestSchema.safeParse(values);

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
      message: "Ihre Terminanfrage wurde übermittelt.",
    };
  }

  // Demo project: no real backend or scheduling system is wired up. The
  // artificial delay stands in for a real availability check server-side.
  await new Promise((resolve) => setTimeout(resolve, 700));

  console.log("[booking] Neue Terminanfrage:", {
    ...data,
    submittedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Ihre Terminanfrage wurde übermittelt. Wir melden uns zur Bestätigung bei Ihnen.",
  };
}
