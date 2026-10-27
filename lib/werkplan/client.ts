import "server-only";

/**
 * Server-side client for WerkPlan's public booking API — the website's
 * only backend. Authenticated with the workshop's site key, which also
 * tells WerkPlan which workshop this site belongs to. Never import this
 * from client components: WERKPLAN_API_KEY must not reach the browser.
 */

export type ApiService = {
  id: string;
  slug: string;
  nameDe: string;
  nameEn: string;
  descriptionDe: string | null;
  descriptionEn: string | null;
  category: string;
  durationMinutes: number;
  priceMinCents: number;
  priceMaxCents: number | null;
};

export type WorkshopInfo = {
  name: string;
  phone: string | null;
  email: string | null;
  address: { street: string | null; postalCode: string | null; city: string | null };
  timezone: string;
  openingHours: { weekday: number; windows: { start: string; end: string }[] }[];
  upcomingClosures: { startsOn: string; endsOn: string; reason: string | null }[];
  services: ApiService[];
  cancellationPolicy: { freeCancellationHours: number; textDe: string; textEn: string } | null;
  booking: { mode: "instant" | "request"; minLeadMinutes: number; horizonDays: number; slotStepMinutes: number };
};

export type ApiSlot = { date: string; time: string; startsAt: string };

export type BookingPayload = {
  serviceIds: string[];
  startsAt: string;
  customer: { name: string; phone: string; email?: string | null };
  vehicle: {
    licensePlate: string;
    make: string;
    model: string;
    hsn?: string | null;
    tsn?: string | null;
    mileageKm?: number | null;
  };
  notes?: string | null;
  preferredLanguage?: string;
  consents?: { reminders: ("email" | "sms" | "whatsapp")[]; marketing: ("email" | "sms" | "whatsapp")[] };
};

export type BookingResult = {
  status: "booked" | "requested";
  requestId: string;
  date: string;
  time: string;
  startsAt: string;
  endsAt: string;
  services: { nameDe: string; nameEn: string }[];
};

export class WerkplanApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: { alternatives?: ApiSlot[] }
  ) {
    super(message);
  }
}

function config() {
  const url = process.env.WERKPLAN_API_URL;
  const key = process.env.WERKPLAN_API_KEY;
  if (!url || !key) {
    throw new WerkplanApiError(
      503,
      "not_configured",
      "Online-Buchung ist nicht konfiguriert (WERKPLAN_API_URL / WERKPLAN_API_KEY fehlen)."
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function call<T>(
  path: string,
  init: RequestInit & { endUserIp?: string; next?: { revalidate?: number } } = {}
): Promise<T> {
  const { url, key } = config();
  const { endUserIp, ...rest } = init;
  let response: Response;
  try {
    response = await fetch(`${url}/api/public/v1${path}`, {
      ...rest,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(endUserIp ? { "x-end-user-ip": endUserIp } : {}),
        ...rest.headers,
      },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new WerkplanApiError(503, "unreachable", "Der Buchungsdienst ist gerade nicht erreichbar.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new WerkplanApiError(
      response.status,
      body?.error?.code ?? "unknown",
      body?.error?.message ?? "Unbekannter Fehler.",
      body?.error?.details
    );
  }
  return body as T;
}

/** Cached for 5 minutes: catalog and hours change rarely. */
export function getWorkshopInfo(): Promise<WorkshopInfo> {
  return call<WorkshopInfo>("/workshop", { next: { revalidate: 300 } });
}

export function getSlots(serviceIds: string[], from: string, to: string, endUserIp: string) {
  const params = new URLSearchParams({ services: serviceIds.join(","), from, to });
  return call<{ durationMinutes: number; slots: ApiSlot[] }>(`/slots?${params}`, {
    cache: "no-store",
    endUserIp,
  });
}

export function createBooking(payload: BookingPayload, endUserIp: string) {
  return call<BookingResult>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
    endUserIp,
  });
}
