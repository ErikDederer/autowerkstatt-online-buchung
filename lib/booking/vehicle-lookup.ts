/**
 * Mock HSN/TSN (KBA-Schlüsselnummer) decoder — a small local lookup table,
 * not a live connection to the Kraftfahrt-Bundesamt. A real integration
 * would need a paid third-party vehicle-data API and a server-side proxy
 * for the API key; out of scope for this concept project.
 */

export type VehicleLookupResult = {
  make: string;
  model: string;
};

const HSN_TSN_TABLE: Record<string, VehicleLookupResult> = {
  "0603|AGV": { make: "Volkswagen", model: "Golf VII" },
  "0603|ACJ": { make: "Volkswagen", model: "Passat B8" },
  "0005|ASN": { make: "BMW", model: "3er (F30)" },
  "0005|APT": { make: "BMW", model: "1er (F20)" },
  "1313|AWB": { make: "Mercedes-Benz", model: "C-Klasse (W205)" },
  "1313|AJL": { make: "Mercedes-Benz", model: "A-Klasse (W177)" },
  "0588|ABA": { make: "Audi", model: "A4 (B9)" },
  "0035|AVZ": { make: "Opel", model: "Astra K" },
  "8566|ABC": { make: "Ford", model: "Focus (Mk4)" },
  "7107|ABD": { make: "Škoda", model: "Octavia (5E)" },
  "1004|ABE": { make: "Renault", model: "Clio V" },
};

export const EXAMPLE_HSN_TSN = { hsn: "0603", tsn: "AGV" };

function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}

export function isValidHsn(value: string): boolean {
  return /^\d{4}$/.test(value.trim());
}

export function isValidTsn(value: string): boolean {
  return /^[A-Za-z0-9]{3}$/.test(value.trim());
}

export function lookupVehicleByHsnTsn(hsn: string, tsn: string): VehicleLookupResult | null {
  const key = `${normalizeCode(hsn)}|${normalizeCode(tsn)}`;
  return HSN_TSN_TABLE[key] ?? null;
}
