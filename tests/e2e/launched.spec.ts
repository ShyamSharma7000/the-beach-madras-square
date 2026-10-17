import { expect, test } from "@playwright/test";
import { skipIntro } from "./helpers";

// Built with NEXT_PUBLIC_LAUNCHED=true and NEXT_PUBLIC_SITE_URL=https://example.test.
// This is what the live site does once the venue has approved it.

const SITE = "https://example.test";

test("search engines are invited in and told where the sitemap is", async ({ request, page }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Allow:\s*\//);
  expect(robots).toMatch(/Disallow:\s*\/api\//);
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${SITE}</loc>`);
  expect(sitemap).toContain(`<loc>${SITE}/privacy</loc>`);

  await page.goto("/");
  const robotsMeta = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robotsMeta).not.toMatch(/noindex/);
  // A root address is the same with or without the trailing slash.
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/example\.test\/?$/);
  await expect(page).toHaveTitle(/Beachfront|Restaurant|Uthandi/i);
  await expect(page).not.toHaveTitle(/design concept/i);
});

test("the concept wording is gone and a normal footer line replaces it", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Independent design concept")).toHaveCount(0);
  await expect(page.locator("footer")).toContainText("All rights reserved");
  await page.goto("/privacy");
  await expect(page.getByText("Draft. The venue must review")).toHaveCount(0);
});

test("structured data carries only confirmed details", async ({ page }) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const ld = JSON.parse(raw!);
  expect(ld["@type"]).toBe("Restaurant");
  expect(ld.name).toBe("The Beach by Madras Square");
  expect(ld.telephone).toBe("+91 73056 69696");
  expect(ld.address).toMatchObject({ addressLocality: "Chennai", postalCode: "600119", addressCountry: "IN" });
  expect(ld.hasMenu).toBe("https://thebeach-food-menu.vercel.app/");
  // Never published without proof.
  for (const key of ["aggregateRating", "review", "priceRange", "image", "award", "openingHoursSpecification", "sameAs"]) {
    expect(ld, `unexpected ${key}`).not.toHaveProperty(key);
  }
});

test("illustrated stand-ins are not shown to the public when there are no real photographs", async ({ page }) => {
  await skipIntro(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.locator("#gallery")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Gallery" })).toHaveCount(0);
  await expect(page.getByText(/illustrated stand-ins/i)).toHaveCount(0);
});

test("the enquiry form works in launched mode", async ({ page }) => {
  await skipIntro(page);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
});
