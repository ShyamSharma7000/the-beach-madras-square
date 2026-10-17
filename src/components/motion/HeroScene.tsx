"use client";

import { useId, useMemo, useState } from "react";
import { HORIZON_Y, SCENE_W, skyAt } from "@/lib/sky";
import { COLOR } from "@/lib/tokens";
import { HeroScrim } from "./HeroScrim";

const W = SCENE_W;
const H = 900;

function wavePath(baseline: number, amp: number, period: number, phase = 0) {
  const pts: string[] = [];
  for (let x = 0; x <= W * 2; x += 24) {
    const y = baseline + amp * Math.sin(((x + phase) / period) * Math.PI * 2);
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

const WAVES = [
  { d: wavePath(500, 4, 720), op: 0.16, speed: "70s", w: 1.2 },
  { d: wavePath(548, 6, 480, 120), op: 0.2, speed: "52s", w: 1.4 },
  { d: wavePath(612, 8, 360, 60), op: 0.24, speed: "40s", w: 1.6 },
  { d: wavePath(700, 11, 720, 300), op: 0.3, speed: "34s", w: 1.8 },
  { d: wavePath(800, 14, 480, 40), op: 0.36, speed: "28s", w: 2 },
];

const STARS = Array.from({ length: 46 }, (_, i) => {
  const x = (i * 337 + 91) % W;
  const y = (i * 149 + 37) % (HORIZON_Y - 60);
  const r = 0.8 + ((i * 7) % 5) * 0.35;
  return { x, y, r };
});

const GLINTS = Array.from({ length: 11 }, (_, i) => ({
  y: HORIZON_Y + 14 + i * 26,
  w: 24 + i * 15,
  delay: `${(i * 0.37) % 2.4}s`,
  speed: `${2.2 + (i % 4) * 0.5}s`,
}));

/** Start just after sunrise: the sun a little above the sea. */
const START = 0.08;

export function HeroScene({ children }: { children: React.ReactNode }) {
  const [t, setT] = useState(START);
  const uid = useId().replace(/:/g, "");
  const sky = useMemo(() => skyAt(t), [t]);
  const body = sky.body;
  const bodyY = body ? HORIZON_Y - body.height : 0;
  const rangeId = `${uid}-time`;
  const cloudOpacity = 0.3 * (1 - sky.starOpacity);

  return (
    <section
      aria-label="The Beach at the water's edge"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      style={{ background: sky.top }}
    >
      <svg
        className="absolute inset-0 -z-10 h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky.top} />
            <stop offset="1" stopColor={sky.bottom} />
          </linearGradient>
          <linearGradient id={`${uid}-sea`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky.sea} />
            <stop offset="1" stopColor={sky.seaDeep} />
          </linearGradient>
          {sky.glows.map((g, i) => (
            <radialGradient key={i} id={`${uid}-glow-${i}`}>
              <stop offset="0" stopColor={g.color} stopOpacity="0.85" />
              <stop offset="0.35" stopColor={g.color} stopOpacity="0.3" />
              <stop offset="1" stopColor={g.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        <rect width={W} height={HORIZON_Y + 1} fill={`url(#${uid}-sky)`} />

        <g opacity={sky.starOpacity}>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#E8EEF5" />
          ))}
        </g>

        {sky.glows.map((g, i) => (
          <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={`url(#${uid}-glow-${i})`} opacity={g.opacity} />
        ))}

        <g opacity={cloudOpacity}>
          <ellipse cx={380} cy={190} rx={260} ry={9} fill={sky.bottom} />
          <ellipse cx={1010} cy={140} rx={330} ry={11} fill={sky.bottom} />
          <ellipse cx={1180} cy={300} rx={210} ry={7} fill={sky.bottom} />
        </g>

        {body && (
          <g opacity={body.opacity}>
            <circle cx={body.x} cy={bodyY} r={body.radius} fill={body.color} />
            {body.kind === "moon" && (
              <>
                <circle cx={body.x - 11} cy={bodyY - 7} r={7} fill="#C5D2E6" opacity={0.55} />
                <circle cx={body.x + 12} cy={bodyY + 9} r={5} fill="#C5D2E6" opacity={0.5} />
                <circle cx={body.x + 6} cy={bodyY - 14} r={3.5} fill="#C5D2E6" opacity={0.45} />
              </>
            )}
          </g>
        )}

        <rect y={HORIZON_Y} width={W} height={H - HORIZON_Y} fill={`url(#${uid}-sea)`} />
        <rect
          y={HORIZON_Y}
          width={W}
          height={2}
          fill={sky.reflect.color}
          opacity={0.12 + 0.3 * sky.reflect.strength}
        />

        <g opacity={sky.reflect.strength}>
          {GLINTS.map((g, i) => (
            <rect
              key={i}
              className="glint"
              x={sky.reflect.x - g.w / 2}
              y={g.y}
              width={g.w}
              height={3}
              rx={1.5}
              fill={sky.reflect.color}
              style={{ "--delay": g.delay, "--speed": g.speed } as React.CSSProperties}
            />
          ))}
        </g>

        {WAVES.map((w, i) => (
          <g key={i} className="wave-drift" style={{ "--speed": w.speed } as React.CSSProperties}>
            <path d={w.d} fill="none" stroke={COLOR.ivory} strokeOpacity={w.op} strokeWidth={w.w} />
          </g>
        ))}
      </svg>

      <HeroScrim />

      <div className="wrap pointer-events-none relative pt-24 sm:pt-28">
        <div className="pointer-events-auto w-full rounded-3xl border border-white/20 bg-[rgb(10_28_42/0.72)] px-5 pb-1 pt-4 sm:ml-auto sm:max-w-xs">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={rangeId} className="text-sm font-semibold">
              Follow the day
            </label>
            <output htmlFor={rangeId} className="text-sm text-sun" aria-live="polite">
              {sky.label}
            </output>
          </div>
          <input
            id={rangeId}
            className="sun-range"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            aria-valuetext={sky.label}
          />
        </div>
      </div>

      <div className="relative mt-auto">{children}</div>
    </section>
  );
}
