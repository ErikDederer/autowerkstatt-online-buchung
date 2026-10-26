"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/booking/step-indicator";
import { StepService } from "@/components/booking/steps/step-service";
import { StepDateTime } from "@/components/booking/steps/step-datetime";
import { StepContact } from "@/components/booking/steps/step-contact";
import { StepConfirmation } from "@/components/booking/steps/step-confirmation";
import type { Service } from "@/lib/site-config";
import type { BookingContactValues } from "@/lib/validations/booking";

type WizardStep = 1 | 2 | 3 | 4;

/** A free start offered by WerkPlan's slot engine. */
export type ChosenSlot = { date: string; time: string; startsAt: string };

export type BookingConfirmation = {
  status: "booked" | "requested";
  startsAt: string;
  endsAt: string;
};

export function BookingWizard({
  services,
  bookingMode,
}: {
  /** Live catalog from WerkPlan; `id` is WerkPlan's service id. */
  services: Service[];
  bookingMode: "instant" | "request";
}) {
  const [step, setStep] = useState<WizardStep>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [slot, setSlot] = useState<ChosenSlot | null>(null);
  const [contact, setContact] = useState<BookingContactValues | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const service = services.find((s) => s.id === serviceId);

  const handleSelectService = (selected: Service) => {
    setServiceId(selected.id);
    setSlot(null);
  };

  const handleReset = () => {
    setStep(1);
    setServiceId(null);
    setSlot(null);
    setContact(null);
    setConfirmation(null);
  };

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8">
      {step < 4 && (
        <div className="mb-8">
          <StepIndicator currentStep={step} />
        </div>
      )}

      {step === 1 && (
        <StepService
          services={services}
          selectedServiceId={serviceId}
          onSelect={handleSelectService}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && service && (
        <StepDateTime
          service={service}
          slot={slot}
          onSelectSlot={setSlot}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && service && slot && (
        <StepContact
          service={service}
          slot={slot}
          bookingMode={bookingMode}
          onBack={() => setStep(2)}
          onEditService={() => setStep(1)}
          onEditDateTime={() => setStep(2)}
          onPickAlternative={setSlot}
          onSuccess={(values, result) => {
            setContact(values);
            setConfirmation(result);
            setStep(4);
          }}
        />
      )}

      {step === 4 && service && slot && contact && confirmation && (
        <StepConfirmation
          service={service}
          slot={slot}
          contact={contact}
          confirmation={confirmation}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
