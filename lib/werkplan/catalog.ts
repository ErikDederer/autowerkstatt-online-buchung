import "server-only";
import { siteConfig, type OpeningHoursRow, type Service } from "@/lib/site-config";
import { getWorkshopInfo, type ApiService, type WorkshopInfo } from "./client";

/** A catalog service as the booking wizard needs it; `id` is WerkPlan's service id. */
export type BookableService = Service & { slug: string };

const ICON_BY_CATEGORY: Record<string, string> = {
  wartung: "ClipboardCheck",
  reifen: "CircleDot",
  bremsen: "Disc",
  pruefung: "ShieldCheck",
  klima: "Snowflake",
  diagnose: "Gauge",
  motor: "Wrench",
  fahrwerk: "Car",
  elektrik: "BatteryCharging",
  karosserie: "Sparkles",
};

const euros = (cents: number) => Math.round(cents / 100);

/** Same wording as WerkPlan's catalog: "kostenlos", "29 €", "89–139 €", "ab 29 €". */
export function priceLabel(minCents: number, maxCents: number | null): string {
  if (minCents === 0 && !maxCents) return "kostenlos";
  if (maxCents === null) return `ab ${euros(minCents)} €`;
  if (maxCents === minCents) return `${euros(minCents)} €`;
  return `${euros(minCents)}–${euros(maxCents)} €`;
}

function toService(s: ApiService): BookableService {
  // Keep the hand-picked icons of the original six services.
  const legacy = siteConfig.services.find((l) => l.id === s.slug);
  return {
    id: s.id,
    slug: s.slug,
    icon: legacy?.icon ?? ICON_BY_CATEGORY[s.category] ?? "Wrench",
    title: s.nameDe,
    text: s.descriptionDe ?? "",
    priceFrom: euros(s.priceMinCents),
    priceLabel: priceLabel(s.priceMinCents, s.priceMaxCents),
    durationMinutes: s.durationMinutes,
  };
}

const WEEKDAYS = ["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

/** Groups equal consecutive days: "Montag – Freitag 08:00 – 12:00, 13:00 – 17:00 Uhr". */
export function openingHoursRows(info: WorkshopInfo): OpeningHoursRow[] {
  const rows: { from: number; to: number; hours: string }[] = [];
  for (const day of info.openingHours) {
    const hours = day.windows.length
      ? `${day.windows.map((w) => `${w.start} – ${w.end}`).join(", ")} Uhr`
      : "geschlossen";
    const last = rows.at(-1);
    if (last && last.hours === hours && last.to === day.weekday - 1) last.to = day.weekday;
    else rows.push({ from: day.weekday, to: day.weekday, hours });
  }
  return rows.map((r) => ({
    days: r.from === r.to ? WEEKDAYS[r.from] : `${WEEKDAYS[r.from]} – ${WEEKDAYS[r.to]}`,
    hours: r.hours,
  }));
}

export type SiteCatalog = {
  services: BookableService[];
  openingHours: OpeningHoursRow[];
  bookingMode: "instant" | "request";
  /** false → WerkPlan unreachable; pages fall back to site-config content. */
  live: boolean;
};

/**
 * Live catalog from WerkPlan, falling back to the static site-config so the
 * marketing pages still render (and build) when the API is down.
 */
export async function getSiteCatalog(): Promise<SiteCatalog> {
  try {
    const info = await getWorkshopInfo();
    return {
      services: info.services.map(toService),
      openingHours: openingHoursRows(info),
      bookingMode: info.booking.mode,
      live: true,
    };
  } catch {
    return {
      services: siteConfig.services.map((s) => ({ ...s, slug: s.id })),
      openingHours: [...siteConfig.openingHours],
      bookingMode: "request",
      live: false,
    };
  }
}
