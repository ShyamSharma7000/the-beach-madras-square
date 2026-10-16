/** Time-of-day model for the hero scene. t runs 0 (morning) to 1 (after dark). */

type Stop = {
  t: number;
  top: string;
  bottom: string;
  sea: string;
  seaDeep: string;
  sun: string;
};

const STOPS: Stop[] = [
  { t: 0.0, top: "#5E9DBE", bottom: "#F1D9B6", sea: "#2B7088", seaDeep: "#164A5E", sun: "#FFF3D0" },
  { t: 0.3, top: "#3F8DBA", bottom: "#BDE0E6", sea: "#1F6A85", seaDeep: "#104558", sun: "#FFF8DC" },
  { t: 0.55, top: "#25446F", bottom: "#F7A15A", sea: "#17405A", seaDeep: "#0C2A3E", sun: "#FFC46B" },
  { t: 0.78, top: "#18264F", bottom: "#D4566A", sea: "#10283F", seaDeep: "#081A2B", sun: "#F0643C" },
  { t: 1.0, top: "#060E1F", bottom: "#1B2F52", sea: "#08141F", seaDeep: "#040C14", sun: "#E8EEF5" },
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: string, b: string, k: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * k);
  const g = Math.round(ag + (bg - ag) * k);
  const bl = Math.round(ab + (bb - ab) * k);
  return `rgb(${r}, ${g}, ${bl})`;
}

export type Sky = {
  top: string;
  bottom: string;
  sea: string;
  seaDeep: string;
  sun: string;
  /** Sun height above horizon in scene units; negative once it has set. */
  sunHeight: number;
  sunX: number;
  starOpacity: number;
  glowOpacity: number;
  label: string;
};

export const HORIZON_Y = 430;
const SUN_MAX_HEIGHT = 300;

export function skyAt(t: number): Sky {
  const c = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < STOPS.length - 2 && c > STOPS[i + 1].t) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const k = (c - a.t) / (b.t - a.t);

  const dayProgress = c / 0.8;
  const sunHeight = SUN_MAX_HEIGHT * Math.cos((Math.PI / 2) * dayProgress);
  const sunX = 560 + 320 * (c / 0.8);
  const glowOpacity = Math.max(0, Math.min(1, 1 - Math.abs(c - 0.62) / 0.3));
  const starOpacity = Math.max(0, Math.min(1, (c - 0.8) / 0.18));

  return {
    top: mix(a.top, b.top, k),
    bottom: mix(a.bottom, b.bottom, k),
    sea: mix(a.sea, b.sea, k),
    seaDeep: mix(a.seaDeep, b.seaDeep, k),
    sun: mix(a.sun, b.sun, k),
    sunHeight,
    sunX,
    starOpacity,
    glowOpacity,
    label: labelAt(c),
  };
}

export function labelAt(t: number): string {
  if (t < 0.15) return "Morning";
  if (t < 0.4) return "Afternoon";
  if (t < 0.68) return "Golden hour";
  if (t < 0.86) return "Dusk";
  return "After dark";
}
