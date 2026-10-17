import { describe, expect, it } from "vitest";
import { HORIZON_Y, labelAt, skyAt } from "./sky";
import { tileSky } from "./tile";
import type { TileVariant } from "@/types/venue";

describe("sky model (the coast faces east)", () => {
  it("starts with the sun on the horizon, rising out of the sea", () => {
    const s = skyAt(0);
    expect(s.body?.kind).toBe("sun");
    expect(s.body?.height).toBeCloseTo(0, 5);
  });

  it("raises the sun steadily through the morning", () => {
    const heights = [0, 0.1, 0.2, 0.3].map((t) => skyAt(t).body?.height ?? -1);
    for (let i = 1; i < heights.length; i++) expect(heights[i]).toBeGreaterThan(heights[i - 1]);
  });

  it("never draws a setting sun: once it is overhead it does not come back", () => {
    for (let t = 0.5; t <= 1; t += 0.01) {
      expect(skyAt(t).body?.kind).not.toBe("sun");
    }
  });

  it("has no sun in the evening, only an afterglow over the water", () => {
    const s = skyAt(0.74);
    expect(s.body).toBeNull();
    expect(s.glows.length).toBeGreaterThan(0);
    expect(s.glows[0].y).toBe(HORIZON_Y);
  });

  it("raises the moon out of the sea after dark", () => {
    const early = skyAt(0.82).body;
    const late = skyAt(1).body;
    expect(early?.kind).toBe("moon");
    expect(late?.kind).toBe("moon");
    expect(late!.height).toBeGreaterThan(early!.height);
    expect(late!.opacity).toBe(1);
  });

  it("shows stars only after dusk", () => {
    expect(skyAt(0.5).starOpacity).toBe(0);
    expect(skyAt(1).starOpacity).toBeGreaterThan(0.9);
  });

  it("keeps the light source in view on narrow phone crops", () => {
    // A portrait phone shows roughly x 510 to 930 of the 1440 wide scene.
    for (let t = 0; t <= 1; t += 0.05) {
      const b = skyAt(t).body;
      if (b) {
        expect(b.x).toBeGreaterThan(600);
        expect(b.x).toBeLessThan(840);
      }
    }
  });

  it("clamps out-of-range input", () => {
    expect(() => skyAt(-1)).not.toThrow();
    expect(() => skyAt(2)).not.toThrow();
    expect(skyAt(-1).label).toBe("Sunrise");
    expect(skyAt(2).label).toBe("After dark");
  });

  it("labels the times of day", () => {
    expect(labelAt(0.05)).toBe("Sunrise");
    expect(labelAt(0.2)).toBe("Morning");
    expect(labelAt(0.45)).toBe("Midday");
    expect(labelAt(0.74)).toBe("Evening");
    expect(labelAt(0.95)).toBe("After dark");
  });
});

describe("illustrated tiles", () => {
  const variants: TileVariant[] = ["sunrise", "shore", "midday", "evening", "night", "table"];

  it("defines every variant", () => {
    for (const v of variants) expect(() => tileSky(v)).not.toThrow();
  });

  it("only shows stars on the night tile and a moon only there", () => {
    for (const v of variants) {
      expect(tileSky(v).stars).toBe(v === "night");
      expect(tileSky(v).body?.kind === "moon").toBe(v === "night");
    }
  });

  it("draws the evening tiles with an afterglow and no sun", () => {
    expect(tileSky("evening").body).toBeNull();
    expect(tileSky("evening").afterglow).toBeGreaterThan(0);
    expect(tileSky("table").body).toBeNull();
  });
});
