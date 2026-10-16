import { skyAt } from "@/lib/sky";
import type { TileVariant } from "@/types/venue";

export const HORIZON_Y_TILE = 300;

const T: Record<TileVariant, number> = {
  golden: 0.55,
  noon: 0.28,
  dusk: 0.76,
  night: 1,
  shore: 0.08,
  table: 0.6,
};

const SUN_X: Record<TileVariant, number> = {
  golden: 250,
  noon: 120,
  dusk: 290,
  night: 280,
  shore: 100,
  table: 200,
};

export function tileSky(variant: TileVariant) {
  const sky = skyAt(T[variant]);
  const h = variant === "night" ? 150 : Math.max(8, sky.sunHeight * 0.55);
  return {
    top: sky.top,
    bottom: sky.bottom,
    sea: sky.sea,
    seaDeep: sky.seaDeep,
    sun: sky.sun,
    sunX: SUN_X[variant],
    sunHeight: h,
    stars: variant === "night",
  };
}
