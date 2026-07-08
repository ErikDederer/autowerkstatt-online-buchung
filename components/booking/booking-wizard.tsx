"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/booking/step-indicator";
import { StepService } from "@/components/booking/steps/step-service";
import { StepDateTime } from "@/components/booking/steps/step-datetime";
import { StepContact } from "@/components/booking/steps/step-contact";
import { StepConfirmation } from "@/components/booking/steps/step-confirmation";
import { siteConfig, type Service } from "@/lib/site-config";
import type { BookingContactValues } from "@/lib/validations/booking";

type WizardStep = 1 | 2 | 3 | 4;

export function BookingWizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [contact, setContact] = useState<BookingContactValues | null>(null);

  const service: Service | undefined = siteConfig.services.find((s) => s.id === serviceId);

  const handleSelectService = (selected: Service) => {
    setServiceId(selected.id);
    setDateISO(null);
    setTime(null);
  };

  const handleSelectDate = (nextDateISO: string) => {
    setDateISO(nextDateISO);
    setTime(null);
  };

  const handleReset = () => {
    setStep(1);
    setServiceId(null);
    setDateISO(null);
    setTime(null);
    setContact(null);
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
          selectedServiceId={serviceId}
          onSelect={handleSelectService}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && service && (
        <StepDateTime
          service={service}
          dateISO={dateISO}
          time={time}
          onSelectDate={handleSelectDate}
          onSelectTime={setTime}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && service && dateISO && time && (
        <StepContact
          service={service}
          dateISO={dateISO}
          time={time}
          onBack={() => setStep(2)}
          onEditService={() => setStep(1)}
          onEditDateTime={() => setStep(2)}
          onSuccess={(values) => {
            setContact(values);
            setStep(4);
          }}
        />
      )}

      {step === 4 && service && dateISO && time && contact && (
        <StepConfirmation
          service={service}
          dateISO={dateISO}
          time={time}
          contact={contact}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
