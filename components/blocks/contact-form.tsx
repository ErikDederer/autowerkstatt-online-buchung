"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";
import { submitContactForm } from "@/lib/actions/contact";

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  website: "",
};

export function ContactForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus(null);
    const result = await submitContactForm(values);
    setStatus({ type: result.success ? "success" : "error", message: result.message });
    if (result.success) {
      reset(defaultValues);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon (optional)</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Nachricht</Label>
        <Textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Honeypot field: hidden from sighted users and screen readers, real users never fill it in. */}
      <div className="absolute -left-[9999px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Firma</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              aria-invalid={!!errors.consent}
            />
            <Label htmlFor="consent" className="block text-sm font-normal leading-snug text-muted-foreground">
              Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage
              gemäß der{" "}
              <a href="/datenschutz" className="underline underline-offset-2 hover:text-foreground">
                Datenschutzerklärung
              </a>{" "}
              gespeichert und verarbeitet werden.
            </Label>
          </div>
        )}
      />
      {errors.consent && (
        <p className="text-sm text-destructive">{errors.consent.message}</p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Nachricht senden
      </Button>

      <div role="status" aria-live="polite">
        {status && (
          <p
            className={
              status.type === "success"
                ? "text-sm font-medium text-primary"
                : "text-sm font-medium text-destructive"
            }
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
