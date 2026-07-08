/**
 * Mock scheduling logic for the /termin booking flow.
 * Nothing here is persisted or fetched — availability is derived
 * deterministically from the date/service so the demo behaves
 * consistently without a real backend.
 */

const BUSINESS_START_MIN = 8 * 60;
const BUSINESS_END_MIN = 17 * 60;
const LUNCH_START_MIN = 12 * 60;
const LUNCH_END_MIN = 13 * 60;
const SLOT_STEP_MIN = 30;

export type DayOption = {
  dateISO: string;
  weekdayShort: string;
  dayNumber: string;
  monthShort: string;
  fullLabel: string;
};

export type TimeSlot = {
  time: string;
  available: boolean;
};

function toDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a "YYYY-MM-DD" string as a local-timezone Date at midnight. */
export function parseDateISO(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatFullDateLabel(dateISO: string): string {
  return parseDateISO(dateISO).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMinutes(totalMinutes: number): string {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/** Next weekdays (Mon–Fri) available for booking, starting tomorrow. */
export function getBookableDays(count = 14): DayOption[] {
  const days: DayOption[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  while (days.length < count) {
    const weekday = cursor.getDay();
    if (weekday >= 1 && weekday <= 5) {
      days.push({
        dateISO: toDateISO(cursor),
        weekdayShort: cursor.toLocaleDateString("de-DE", { weekday: "short" }),
        dayNumber: cursor.toLocaleDateString("de-DE", { day: "numeric" }),
        monthShort: cursor.toLocaleDateString("de-DE", { month: "short" }),
        fullLabel: formatFullDateLabel(toDateISO(cursor)),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

/** Deterministic pseudo-random ratio in [0, 1) derived from a string key. */
function seededRatio(key: string): number {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

/** Bookable slots for a given day, sized to the service duration. */
export function getSlotsForDay(
  dateISO: string,
  serviceId: string,
  durationMinutes: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  for (
    let start = BUSINESS_START_MIN;
    start + durationMinutes <= BUSINESS_END_MIN;
    start += SLOT_STEP_MIN
  ) {
    const end = start + durationMinutes;
    const overlapsLunch = start < LUNCH_END_MIN && end > LUNCH_START_MIN;
    if (overlapsLunch) continue;

    const time = formatMinutes(start);
    const ratio = seededRatio(`${serviceId}|${dateISO}|${time}`);
    slots.push({ time, available: ratio > 0.35 });
  }

  return slots;
}
