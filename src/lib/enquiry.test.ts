import { describe, expect, it } from "vitest";
import { MAX_FILL_MS, MIN_FILL_MS, parseEnquiry } from "./enquiry";
import { createRateLimiter } from "./rateLimit";

const valid = {
  name: "Asha Rao",
  phone: "+91 98765 43210",
  email: "",
  date: "",
  guests: "24",
  occasion: "group",
  message: "",
  consent: true,
  reference_code: "",
  elapsedMs: 20_000,
};

describe("parseEnquiry", () => {
  it("accepts a valid enquiry", () => {
    const r = parseEnquiry(valid);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.bot).toBe(false);
      expect(r.data.guests).toBe(24);
    }
  });

  it("returns field errors for missing and malformed input", () => {
    const r = parseEnquiry({ ...valid, name: "A", phone: "abc", guests: "0", consent: false });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["consent", "guests", "name", "phone"]);
    }
  });

  it("rejects an invalid email but allows an empty one", () => {
    expect(parseEnquiry({ ...valid, email: "nope" }).ok).toBe(false);
    expect(parseEnquiry({ ...valid, email: "a@b.in" }).ok).toBe(true);
  });

  it("rejects an out-of-range or non-numeric guest count", () => {
    expect(parseEnquiry({ ...valid, guests: "501" }).ok).toBe(false);
    expect(parseEnquiry({ ...valid, guests: "2.5" }).ok).toBe(false);
    expect(parseEnquiry({ ...valid, guests: "many" }).ok).toBe(false);
  });

  it("rejects an invalid date format", () => {
    expect(parseEnquiry({ ...valid, date: "17/10/2026" }).ok).toBe(false);
    expect(parseEnquiry({ ...valid, date: "2026-10-17" }).ok).toBe(true);
  });

  it("rejects an unknown occasion", () => {
    expect(parseEnquiry({ ...valid, occasion: "wedding" }).ok).toBe(false);
  });

  it("flags a filled honeypot as a bot, even when other fields are invalid", () => {
    const r1 = parseEnquiry({ ...valid, reference_code: "http://spam" });
    expect(r1.ok && r1.bot).toBe(true);
    const r2 = parseEnquiry({ reference_code: "x" });
    expect(r2.ok && r2.bot).toBe(true);
  });

  it("never treats a too-quick submission as a silent success", () => {
    const r = parseEnquiry({ ...valid, elapsedMs: MIN_FILL_MS - 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.elapsedMs).toMatch(/wait a moment/i);
  });

  it("accepts a submission right at the minimum time", () => {
    expect(parseEnquiry({ ...valid, elapsedMs: MIN_FILL_MS }).ok).toBe(true);
  });

  it("asks for a reload when the form is stale, rather than pretending to send", () => {
    const r = parseEnquiry({ ...valid, elapsedMs: MAX_FILL_MS + 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.elapsedMs).toMatch(/reload/i);
  });

  it("rejects a negative elapsed time", () => {
    expect(parseEnquiry({ ...valid, elapsedMs: -5 }).ok).toBe(false);
  });

  it("does not depend on the server clock", () => {
    // elapsedMs is measured on the visitor's device; a wrong server time cannot change the result.
    expect(parseEnquiry(valid).ok).toBe(true);
  });
});

describe("createRateLimiter", () => {
  it("blocks after the limit and recovers after the window", () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(allow("ip", 0)).toBe(true);
    expect(allow("ip", 10)).toBe(true);
    expect(allow("ip", 20)).toBe(false);
    expect(allow("other", 20)).toBe(true);
    expect(allow("ip", 1500)).toBe(true);
  });
});
