"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { bookingRequestSchema, type BookingRequestValues } from "@/lib/validations/booking";
import { checkRateLimit } from "@/lib/booking/rate-limit";
import {
  createBooking,
  getSlots,
  WerkplanApiError,
  type ApiSlot,
  type BookingResult,
} from "@/lib/werkplan/client";

export type BookingActionState =
  | { success: true; result: BookingResult }
  | { success: false; message: string; alternatives?: ApiSlot[] };

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

const GENERIC_ERROR =
  "Ihre Buchung konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.";

const slotQuery = z.object({ serviceId: z.uuid(), from: z.iso.date(), to: z.iso.date() });

/** Free start times from WerkPlan's slot engine for the wizard's date step. */
export async function getAvailableSlots(
  serviceId: string,
  from: string,
  to: string
): Promise<{ ok: true; slots: ApiSlot[] } | { ok: false; message: string }> {
  const parsed = slotQuery.safeParse({ serviceId, from, to });
  if (!parsed.success) return { ok: false, message: "Ungültige Anfrage." };
  try {
    const { slots } = await getSlots([serviceId], from, to, await getClientIp());
    return { ok: true, slots };
  } catch (err) {
    console.error("[booking] Freie Termine nicht abrufbar:", err instanceof Error ? err.message : err);
    return {
      ok: false,
      message: "Freie Termine konnten gerade nicht geladen werden. Bitte versuchen Sie es gleich erneut oder rufen Sie uns an.",
    };
  }
}

export async function submitBookingRequest(values: BookingRequestValues): Promise<BookingActionState> {
  const parsed = bookingRequestSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: "Bitte überprüfen Sie Ihre Angaben und versuchen Sie es erneut." };
  }

  const { honeypot, ...data } = parsed.data;

  // Honeypot filled: book nothing. A generic error (rather than a fake
  // confirmation) means a human whose browser autofilled the hidden field
  // isn't told their car is booked when it isn't.
  if (honeypot) {
    return { success: false, message: GENERIC_ERROR };
  }

  const ip = await getClientIp();
  if (!checkRateLimit(ip).allowed) {
    return {
      success: false,
      message: "Sie haben zu viele Buchungen gesendet. Bitte versuchen Sie es später erneut oder rufen Sie uns direkt an.",
    };
  }

  try {
    const result = await createBooking(
      {
        serviceIds: [data.serviceId],
        startsAt: data.startsAt,
        customer: { name: data.name, phone: data.phone, email: data.email },
        vehicle: {
          licensePlate: data.licensePlate,
          make: data.vehicleMake,
          model: data.vehicleModel,
          mileageKm: Number(data.mileageKm),
        },
        notes: data.notes || null,
        preferredLanguage: "de",
        consents: {
          reminders: data.remindersOptIn ? ["email", "sms"] : [],
          marketing: data.marketingOptIn ? ["email"] : [],
        },
      },
      ip
    );
    return { success: true, result };
  } catch (err) {
    if (err instanceof WerkplanApiError && err.code === "slot_unavailable") {
      return {
        success: false,
        message: "Dieser Termin wurde gerade vergeben. Bitte wählen Sie einen der nächsten freien Termine:",
        alternatives: err.details?.alternatives ?? [],
      };
    }
    if (err instanceof WerkplanApiError && err.status === 429) {
      return { success: false, message: err.message };
    }
    // Only the code goes to the log — never the customer's contact data.
    console.error("[booking] Buchung fehlgeschlagen:", err instanceof WerkplanApiError ? err.code : err);
    return { success: false, message: GENERIC_ERROR };
  }
}
