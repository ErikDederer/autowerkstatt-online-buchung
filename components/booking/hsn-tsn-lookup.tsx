"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  EXAMPLE_HSN_TSN,
  isValidHsn,
  isValidTsn,
  lookupVehicleByHsnTsn,
} from "@/lib/booking/vehicle-lookup";

const DECODE_DELAY_MS = 400;

export type HsnTsnLookupProps = {
  onDecoded: (result: { make: string; model: string }) => void;
};

export function HsnTsnLookup({ onDecoded }: HsnTsnLookupProps) {
  const [hsn, setHsn] = useState("");
  const [tsn, setTsn] = useState("");
  const [isDecoding, setIsDecoding] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const canDecode = isValidHsn(hsn) && isValidTsn(tsn) && !isDecoding;

  const handleDecode = () => {
    if (!canDecode) return;
    setIsDecoding(true);
    setStatus(null);

    setTimeout(() => {
      const result = lookupVehicleByHsnTsn(hsn, tsn);
      if (result) {
        onDecoded(result);
        setStatus({ type: "success", message: `Erkannt: ${result.make} ${result.model}` });
      } else {
        setStatus({
          type: "error",
          message: "Schlüsselnummer nicht erkannt. Bitte Marke und Modell unten manuell eingeben.",
        });
      }
      setIsDecoding(false);
    }, DECODE_DELAY_MS);
  };

  return (
    <div className="rounded-lg border border-dashed p-3">
      <p className="text-xs font-medium text-muted-foreground">
        Schnell ausfüllen per KBA-Schlüsselnummer (aus dem Fahrzeugschein, Feld 2.1 / 2.2)
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor="hsn" className="text-xs text-muted-foreground">
            HSN
          </Label>
          <Input
            id="hsn"
            value={hsn}
            onChange={(e) => setHsn(e.target.value)}
            placeholder={EXAMPLE_HSN_TSN.hsn}
            maxLength={4}
            inputMode="numeric"
            className="w-20 font-mono uppercase"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tsn" className="text-xs text-muted-foreground">
            TSN
          </Label>
          <Input
            id="tsn"
            value={tsn}
            onChange={(e) => setTsn(e.target.value)}
            placeholder={EXAMPLE_HSN_TSN.tsn}
            maxLength={3}
            className="w-20 font-mono uppercase"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          disabled={!canDecode}
          onClick={handleDecode}
        >
          {isDecoding ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="size-4" aria-hidden="true" />
          )}
          Fahrzeug ermitteln
        </Button>
      </div>
      {status && (
        <p
          role="status"
          className={`mt-2 text-xs font-medium ${
            status.type === "success" ? "text-primary" : "text-destructive"
          }`}
        >
          {status.message}
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground/70">
        Demo-Funktion mit begrenzter Beispieldatenbank, z. B. HSN {EXAMPLE_HSN_TSN.hsn} / TSN{" "}
        {EXAMPLE_HSN_TSN.tsn}. Keine Verbindung zum Kraftfahrt-Bundesamt.
      </p>
    </div>
  );
}
