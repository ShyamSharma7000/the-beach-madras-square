import { HORIZON_Y_TILE, tileSky } from "@/lib/tile";
import { COLOR } from "@/lib/tokens";
import type { TileVariant } from "@/types/venue";

const W = 400;
const H = 500;

function waves(y: number, amp: number, count: number) {
  const step = W / count;
  let d = `M0 ${y}`;
  for (let i = 0; i < count; i++) {
    const x0 = i * step;
    d += ` Q${x0 + step / 2} ${y - amp} ${x0 + step} ${y}`;
  }
  return d;
}

/**
 * Original, procedurally drawn stand-in artwork that shares the hero's east-facing sky.
 * Replace with the venue's own photography once it is cleared.
 */
export function ArtTile({
  variant,
  idPrefix,
  className,
}: {
  variant: TileVariant;
  idPrefix: string;
  className?: string;
}) {
  const s = tileSky(variant);
  const id = `${idPrefix}-${variant}`;
  const bodyY = s.body ? HORIZON_Y_TILE - s.body.height : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.top} />
          <stop offset="1" stopColor={s.bottom} />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.sea} />
          <stop offset="1" stopColor={s.seaDeep} />
        </linearGradient>
        {s.body && (
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor={s.body.color} stopOpacity="0.8" />
            <stop offset="1" stopColor={s.body.color} stopOpacity="0" />
          </radialGradient>
        )}
        {s.afterglow > 0 && (
          <radialGradient id={`${id}-after`}>
            <stop offset="0" stopColor="#FF9A7A" stopOpacity={0.75 * s.afterglow} />
            <stop offset="1" stopColor="#FF9A7A" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      <rect width={W} height={HORIZON_Y_TILE + 1} fill={`url(#${id}-sky)`} />

      {s.stars && (
        <g fill="#E8EEF5">
          {Array.from({ length: 28 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 131 + 23) % W}
              cy={(i * 71 + 11) % (HORIZON_Y_TILE - 30)}
              r={0.8 + ((i * 3) % 4) * 0.4}
            />
          ))}
        </g>
      )}

      {s.afterglow > 0 && (
        <ellipse cx={W / 2} cy={HORIZON_Y_TILE} rx={300} ry={170} fill={`url(#${id}-after)`} />
      )}

      {s.body && (
        <>
          <circle cx={s.body.x} cy={bodyY} r={170} fill={`url(#${id}-glow)`} />
          <circle cx={s.body.x} cy={bodyY} r={s.body.radius} fill={s.body.color} />
        </>
      )}

      <rect y={HORIZON_Y_TILE} width={W} height={H - HORIZON_Y_TILE} fill={`url(#${id}-sea)`} />

      {s.body &&
        [0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={s.body!.x - (14 + i * 9)}
            y={HORIZON_Y_TILE + 10 + i * 22}
            width={28 + i * 18}
            height={2.5}
            rx={1.2}
            fill={s.body!.color}
            opacity={Math.max(0.15, 0.7 - i * 0.12)}
          />
        ))}

      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={waves(HORIZON_Y_TILE + 36 + i * 38, 5 + i * 2, 6 + i)}
          fill="none"
          stroke={COLOR.ivory}
          strokeOpacity={0.18 + i * 0.07}
          strokeWidth={1.4}
        />
      ))}

      {variant === "table" && (
        <g fill={COLOR.abyss}>
          <rect x={96} y={344} width={208} height={9} rx={3} />
          <rect x={112} y={353} width={7} height={70} />
          <rect x={281} y={353} width={7} height={70} />
          <rect x={150} y={392} width={44} height={6} rx={3} />
          <rect x={163} y={398} width={5} height={36} />
          <rect x={206} y={392} width={44} height={6} rx={3} />
          <rect x={219} y={398} width={5} height={36} />
          <rect x={196} y={318} width={8} height={26} rx={2} fill={COLOR.sun} />
          <ellipse cx={200} cy={312} rx={6} ry={9} fill={COLOR.sun} />
        </g>
      )}

      {variant === "shore" && (
        <path
          d={`M0 ${H} L0 ${H - 70} Q100 ${H - 110} 200 ${H - 84} T400 ${H - 96} L400 ${H} Z`}
          fill={COLOR.sand}
          opacity={0.92}
        />
      )}
    </svg>
  );
}
