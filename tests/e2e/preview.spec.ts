import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { WIDTHS, failStub, received, resetStub, skipIntro, uniqueIp, validEnquiry, watchProblems } from "./helpers";

const BOOKING = "https://thebeach.madrassquare.com/the-beach-booking/";

test.beforeEach(async ({ request }) => {
  await resetStub(request);
});

/* ------------------------------------------------------------------ basics */

test.describe("page basics", () => {
  for (const width of WIDTHS) {
    test(`no sideways scroll and no console problems at ${width}px`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 800 } });
      await skipIntro(ctx);
      const page = await ctx.newPage();
      const problems = watchProblems(page);
      await page.goto("/", { waitUntil: "networkidle" });
      const m = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(m.scroll, "page is wider than the screen").toBeLessThanOrEqual(m.client);
      expect(problems).toEqual([]);
      await ctx.close();
    });
  }

  test("preview metadata keeps the site out of search and names it a concept", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/design concept/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /East Coast Road/);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
    await expect(page.getByText("Independent design concept")).toBeVisible();
  });

  test("one h1, real landmarks, headings in order", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Where the coast");
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    const levels = await page.$$eval("h1,h2,h3,h4", (els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `heading jump at index ${i}`).toBeLessThanOrEqual(1);
    }
  });

  test("every call to action goes to the verified destination", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")!));
    expect(hrefs).toContain(BOOKING);
    expect(hrefs).toContain("tel:+917305669696");
    expect(hrefs).toContain("https://thebeach-food-menu.vercel.app/");
    expect(hrefs).toContain("https://madrassquare-liquor-menu.vercel.app/");
    expect(hrefs).toContain("https://www.instagram.com/madrassquare/");
    expect(hrefs.some((h) => h.startsWith("https://www.google.com/maps/search/"))).toBe(true);
    expect(hrefs).toContain("/privacy");
    // No link may go nowhere.
    expect(hrefs.filter((h) => h === "#" || h === "" || h.startsWith("javascript:"))).toEqual([]);
    // In-page anchors must all point at something that exists.
    for (const h of hrefs.filter((h) => h.startsWith("#") && h.length > 1)) {
      await expect(page.locator(h), `anchor ${h}`).toHaveCount(1);
    }
    // External links open safely.
    const bad = await page.$$eval('a[target="_blank"]', (els) =>
      (els as HTMLAnchorElement[])
        .filter((a) => !/noopener/.test(a.rel) || !/noreferrer/.test(a.rel))
        .map((a) => a.href),
    );
    expect(bad).toEqual([]);
  });

  test("nothing unverified is published as fact", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    const text = (await page.locator("body").innerText()).toLowerCase();
    // No invented social proof, prices or awards.
    const banned = [/★/, /\brated\b/, /\bratings?\b/, /\bawards?\b/, /best restaurant/, /cond[eé] nast/, /₹/, /\brs\.?\s?\d/, /testimonial/, /\breviews?\b/];
    for (const re of banned) expect(text, `found ${re}`).not.toMatch(re);
    // Hours are labelled as kitchen hours, never as opening hours.
    await expect(page.getByText("Kitchen hours").first()).toBeVisible();
    expect(text).not.toContain("opening hours:");
  });

  test("security headers are set and the framework is not advertised", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("robots, sitemap, share image and icon", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow:\s*\//);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("<loc>");
    const og = await request.get("/opengraph-image");
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");
    const icon = await request.get("/icon");
    expect(icon.status()).toBe(200);
    expect(icon.headers()["content-type"]).toContain("image/");
  });

  test("unknown address gives a helpful 404", async ({ page }) => {
    const res = await page.goto("/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /isn.t here/i })).toBeVisible();
    await page.getByRole("link", { name: "Back to The Beach" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("privacy page is complete and marked as a draft in preview", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1, name: "Privacy notice" })).toBeVisible();
    await expect(page.getByText("Draft. The venue must review")).toBeVisible();
    for (const h of ["What this website collects", "Where it goes", "Cookies and tracking"]) {
      await expect(page.getByRole("heading", { name: h })).toBeVisible();
    }
    await expect(page.getByText("Resend keeps its own record")).toBeVisible();
    await expect(page.getByRole("link", { name: "info@madrassquare.com" })).toHaveAttribute(
      "href",
      "mailto:info@madrassquare.com",
    );
  });
});

/* ------------------------------------------------------------------- intro */

