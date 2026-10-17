import "server-only";
import { OCCASION_LABELS, type EnquiryInput } from "@/lib/enquiry";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Sends the enquiry to the venue through Resend. Returns false on any failure. */
export async function sendEnquiryEmail(data: EnquiryInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL || "The Beach enquiries <onboarding@resend.dev>";
  if (!key || !to) return false;

  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email || "not given"],
    ["Date wanted", data.date || "not given"],
    ["Guests", String(data.guests)],
    ["About", OCCASION_LABELS[data.occasion]],
    ["Message", data.message || "none"],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:sans-serif">${rows
    .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  try {
    // RESEND_API_URL exists so tests can point at a local stub. Leave it unset in production.
    const res = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        subject: `Website enquiry: ${OCCASION_LABELS[data.occasion]}, ${data.guests} guests`,
        text,
        html,
        ...(data.email ? { reply_to: data.email } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
