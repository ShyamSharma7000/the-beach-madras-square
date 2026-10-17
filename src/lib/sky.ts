/**
 * Time-of-day model for the hero scene.
 *
 * The Bay of Bengal lies east of Uthandi, so the view faces east. The sun rises out of the sea,
 * climbs out of the top of the frame by midday, and is gone by evening, when the sky over the
 * water glows pink with the afterglow of a sunset behind the viewer. At night the moon rises
 * out of the sea. t runs from 0 (sunrise) to 1 (after dark).
 */

type Stop = { t: number; top: string; bottom: string; sea: string; seaDeep: string };

const STOPS: Stop[] = [
  { t: 0.0, top: "#3B5B93", bottom: "#F9C08A", sea: "#3A5F7C", seaDeep: "#1A3650" },
  { t: 0.12, top: "#4D86B8", bottom: "#F8DDB4", sea: "#2F7292", seaDeep: "#164B63" },
  { t: 0.32, top: "#3F8CC6", bottom: "#CFE7EC", sea: "#247A98", seaDeep: "#124E66" },
  { t: 0.55, top: "#2D7CC0", bottom: "#A8D5E8", sea: "#1D6F90", seaDeep: "#0F4560" },
  { t: 0.72, top: "#3A4D85", bottom: "#F0987A", sea: "#2E4A6E", seaDeep: "#172A45" },
  { t: 0.86, top: "#182554", bottom: "#B3577A", sea: "#15294A", seaDeep: "#0A1730" },
  { t: 1.0, top: "#050C1C", bottom: "#17284C", sea: "#08141F", seaDeep: "#040A12" },
];

export const HORIZON_Y = 430;
export const SCENE_W = 1440;

/** After this point the sun has climbed out of the top of the frame. */
const SUN_OVERHEAD_AT = 0.6;
const MOON_RISES_AT = 0.8;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mix(a: string, b: string, k: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * k);
  const g = Math.round(ag + (bg - ag) * k);
  const bl = Math.round(ab + (bb - ab) * k);
  return `rgb(${r}, ${g}, ${bl})`;
}

export type Body = {
  kind: "sun" | "moon";
  x: number;
  /** Height above the horizon in scene units. */
  height: number;
  color: string;
  radius: number;
  opacity: number;
};

export type Glow = { x: number; y: number; r: number; color: string; opacity: number };

export type Sky = {
  top: string;
  bottom: string;
  sea: string;
  seaDeep: string;
  body: Body | null;
  glows: Glow[];
  starOpacity: number;
  /** Light glittering on the water. */
  reflect: { x: number; color: string; strength: number };
  label: string;
};

export function labelAt(t: number): string {
  if (t < 0.12) return "Sunrise";
  if (t < 0.34) return "Morning";
  if (t < 0.6) return "Midday";
  if (t < 0.86) return "Evening";
  return "After dark";
}

export function skyAt(t: number): Sky {
  const c = clamp01(t);

  let i = 0;
  while (i < STOPS.length - 2 && c > STOPS[i + 1].t) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const k = clamp01((c - a.t) / (b.t - a.t));

  // Sun: rises from the sea (height 0) and leaves the top of the frame.
  const u = clamp01(c / SUN_OVERHEAD_AT);
  const sunHeight = 560 * Math.sin((Math.PI / 2) * u);
  const sunVisible = c < SUN_OVERHEAD_AT && sunHeight < 470;
  const sunX = 690 + 70 * u;

  // Moon: rises out of the sea late in the evening.
  const m = clamp01((c - MOON_RISES_AT) / (1 - MOON_RISES_AT));
  // Peaks at 170 so on a phone the moon stays in the open sky below the "Follow the day" panel.
  const moonHeight = 170 * Math.sin((Math.PI / 2) * m);
  const moonOpacity = clamp01(m * 6);
  const moonX = 760;

  // Evening afterglow glows along the horizon with no sun in sight.
  const afterglow = Math.max(0, 1 - Math.abs(c - 0.74) / 0.16);

  let body: Body | null = null;
  const glows: Glow[] = [];
  let reflect = { x: sunX, color: "#FFE2A8", strength: 0 };

  if (sunVisible) {
    const color = mix("#FFB257", "#FFF4D2", clamp01(sunHeight / 200));
    body = { kind: "sun", x: sunX, height: sunHeight, color, radius: 48, opacity: 1 };
    glows.push({
      x: sunX,
      y: HORIZON_Y - sunHeight,
      r: 400,
      color,
      opacity: 0.95 - 0.5 * clamp01(sunHeight / 300),
    });
    reflect = { x: sunX, color, strength: clamp01(1 - sunHeight / 380) };
  }

  if (afterglow > 0) {
    glows.push({ x: 720, y: HORIZON_Y, r: 620, color: "#FF9A7A", opacity: 0.7 * afterglow });
    reflect = { x: 720, color: "#FFC3A8", strength: 0.3 * afterglow };
  }

  if (m > 0) {
    body = { kind: "moon", x: moonX, height: moonHeight, color: "#EAF1FB", radius: 34, opacity: moonOpacity };
    glows.push({
      x: moonX,
      y: HORIZON_Y - moonHeight,
      r: 260,
      color: "#CFDDF2",
      opacity: 0.4 * moonOpacity,
    });
    reflect = { x: moonX, color: "#EAF2FF", strength: 0.8 * moonOpacity };
  }

  return {
    top: mix(a.top, b.top, k),
    bottom: mix(a.bottom, b.bottom, k),
    sea: mix(a.sea, b.sea, k),
    seaDeep: mix(a.seaDeep, b.seaDeep, k),
    body,
    glows,
    starOpacity: clamp01((c - 0.8) / 0.14),
    reflect,
    label: labelAt(c),
  };
}
