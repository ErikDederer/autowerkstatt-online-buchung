/**
 * Date helpers for the /termin flow. Availability itself comes from
 * WerkPlan's slot engine (lib/actions/booking.ts → getAvailableSlots).
 */

export type DayOption = {
  dateISO: string;
  weekdayShort: string;
  dayNumber: string;
  monthShort: string;
  fullLabel: string;
};

/** Parses a "YYYY-MM-DD" string as a local-timezone Date at midnight. */
export function parseDateISO(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDaysISO(dateISO: string, days: number): string {
  const d = parseDateISO(dateISO);
  d.setDate(d.getDate() + days);
  return toDateISO(d);
}

export function formatFullDateLabel(dateISO: string): string {
  return parseDateISO(dateISO).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function toDayOption(dateISO: string): DayOption {
  const d = parseDateISO(dateISO);
  return {
    dateISO,
    weekdayShort: d.toLocaleDateString("de-DE", { weekday: "short" }),
    dayNumber: d.toLocaleDateString("de-DE", { day: "numeric" }),
    monthShort: d.toLocaleDateString("de-DE", { month: "short" }),
    fullLabel: formatFullDateLabel(dateISO),
  };
}
