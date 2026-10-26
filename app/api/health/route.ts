import { getWorkshopInfo } from "@/lib/werkplan/client";

export const dynamic = "force-dynamic";

/** Readiness check: can the site reach WerkPlan's booking API? Never returns customer data or credentials. */
export async function GET() {
  try {
    await getWorkshopInfo();
    return Response.json(
      { status: "ok", bookingApi: "connected" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "degraded", bookingApi: "disconnected" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
