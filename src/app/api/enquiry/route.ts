import { parseEnquiry } from "@/lib/enquiry";
import { sendEnquiryEmail } from "@/lib/mail";
import { createRateLimiter } from "@/lib/rateLimit";

const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const MAX_BODY = 8_000;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  // Same-origin only.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ error: "forbidden" }, 403);
    } catch {
      return json({ error: "forbidden" }, 403);
    }
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(ip)) return json({ error: "rate_limited" }, 429);

  if (!process.env.RESEND_API_KEY || !process.env.ENQUIRY_TO_EMAIL) {
    return json({ error: "not_configured" }, 503);
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY) return json({ error: "too_large" }, 413);

  const text = await request.text();
  if (text.length > MAX_BODY) return json({ error: "too_large" }, 413);

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const parsed = parseEnquiry(raw);
  if (!parsed.ok) return json({ error: "invalid", fields: parsed.errors }, 422);

  // Bots get the same answer as people, but nothing is sent.
  if (parsed.bot) return json({ ok: true });

  const sent = await sendEnquiryEmail(parsed.data);
  if (!sent) return json({ error: "send_failed" }, 502);
  return json({ ok: true });
}
