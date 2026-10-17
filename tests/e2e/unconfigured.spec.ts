import { expect, test } from "@playwright/test";
import { skipIntro, uniqueIp, validEnquiry } from "./helpers";

// Built with no email settings. Nothing may pretend to send.

test("the enquiry form is replaced by a plain call card", async ({ page }) => {
  await skipIntro(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Planning something bigger?" })).toBeVisible();
  await expect(page.getByText("Call the team", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send enquiry" })).toHaveCount(0);
  await expect(page.locator('form input[name="reference_code"]')).toHaveCount(0);
  await expect(page.locator("#enquire").getByRole("link", { name: /Call \+91 73056 69696/ })).toHaveAttribute(
    "href",
    "tel:+917305669696",
  );
});

test("the API says it is not set up instead of accepting data", async ({ request }) => {
  const res = await request.post("/api/enquiry", { data: validEnquiry(), headers: { "x-forwarded-for": uniqueIp() } });
  expect(res.status()).toBe(503);
  expect((await res.json()).error).toBe("not_configured");
});

test("the rest of the page is unaffected and the layout does not overflow", async ({ page }) => {
  await skipIntro(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "networkidle" });
  const ok = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  expect(ok).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Where the coast");
});
