"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type WizardNavProps = {
  onBack?: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  nextType?: "button" | "submit";
  onNext?: () => void;
};

export function WizardNav({
  onBack,
  nextLabel,
  nextDisabled,
  nextLoading,
  nextType = "button",
  onNext,
}: WizardNavProps) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6">
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
      ) : (
        <span />
      )}
      <Button
        type={nextType}
        onClick={onNext}
        disabled={nextDisabled || nextLoading}
        className="gap-2"
      >
        {nextLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {nextLabel}
      </Button>
    </div>
  );
}
