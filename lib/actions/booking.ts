"use server";

import { headers } from "next/headers";
import { bookingRequestSchema, type BookingRequestValues } from "@/lib/validations/booking";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/booking/rate-limit";
import { siteConfig } from "@/lib/site-config";

export type BookingActionState = {
  success: boolean;
  message: string;
};

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

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

  const service = siteConfig.services.find((s) => s.id === data.serviceId);
  if (!service) {
    return {
      success: false,
      message: "Bitte überprüfen Sie Ihre Angaben und versuchen Sie es erneut.",
    };
  }

  const ip = await getClientIp();
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message:
        "Sie haben zu viele Terminanfragen gestellt. Bitte versuchen Sie es später erneut oder rufen Sie uns direkt an.",
    };
  }

  try {
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.from("booking_requests").insert({
      customer_name: data.name,
      phone: data.phone,
      email: data.email,
      vehicle_make: data.vehicleMake,
      vehicle_model: data.vehicleModel,
      license_plate: data.licensePlate,
      mileage_km: Number(data.mileageKm),
      service_type: data.serviceId,
      requested_date: data.dateISO,
      requested_slot: data.time,
      duration_min: service.durationMinutes,
      note: data.notes || null,
      status: "neu",
      source: "website",
    });

    if (error) throw error;
  } catch (err) {
    // Covers both a missing Supabase config (getSupabaseAdminClient throws)
    // and a failed insert — either way the customer gets a safe, generic
    // message and the real cause goes to the server log only.
    console.error("[booking] Terminanfrage konnte nicht gespeichert werden:", err);
    return {
      success: false,
      message:
        "Ihre Anfrage konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.",
    };
  }

  return {
    success: true,
    message: "Ihre Terminanfrage wurde übermittelt. Wir melden uns zur Bestätigung bei Ihnen.",
  };
}
