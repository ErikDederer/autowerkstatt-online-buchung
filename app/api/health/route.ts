import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** Read-only readiness check: never returns booking records or credentials. */
export async function GET() {
  try {
    const { error } = await getSupabaseAdminClient()
      .from("booking_requests")
      .select("id", { head: true })
      .limit(1)
      .abortSignal(AbortSignal.timeout(8000));

    if (error) throw new Error("Database unavailable");

    return Response.json(
      { status: "ok", database: "connected" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "degraded", database: "disconnected" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
