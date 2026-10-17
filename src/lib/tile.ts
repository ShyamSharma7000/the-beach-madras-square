import { mix, skyAt } from "@/lib/sky";
import type { TileVariant } from "@/types/venue";

export const HORIZON_Y_TILE = 300;

type TileBody = { kind: "sun" | "moon"; x: number; height: number; radius: number } | null;

const TILES: Record<TileVariant, { t: number; body: TileBody; afterglow: number }> = {
  sunrise: { t: 0.03, body: { kind: "sun", x: 210, height: 38, radius: 34 }, afterglow: 0 },
  shore: { t: 0.2, body: { kind: "sun", x: 110, height: 150, radius: 28 }, afterglow: 0 },
  midday: { t: 0.48, body: { kind: "sun", x: 250, height: 215, radius: 30 }, afterglow: 0 },
  evening: { t: 0.73, body: null, afterglow: 1 },
  night: { t: 1, body: { kind: "moon", x: 270, height: 140, radius: 24 }, afterglow: 0 },
  table: { t: 0.76, body: null, afterglow: 0.8 },
};

/** Colours and light sources for the small illustrated tiles. They share the hero's sky model. */
export function tileSky(variant: TileVariant) {
  const def = TILES[variant];
  const sky = skyAt(def.t);
  const bodyColor =
    def.body?.kind === "moon"
      ? "#EAF1FB"
      : def.body
        ? mix("#FFB257", "#FFF4D2", Math.min(1, def.body.height / 200))
        : null;
  return {
    top: sky.top,
    bottom: sky.bottom,
    sea: sky.sea,
    seaDeep: sky.seaDeep,
    body: def.body && bodyColor ? { ...def.body, color: bodyColor } : null,
    afterglow: def.afterglow,
    stars: variant === "night",
  };
}
