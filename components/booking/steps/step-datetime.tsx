"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookableDays, getSlotsForDay, type TimeSlot } from "@/lib/booking/slots";
import type { Service } from "@/lib/site-config";
import { WizardNav } from "@/components/booking/wizard-nav";

export type StepDateTimeProps = {
  service: Service;
  dateISO: string | null;
  time: string | null;
  onSelectDate: (dateISO: string) => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const SLOT_LOADING_DELAY_MS = 450;

export function StepDateTime({
  service,
  dateISO,
  time,
  onSelectDate,
  onSelectTime,
  onBack,
  onNext,
}: StepDateTimeProps) {
  const days = useMemo(() => getBookableDays(), []);
  const requestKey = dateISO ? `${dateISO}|${service.id}|${service.durationMinutes}` : null;
  const [resolved, setResolved] = useState<{ key: string; slots: TimeSlot[] } | null>(null);
  const isLoadingSlots = requestKey !== null && resolved?.key !== requestKey;
  const slots = resolved?.key === requestKey ? resolved.slots : [];

  // Auto-select the first bookable day so the slot grid has something to show.
  useEffect(() => {
    if (!dateISO && days.length > 0) {
      onSelectDate(days[0].dateISO);
    }
    // Only run once on mount / when there is no date yet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dateISO || !requestKey) return;

    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled) return;
      setResolved({
        key: requestKey,
        slots: getSlotsForDay(dateISO, service.id, service.durationMinutes),
      });
    }, SLOT_LOADING_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [dateISO, service.id, service.durationMinutes, requestKey]);

  const selectedDay = days.find((day) => day.dateISO === dateISO);

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold uppercase tracking-wide">
        Wann passt es Ihnen?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Freie Termine für &bdquo;{service.title}&ldquo; in den nächsten zwei Wochen.
      </p>

      <div
        role="radiogroup"
        aria-label="Datum wählen"
        className="mt-6 -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2"
      >
        {days.map((day) => {
          const isSelected = day.dateISO === dateISO;
          return (
            <button
              key={day.dateISO}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectDate(day.dateISO)}
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
        <p className="text-sm font-medium">
          {selectedDay ? selectedDay.fullLabel : "Bitte wählen Sie ein Datum."}
        </p>

        {isLoadingSlots ? (
          <div
            className="mt-3 flex items-center gap-2 py-8 text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Verfügbare Uhrzeiten werden geladen …
          </div>
        ) : (
          <div
            role="radiogroup"
            aria-label="Uhrzeit wählen"
            className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4"
          >
            {slots.map((slot) => {
              const isSelected = slot.time === time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  className={cn(
                    "rounded-lg border px-3 py-2 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    !slot.available &&
                      "cursor-not-allowed border-transparent bg-muted text-muted-foreground/50 line-through",
                    slot.available &&
                      !isSelected &&
                      "border-border bg-card hover:border-foreground/30",
                    isSelected && "border-primary bg-primary text-primary-foreground"
                  )}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <WizardNav
        onBack={onBack}
        nextLabel="Weiter"
        nextDisabled={!dateISO || !time}
        onNext={onNext}
      />
    </div>
  );
}
