import { headers } from "next/headers";
import { z } from "zod";
import { getChatTranscript, sendChatMessage, WerkplanApiError } from "@/lib/werkplan/client";

// A turn can take a while (model + tool round-trips in WerkPlan).
export const maxDuration = 60;

async function endUserIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.uuid().nullable().optional(),
  token: z.string().max(200).nullable().optional(),
  privacyAccepted: z.boolean().optional(),
});

function fail(err: unknown) {
  if (err instanceof WerkplanApiError) {
    return Response.json({ error: { code: err.code, message: err.message } }, { status: err.status });
  }
  console.error("[chat-proxy]", err instanceof Error ? err.message : err);
  return Response.json(
    { error: { code: "internal", message: "Der Chat ist gerade nicht erreichbar." } },
    { status: 502 }
  );
}

/**
 * Proxies the widget to WerkPlan's chat API, adding the workshop's site key
 * (server-only) and the visitor's IP for rate limiting.
 */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: { code: "invalid_body", message: "Ungültige Anfrage." } }, { status: 400 });
  }
  try {
    return Response.json(await sendChatMessage(parsed.data, await endUserIp()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return fail(err);
  }
}

export async function GET(request: Request) {
  const conversationId = new URL(request.url).searchParams.get("conversationId");
  const token = request.headers.get("x-chat-token");
  if (!conversationId || !token || !z.uuid().safeParse(conversationId).success) {
    return Response.json({ error: { code: "invalid_query", message: "Ungültige Anfrage." } }, { status: 400 });
  }
  try {
    return Response.json(await getChatTranscript(conversationId, token, await endUserIp()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return fail(err);
  }
}
