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
  depositCents?: number | null;
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
  /** Whether the workshop's plan includes the AI chat assistant. */
  assistantEnabled?: boolean;
  /** Whether customers may scan their Fahrzeugschein while booking. */
  documentScanEnabled?: boolean;
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
  /** Scan whose (checked) data the customer submitted. */
  documentScanId?: string | null;
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
  deposit?: { amountCents: number; payUrl: string } | null;
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
      // Chat turns run the model and tools; everything else answers fast.
      signal: AbortSignal.timeout(path.startsWith("/chat") ? 60_000 : 8000),
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

// --- AI chat assistant --------------------------------------------------------

export type ChatUi = {
  slots?: { date: string; time: string; startsAt: string; label: string }[];
  booking?: { status: "booked" | "requested"; date: string; time: string; services: string[] };
  handoff?: { urgency: "normal" | "urgent" };
};

export type ChatReply = {
  conversationId: string;
  token?: string;
  reply: string;
  ui: ChatUi;
  language: string | null;
  dir: "ltr" | "rtl";
  status: string;
};

export type ChatTranscript = {
  status: string;
  language: string | null;
  dir: "ltr" | "rtl";
  messages: { role: "user" | "assistant"; text: string; at: string }[];
};

export function sendChatMessage(
  payload: { message: string; conversationId?: string | null; token?: string | null; privacyAccepted?: boolean },
  endUserIp: string
) {
  return call<ChatReply>("/chat", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
    endUserIp,
  });
}

export function getChatTranscript(conversationId: string, token: string, endUserIp: string) {
  return call<ChatTranscript>(`/chat?conversationId=${encodeURIComponent(conversationId)}`, {
    cache: "no-store",
    endUserIp,
    headers: { "x-chat-token": token },
  });
}

// --- Fahrzeugschein scan ------------------------------------------------------

export type RegistrationFields = {
  licensePlate?: string | null;
  vin?: string | null;
  hsn?: string | null;
  tsn?: string | null;
  make?: string | null;
  model?: string | null;
  firstRegistration?: string | null;
};

export type ScanResult = {
  scanId: string;
  status: "extracted" | "failed" | "offline";
  fields: RegistrationFields;
  message: string | null;
};

/** Multipart upload, so not through call() (which sends JSON). */
export async function scanRegistration(file: File, endUserIp: string): Promise<ScanResult> {
  const { url, key } = config();
  const form = new FormData();
  form.append("file", file, file.name || "fahrzeugschein.jpg");
  let response: Response;
  try {
    response = await fetch(`${url}/api/public/v1/document-scans`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "x-end-user-ip": endUserIp },
      body: form,
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new WerkplanApiError(503, "unreachable", "Der Dienst ist gerade nicht erreichbar.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new WerkplanApiError(response.status, body?.error?.code ?? "unknown", body?.error?.message ?? "Unbekannter Fehler.");
  }
  return body as ScanResult;
}
