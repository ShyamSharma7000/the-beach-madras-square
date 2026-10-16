"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const D =
  "M0 60 C 80 20, 160 20, 240 60 S 400 100, 480 60 S 640 20, 720 60 S 880 100, 960 60 S 1120 20, 1200 60 S 1360 100, 1440 60";

/** A single line that draws itself as the story section scrolls past. */
export function WaveLine() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0.02, 1]);

  return (
    <div ref={ref} aria-hidden="true" className="mt-14 h-24 w-full sm:mt-20 sm:h-32">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <path d={D} fill="none" stroke="#12394A" strokeOpacity={0.18} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <motion.path
          d={D}
          fill="none"
          stroke="#B4401A"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduce ? 1 : draw }}
        />
      </svg>
    </div>
  );
}
