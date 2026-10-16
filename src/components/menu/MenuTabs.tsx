"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MenuCategory } from "@/types/venue";

export function MenuTabs({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const cat = categories[active];
  const hasVerified = cat.items.some((i) => i.verified);

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const last = categories.length - 1;
    let next = i;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Menu categories" className="flex flex-wrap gap-2">
        {categories.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={on}
              aria-controls={`panel-${c.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`min-h-11 rounded-full border px-5 text-base font-medium transition-colors ${
                on
                  ? "border-sun bg-sun text-abyss"
                  : "border-white/35 text-foam hover:border-foam"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="mt-10 min-h-[22rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={cat.id}
            role="tabpanel"
            id={`panel-${cat.id}`}
            aria-labelledby={`tab-${cat.id}`}
            tabIndex={0}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 md:grid-cols-12"
          >
            <div className="md:col-span-5">
              <h3 className="display text-5xl sm:text-6xl">{cat.name}</h3>
              <p className="mt-4 max-w-[30ch] text-lg text-foam/85">{cat.blurb}</p>
              {!hasVerified && (
                <p className="mt-8 max-w-[34ch] border-l-2 border-ember pl-4 text-base text-foam/85">
                  Sample layout. The venue&rsquo;s real dishes, descriptions and prices drop in
                  here from a single data file once they are confirmed.
                </p>
              )}
            </div>
            <ul className="md:col-span-7 md:col-start-6">
              {cat.items.map((item, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-white/15 py-5 first:pt-0"
                >
                  <div>
                    <p className={`display text-3xl ${item.verified ? "" : "text-foam/55"}`}>
                      {item.name}
                    </p>
                    {item.description && (
                      <p className={`mt-1 ${item.verified ? "text-foam/85" : "text-foam/55"}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                  <p className={`self-start pt-1 text-xl ${item.verified ? "text-sun" : "text-foam/45"}`}>
                    {item.verified && item.price !== undefined ? `₹${item.price}` : "₹ ___"}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
