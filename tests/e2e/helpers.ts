import type { APIRequestContext, BrowserContext, Page } from "@playwright/test";

export const WIDTHS = [360, 390, 768, 1024, 1440] as const;
export const STUB = "http://127.0.0.1:4010";

/** Skip the brand intro so it never covers the page during a test. Tests of the intro itself do not use this. */
export async function skipIntro(ctx: BrowserContext | Page) {
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem("tb-intro", "1");
    } catch {
      /* ignore */
    }
  });
}

/** Collects anything that would show up as a console error, warning, failed request or bad response. */
export function watchProblems(page: Page) {
  const problems: string[] = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) problems.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => problems.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  page.on("response", (r) => {
    if (r.status() >= 400) problems.push(`http ${r.status()}: ${r.url()}`);
  });
  return problems;
}

let counter = 0;
/** A different fake client address per call, so the rate limiter does not couple unrelated tests. */
export function uniqueIp() {
  counter += 1;
  return `10.${Math.floor(counter / 250) % 250}.${counter % 250}.${Math.floor(Math.random() * 250) + 1}`;
}

export const resetStub = (request: APIRequestContext) => request.post(`${STUB}/__reset`);
export const failStub = (request: APIRequestContext, status = 500) =>
  request.post(`${STUB}/__mode`, { data: { status } });
export const received = async (request: APIRequestContext) =>
  (await (await request.get(`${STUB}/__received`)).json()) as Array<{
    authorization?: string;
    body: { from: string; to: string[]; subject: string; text: string; html: string; reply_to?: string };
  }>;

export const validEnquiry = (over: Record<string, unknown> = {}) => ({
  name: "Asha Raman",
  phone: "+91 98765 43210",
  email: "asha@example.test",
  date: "",
  guests: "24",
  occasion: "group",
  message: "Birthday lunch, two long tables if possible.",
  consent: true,
  reference_code: "",
  elapsedMs: 8000,
  ...over,
});
