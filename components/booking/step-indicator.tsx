import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Leistung", "Termin", "Kontakt"];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center" aria-label="Fortschritt der Terminbuchung">
      {STEPS.map((label, i) => {
        const stepNumber = i + 1;
        const isDone = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isDone && "bg-primary text-primary-foreground",
                  isActive && "border-2 border-primary text-primary",
                  !isDone && !isActive && "border border-border text-muted-foreground"
                )}
              >
                {isDone ? <Check className="size-4" aria-hidden="true" /> : stepNumber}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive || isDone ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {stepNumber < STEPS.length && (
              <div
                className={cn(
                  "mx-2 mb-5 h-px flex-1 transition-colors sm:mx-4",
                  isDone ? "bg-primary" : "bg-border"
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
