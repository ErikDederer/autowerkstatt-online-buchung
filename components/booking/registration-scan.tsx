"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { scanVehicleDocument } from "@/lib/actions/scan";
import type { RegistrationFields } from "@/lib/werkplan/client";

/**
 * Optional shortcut in the booking form: photograph the Fahrzeugschein
 * (Teil I) and the vehicle fields are filled in. The customer checks them
 * before booking; nothing is saved without the booking.
 */
export function RegistrationScan({ onScanned }: { onScanned: (scanId: string, fields: RegistrationFields) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [agreed, setAgreed] = useState(false);
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  return (
    <div className="space-y-3 rounded-xl border border-dashed bg-muted/30 p-4">
      <p className="text-sm font-medium">Schneller: Fahrzeugschein fotografieren</p>
      <p className="text-sm text-muted-foreground">
        Wir lesen Kennzeichen, Marke, Modell und Schlüsselnummern automatisch aus. Ihre Angaben zu Halter und Anschrift
        werden nicht übernommen.
      </p>
      <label className="flex items-start gap-2 text-sm">
        <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
        <span>
          Ich bin einverstanden, dass das Foto zum Auslesen per KI verarbeitet und spätestens 30 Tage nach dem Termin
          gelöscht wird (siehe Datenschutzerklärung).
        </span>
      </label>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-label="Foto der Zulassungsbescheinigung Teil I"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setStatus(null);
          start(async () => {
            const form = new FormData();
            form.append("file", file);
            const r = await scanVehicleDocument(form);
            if (!r.ok) return setStatus({ type: "error", message: r.message });
            onScanned(r.scanId, r.fields);
            setStatus(
              r.message
                ? { type: "error", message: r.message }
                : { type: "success", message: "Daten übernommen – bitte prüfen Sie die Felder unten." }
            );
          });
        }}
      />
      <Button type="button" variant="outline" disabled={!agreed || pending} onClick={() => fileRef.current?.click()} className="gap-2">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Camera className="size-4" aria-hidden />}
        {pending ? "Wird gelesen…" : "Foto aufnehmen oder auswählen"}
      </Button>
      {status && (
        <p role="status" className={status.type === "success" ? "flex items-center gap-1.5 text-sm text-emerald-700" : "text-sm text-destructive"}>
          {status.type === "success" && <CheckCircle2 className="size-4" aria-hidden />}
          {status.message}
        </p>
      )}
    </div>
  );
}
