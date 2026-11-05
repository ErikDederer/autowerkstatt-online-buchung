"use server";

import { headers } from "next/headers";
import { scanRegistration, WerkplanApiError, type RegistrationFields } from "@/lib/werkplan/client";

export type ScanActionState =
  | { ok: true; scanId: string; fields: RegistrationFields; message: string | null }
  | { ok: false; message: string };

const MAX_BYTES = 10 * 1024 * 1024;

/** Photo of the Fahrzeugschein → vehicle fields for the customer to check (via WerkPlan). */
export async function scanVehicleDocument(form: FormData): Promise<ScanActionState> {
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Bitte ein Foto auswählen." };
  if (file.size > MAX_BYTES) return { ok: false, message: "Das Foto ist zu groß (max. 10 MB)." };
  if (!file.type.startsWith("image/")) return { ok: false, message: "Bitte ein Foto (JPEG, PNG, HEIC) auswählen." };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "unknown";
  try {
    const r = await scanRegistration(file, ip);
    return { ok: true, scanId: r.scanId, fields: r.fields, message: r.message };
  } catch (err) {
    if (err instanceof WerkplanApiError && (err.status === 429 || err.status === 415 || err.status === 413)) {
      return { ok: false, message: err.message };
    }
    console.error("[scan] fehlgeschlagen:", err instanceof WerkplanApiError ? err.code : err);
    return { ok: false, message: "Das Foto konnte gerade nicht gelesen werden. Bitte tragen Sie die Daten von Hand ein." };
  }
}