test.describe("intro", () => {
  test("plays once, clears itself quickly, and is skipped on repeat visits", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".intro")).toBeVisible();
    // It must be gone well inside two seconds. Nobody waits on a fake loading screen.
    await expect(page.locator(".intro")).toBeHidden({ timeout: 2_600 });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-intro", "seen");
    await expect(page.locator(".intro")).toBeHidden();
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("is not shown at all, and entrance animations are off", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator(".intro")).toBeHidden();
      const names = await page.$$eval(".rise, .wave-drift, .glint", (els) =>
        [...new Set(els.map((e) => getComputedStyle(e).animationName))],
      );
      expect(names).toEqual(["none"]);
    });
  });

  test("entrance animations run when motion is allowed", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    const name = await page.locator("h1").evaluate((e) => getComputedStyle(e).animationName);
    expect(name).not.toBe("none");
  });
});

/* -------------------------------------------------------------- hero slider */

test("the sun slider works from the keyboard and announces the time of day", async ({ page }) => {
  await skipIntro(page);
  await page.goto("/");
  const slider = page.getByRole("slider", { name: "Follow the day" });
  const readout = page.locator("output");
  await slider.focus();
  await page.keyboard.press("Home");
  const first = (await readout.textContent())?.trim();
  await page.keyboard.press("End");
  const last = (await readout.textContent())?.trim();
  expect(first).toBeTruthy();
  expect(last).toBeTruthy();
  expect(last).not.toBe(first);
  await expect(slider).toHaveAttribute("aria-valuetext", last!);
});

/* --------------------------------------------------------------- navigation */

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test("links scroll to their sections and the header turns solid", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    const header = page.locator("header").first();
    const transparent = await header.evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(transparent).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Food and drink" }).click();
    await expect(page).toHaveURL(/#food$/);
    await expect(page.locator("#food")).toBeInViewport();
    await expect.poll(() => header.evaluate((e) => getComputedStyle(e).backgroundColor)).not.toMatch(/rgba\(0, 0, 0, 0\)/);
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test("menu opens, closes on a link, and Escape returns focus to the button", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeHidden();
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "Occasions" }).click();
    await expect(nav).toBeHidden();
    await expect(page).toHaveURL(/#occasions$/);

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(nav).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("occasion cards scroll sideways inside their own row, not the page", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    await page.locator("#occasions").scrollIntoViewIfNeeded();
    const row = page.getByRole("list", { name: "Occasions" });
    const m = await row.evaluate((e) => ({ scroll: e.scrollWidth, client: e.clientWidth, left: e.scrollLeft }));
    expect(m.scroll).toBeGreaterThan(m.client);
    // The first card must sit inside the page gutter, not flush against the screen edge.
    const first = await row.locator("li").first().boundingBox();
    expect(first!.x).toBeGreaterThanOrEqual(12);
    const doc = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    expect(doc).toBe(true);
  });
});

/* ------------------------------------------------------------------ gallery */

