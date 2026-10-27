"use client";

import { Clock } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/site-config";
import { WizardNav } from "@/components/booking/wizard-nav";

export type StepServiceProps = {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
};

export function StepService({ services, selectedServiceId, onSelect, onNext }: StepServiceProps) {
  return (
    <div>
      <h2 className="font-heading text-xl font-semibold uppercase tracking-wide">
        Welche Leistung benötigen Sie?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Wählen Sie einen Service aus, um passende Termine zu sehen.
      </p>

      <div
        role="radiogroup"
        aria-label="Leistung wählen"
        className="mt-6 grid gap-3 sm:grid-cols-2"
      >
        {services.map((service) => {
          const Icon = getIcon(service.icon);
          const isSelected = service.id === selectedServiceId;

          return (
            <button
              key={service.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(service)}
              className={cn(
                "flex items-start gap-4 rounded-xl border bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected ? "border-primary ring-2 ring-primary" : "hover:border-foreground/30"
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-base font-semibold uppercase tracking-wide">
                    {service.title}
                  </h3>
                  <span className="shrink-0 whitespace-nowrap font-mono text-sm font-semibold text-primary">
                    {service.priceLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{service.text}</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  ca. {service.durationMinutes} Min.
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <WizardNav nextLabel="Weiter" nextDisabled={!selectedServiceId} onNext={onNext} />
    </div>
  );
}
