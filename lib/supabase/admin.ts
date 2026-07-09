import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS — only ever import this
 * from server actions / route handlers, never from client components.
 * The `server-only` import makes any accidental client-bundle import
 * fail at build time rather than leaking the key at runtime.
 */
export function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase ist nicht konfiguriert: SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen als Server-Umgebungsvariablen gesetzt sein (siehe .env.example)."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
