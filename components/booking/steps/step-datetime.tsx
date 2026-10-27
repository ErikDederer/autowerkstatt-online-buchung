"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addDaysISO, toDateISO, toDayOption } from "@/lib/booking/slots";
import { getAvailableSlots } from "@/lib/actions/booking";
import type { Service } from "@/lib/site-config";
import type { ChosenSlot } from "@/components/booking/booking-wizard";
import { WizardNav } from "@/components/booking/wizard-nav";

export type StepDateTimeProps = {
  service: Service;
  slot: ChosenSlot | null;
  onSelectSlot: (slot: ChosenSlot) => void;
  onBack: () => void;
  onNext: () => void;
};

/** How far ahead the wizard looks; WerkPlan also caps it at the workshop's horizon. */
const SEARCH_DAYS = 21;
const MAX_DAYS_SHOWN = 14;

type SlotState =
  | { key: string; status: "ok"; slots: ChosenSlot[] }
  | { key: string; status: "error"; message: string };

export function StepDateTime({ service, slot, onSelectSlot, onBack, onNext }: StepDateTimeProps) {
  const [state, setState] = useState<SlotState | null>(null);
  const [dateISO, setDateISO] = useState<string | null>(slot?.date ?? null);
  const isLoading = state?.key !== service.id;

  useEffect(() => {
    let cancelled = false;
    const from = toDateISO(new Date());
    getAvailableSlots(service.id, from, addDaysISO(from, SEARCH_DAYS)).then((result) => {
      if (cancelled) return;
      setState(
        result.ok
          ? { key: service.id, status: "ok", slots: result.slots }
          : { key: service.id, status: "error", message: result.message }
      );
    });
    return () => {
      cancelled = true;
    };
  }, [service.id]);

  const slots = useMemo(
    () => (state?.key === service.id && state.status === "ok" ? state.slots : []),
    [state, service.id]
  );
  const days = useMemo(
    () => [...new Set(slots.map((s) => s.date))].slice(0, MAX_DAYS_SHOWN).map(toDayOption),
    [slots]
  );
  // Default to the first day with free times once they've loaded.
  const activeDate = dateISO && days.some((d) => d.dateISO === dateISO) ? dateISO : days[0]?.dateISO ?? null;
  const daySlots = slots.filter((s) => s.date === activeDate);
  const selectedDay = days.find((d) => d.dateISO === activeDate);

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold uppercase tracking-wide">
        Wann passt es Ihnen?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Live aus unserem Werkstattkalender: nur Zeiten, zu denen ein Mechaniker und der
        passende Arbeitsplatz für &bdquo;{service.title}&ldquo; frei sind.
      </p>

      {isLoading ? (
        <div className="mt-6 flex items-center gap-2 py-8 text-sm text-muted-foreground" role="status" aria-live="polite">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Freie Termine werden geladen …
        </div>
      ) : state?.status === "error" ? (
        <p role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          {state.message}
        </p>
      ) : days.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          In den nächsten drei Wochen ist für diese Leistung leider nichts mehr frei. Rufen Sie uns
          gern an — oft finden wir trotzdem eine Lösung.
        </p>
      ) : (
        <>
          <div
            role="radiogroup"
            aria-label="Datum wählen"
            className="mt-6 -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2"
          >
            {days.map((day) => {
              const isSelected = day.dateISO === activeDate;
              return (
                <button
                  key={day.dateISO}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={day.fullLabel}
                  onClick={() => setDateISO(day.dateISO)}
                  className={cn(
                    "flex w-16 shrink-0 snap-start flex-col items-center gap-0.5 rounded-lg border bg-card px-2 py-3 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground/30"
                  )}
                >
                  <span className="text-xs font-medium uppercase opacity-80">{day.weekdayShort}</span>
                  <span className="font-heading text-lg font-semibold">{day.dayNumber}</span>
                  <span className="text-xs uppercase opacity-80">{day.monthShort}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">{selectedDay?.fullLabel}</p>
            <div role="radiogroup" aria-label="Uhrzeit wählen" className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {daySlots.map((s) => {
                const isSelected = s.startsAt === slot?.startsAt;
                return (
                  <button
                    key={s.startsAt}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelectSlot(s)}
                    className={cn(
                      "rounded-lg border px-3 py-2 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-foreground/30"
                    )}
                  >
                    {s.time}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <WizardNav onBack={onBack} nextLabel="Weiter" nextDisabled={!slot} onNext={onNext} />
    </div>
  );
}
