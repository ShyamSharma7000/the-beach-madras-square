import { describe, expect, it } from "vitest";
import { theBeach as v } from "./venues/the-beach";

/** Guards that keep unconfirmed content out of the site. See docs/content-review.md. */
describe("venue content", () => {
  const text = JSON.stringify(v).toLowerCase();

  it("contains no placeholder or invented menu content", () => {
    for (const banned of ["dish name", "₹ ___", "catch of the day", "one line from the venue"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("does not claim things the venue has not confirmed", () => {
    for (const banned of ["award", "rated", "review", "testimonial", "modern indian", "celebration", "birthday"]) {
      expect(text, `unexpected claim: ${banned}`).not.toContain(banned);
    }
  });

  it("only ships menu highlights that are confirmed", () => {
    for (const c of v.menuCategories) {
      for (const i of c.items) expect(i.verified, `${c.name}: ${i.name}`).toBe(true);
    }
  });

  it("uses real photographs only when they are marked as such", () => {
    for (const g of v.gallery) {
      if (g.src) expect(g.placeholder).toBe(false);
      if (g.placeholder) expect(g.src).toBeUndefined();
    }
  });

  it("has well-formed hours with the venue's real structure", () => {
    const covered = v.hours.flatMap((h) => h.days);
    expect(new Set(covered).size).toBe(7);
    for (const h of v.hours) {
      for (const r of h.ranges) {
        expect(r.opens).toMatch(/^\d{2}:\d{2}$/);
        expect(r.closes).toMatch(/^\d{2}:\d{2}$/);
        expect(r.opens < r.closes).toBe(true);
      }
    }
  });

  it("does not publish opening hours until the venue confirms them", () => {
    expect(v.hoursLabel).toBe("Kitchen hours");
    expect(typeof v.hoursAreOpeningHours).toBe("boolean");
  });

  it("has a phone link that matches the displayed number", () => {
    expect(v.phoneHref.replace(/\D/g, "")).toBe(v.phone.replace(/\D/g, ""));
  });

  it("links only to https pages, plain tel links, or page anchors", () => {
    const hrefs = [
      v.bookingUrl,
      v.directionsUrl,
      ...v.menus.map((m) => m.href),
      ...v.social.map((s) => s.href),
      ...v.occasions.map((o) => o.action.href),
    ];
    for (const h of hrefs) expect(h).toMatch(/^(https:\/\/|tel:\+\d+$|#[a-z-]+$)/);
  });

  it("labels group-wide social accounts as group accounts", () => {
    for (const s of v.social) {
      if (s.scope === "group") expect(s.label.toLowerCase()).toContain("madras square");
    }
  });

  it("keeps the booking limit consistent with the occasion copy", () => {
    const groups = v.occasions.find((o) => o.id === "groups");
    expect(groups?.body).toContain(`2 to ${v.maxOnlineGuests}`);
  });
});