test("gallery viewer: opens, steps with the keyboard, closes with Escape, restores focus", async ({ page }) => {
  await skipIntro(page);
  await page.goto("/");
  const thumb = page.getByRole("button", { name: "Open image: Sunrise" });
  await thumb.scrollIntoViewIfNeeded();
  await thumb.click();
  const dialog = page.getByRole("dialog", { name: "Gallery viewer" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await expect(dialog.getByText("Sunrise")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("An evening table")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText("Sunrise")).toBeVisible();
  await dialog.getByRole("button", { name: "Previous" }).click();
  await expect(dialog.getByText("Moonrise")).toBeVisible(); // wraps to the last frame
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(thumb).toBeFocused();
});

/* --------------------------------------------------------- enquiry (form UI) */

async function fillValid(page: Page, over: Partial<Record<"name" | "phone" | "email" | "guests" | "message", string>> = {}) {
  await page.getByLabel("Your name").fill(over.name ?? "Asha Raman");
  await page.getByLabel("Phone number").fill(over.phone ?? "+91 98765 43210");
  await page.getByLabel(/^Email/).fill(over.email ?? "asha@example.test");
  await page.getByLabel("What is it about?").selectOption("group");
  await page.getByLabel("Number of guests").fill(over.guests ?? "24");
  await page.getByLabel(/^Anything the team/).fill(over.message ?? "Birthday lunch, two long tables if possible.");
  await page.getByRole("checkbox", { name: /privacy notice/i }).check();
}

test.describe("enquiry form", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.setExtraHTTPHeaders({ "x-forwarded-for": uniqueIp() });
    await skipIntro(page);
    await page.goto("/");
    await page.locator("#enquire").scrollIntoViewIfNeeded();
  });

  test("is shown instead of the call card when email delivery is configured", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Planning something bigger?" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
    await expect(page.getByText("Call the team", { exact: true })).toHaveCount(0);
  });

  test("every field has a label and the honeypot is invisible to people and screen readers", async ({ page }) => {
    const unlabeled = await page.$$eval("#enquire input:not([name=reference_code]), #enquire select, #enquire textarea", (els) =>
      els.filter((e) => !(e as HTMLInputElement).labels?.length).map((e) => (e as HTMLInputElement).name),
    );
    expect(unlabeled).toEqual([]);
    const trap = page.locator('input[name="reference_code"]');
    await expect(trap).toHaveAttribute("tabindex", "-1");
    expect(await trap.evaluate((e) => e.closest('[aria-hidden="true"]') !== null)).toBe(true);
    expect(await trap.evaluate((e) => e.getBoundingClientRect().right < 0)).toBe(true);
  });

  test("an empty form lists what to fix, moves focus there, and sends nothing", async ({ page, request }) => {
    await page.getByRole("button", { name: "Send enquiry" }).click();
    const alert = page.getByRole("alert").filter({ hasText: "before sending" });
    await expect(alert).toBeVisible();
    await expect(alert).toBeFocused();
    await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Your name")).toHaveAttribute("aria-describedby", "name-error");
    await expect(page.locator("#name-error")).toContainText("Enter your name");
    await expect(page.locator("#consent-error")).toBeVisible();
    expect(await received(request)).toHaveLength(0);
  });

  test("bad values get specific messages", async ({ page }) => {
    await fillValid(page, { phone: "abc", email: "not-an-email", guests: "900" });
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator("#phone-error")).toContainText("phone number we can call");
    await expect(page.locator("#email-error")).toContainText("valid email");
    await expect(page.locator("#guests-error")).toContainText("Call the venue");
  });

  test("a form sent within moments is refused with a way forward, never a false success", async ({ page, request }) => {
    await fillValid(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "very quick" })).toBeVisible();
    await expect(page.getByText("Enquiry sent")).toHaveCount(0);
    expect(await received(request)).toHaveLength(0);
  });

  test("a valid enquiry is emailed to the venue and confirmed honestly", async ({ page, request }) => {
    await fillValid(page);
    await page.waitForTimeout(3_300);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    const done = page.getByRole("status").filter({ hasText: "Enquiry sent" });
    await expect(done).toBeVisible();
    await expect(done).toContainText("not a confirmed booking");
    const sent = await received(request);
    expect(sent).toHaveLength(1);
    expect(sent[0].authorization).toBe("Bearer test-key");
    expect(sent[0].body.to).toEqual(["venue@example.test"]);
    expect(sent[0].body.subject).toContain("Large group");
    expect(sent[0].body.subject).toContain("24 guests");
    expect(sent[0].body.reply_to).toBe("asha@example.test");
    expect(sent[0].body.text).toContain("Asha Raman");
    expect(sent[0].body.text).toContain("+91 98765 43210");
    await page.getByRole("button", { name: "Send another enquiry" }).click();
    await expect(page.getByLabel("Your name")).toHaveValue("");
  });

  test("text typed into the form cannot inject markup into the email", async ({ page, request }) => {
    await fillValid(page, { name: "<img src=x onerror=alert(1)>", message: "<script>alert(1)</script>" });
    await page.waitForTimeout(3_300);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText("Enquiry sent")).toBeVisible();
    const html = (await received(request))[0].body.html;
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<script");
    expect(html).toContain("&lt;img");
    expect(html).toContain("&lt;script&gt;");
  });

  test("when the email service fails the visitor is told and offered the phone number", async ({ page, request }) => {
    await failStub(request, 500);
    await fillValid(page);
    await page.waitForTimeout(3_300);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    const fail = page.getByRole("alert").filter({ hasText: "couldn't send your enquiry" });
    await expect(fail).toBeVisible();
    await expect(fail.getByRole("link", { name: "+91 73056 69696" })).toHaveAttribute("href", "tel:+917305669696");
    await expect(page.getByText("Enquiry sent")).toHaveCount(0);
    // Their typing survives so they can try again.
    await expect(page.getByLabel("Your name")).toHaveValue("Asha Raman");
  });

  test("a bot that fills the hidden field looks successful but nothing is sent", async ({ page, request }) => {
    await fillValid(page);
    await page.locator('input[name="reference_code"]').evaluate((e: HTMLInputElement) => (e.value = "spam"));
    await page.waitForTimeout(3_300);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText("Enquiry sent")).toBeVisible();
    expect(await received(request)).toHaveLength(0);
  });

  test("the privacy link in the consent text opens the notice", async ({ page }) => {
    await page.locator("#enquire").getByRole("link", { name: "privacy notice" }).click();
    await expect(page).toHaveURL(/\/privacy$/);
  });
});

