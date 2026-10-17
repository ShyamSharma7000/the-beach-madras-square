"use client";

import { useEffect } from "react";
import { theBeach as v } from "@/content/venues/the-beach";

/**
 * A short brand reveal. It is CSS only, so it removes itself even if scripts fail. It is skipped
 * on repeat visits in the same session (the inline script in the root layout sets
 * data-intro="seen") and when the visitor prefers reduced motion.
 */
export function Intro() {
  useEffect(() => {
    try {
      sessionStorage.setItem("tb-intro", "1");
    } catch {
      /* storage can be unavailable; the intro will simply play again */
    }
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-mark">
        <svg viewBox="0 0 240 36" className="intro-wave" focusable="false">
          <path
            d="M2 18 C 22 2, 42 2, 62 18 S 102 34, 122 18 S 162 2, 182 18 S 222 34, 238 18"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        <p className="display intro-name">{v.name}</p>
        <p className="intro-by">{v.byline}</p>
      </div>
    </div>
  );
}