/* ------------------------------------------------------------- enquiry (API) */

test.describe("enquiry API", () => {
  const post = (request: import("@playwright/test").APIRequestContext, data: unknown, headers: Record<string, string> = {}) =>
    request.post("/api/enquiry", { data, headers: { "x-forwarded-for": uniqueIp(), ...headers } });

  test("accepts a valid enquiry and answers with no-store", async ({ request }) => {
    const res = await post(request, validEnquiry());
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(res.headers()["cache-control"]).toContain("no-store");
    expect(await received(request)).toHaveLength(1);
  });

  test("refuses requests from another origin", async ({ request }) => {
    const res = await post(request, validEnquiry(), { origin: "https://evil.example" });
    expect(res.status()).toBe(403);
    expect(await received(request)).toHaveLength(0);
  });

  test("refuses malformed and oversized bodies", async ({ request }) => {
    const bad = await request.post("/api/enquiry", {
      data: Buffer.from("{not json"),
      headers: { "content-type": "application/json", "x-forwarded-for": uniqueIp() },
    });
    expect(bad.status()).toBe(400);
    const big = await post(request, validEnquiry({ message: "x".repeat(9_000) }));
    expect(big.status()).toBe(413);
  });

  test("names every invalid field and sends nothing", async ({ request }) => {
    const res = await post(request, {});
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(Object.keys(body.fields).sort()).toEqual(["consent", "elapsedMs", "guests", "name", "occasion", "phone"]);
    expect(await received(request)).toHaveLength(0);
  });

  test("a filled honeypot is answered like success but not delivered", async ({ request }) => {
    const res = await post(request, validEnquiry({ reference_code: "x", name: "" }));
    expect(res.status()).toBe(200);
    expect(await received(request)).toHaveLength(0);
  });

  test("reports a delivery failure as an error, never as success", async ({ request }) => {
    await failStub(request, 500);
    const res = await post(request, validEnquiry());
    expect(res.status()).toBe(502);
    expect((await res.json()).error).toBe("send_failed");
  });

  test("slows repeat senders after five attempts", async ({ request }) => {
    const ip = uniqueIp();
    const codes: number[] = [];
    for (let i = 0; i < 6; i++) codes.push((await post(request, validEnquiry(), { "x-forwarded-for": ip })).status());
    expect(codes).toEqual([200, 200, 200, 200, 200, 429]);
  });

  test("only POST is allowed", async ({ request }) => {
    expect((await request.get("/api/enquiry")).status()).toBe(405);
  });
});

/* ----------------------------------------------------------- without scripts */

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  test("the content, links and form are all still there and the intro clears itself", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Find us on the coast road" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Planning something bigger?" })).toBeAttached();
    await expect(page.getByRole("link", { name: /^Reserve a table/ }).first()).toHaveAttribute("href", /.+/);
    await expect(page.locator(".intro")).toBeHidden({ timeout: 3_000 });
    const text = await page.locator("main").innerText();
    expect(text).toContain("11:00 am to 10:30 pm");
  });
});

/* ------------------------------------------------------------ keyboard & a11y */

test("the first Tab lands on a visible skip link that works", async ({ page }) => {
  await skipIntro(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("every interactive element shows a focus indicator", async ({ page }) => {
  await skipIntro(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const missing: string[] = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { tag: el.tagName, text: (el.textContent ?? "").trim().slice(0, 30), width: parseFloat(s.outlineWidth), style: s.outlineStyle };
    });
    if (r.style === "none" || r.width < 2) missing.push(`${r.tag} ${r.text}`);
  }
  expect(missing).toEqual([]);
});

test.describe("accessibility scan (axe, WCAG 2.2 AA)", () => {
  const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
  const scan = async (page: Page) => {
    const r = await new AxeBuilder({ page }).withTags(tags).analyze();
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 4).map((n) => n.target.join(" ")) }));
  };

  test("home page, desktop", async ({ page }) => {
    await skipIntro(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    expect(await scan(page)).toEqual([]);
  });

  test("home page, phone", async ({ page }) => {
    await skipIntro(page);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    expect(await scan(page)).toEqual([]);
  });

  test("phone menu open", async ({ page }) => {
    await skipIntro(page);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    expect(await scan(page)).toEqual([]);
  });

  test("gallery viewer open", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Open image: Midday" }).click();
    expect(await scan(page)).toEqual([]);
  });

  test("enquiry form with errors showing", async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "before sending" })).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });

  test("privacy page", async ({ page }) => {
    await page.goto("/privacy");
    expect(await scan(page)).toEqual([]);
  });
});
