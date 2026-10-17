"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MenuCategory } from "@/types/venue";

/**
 * Highlights from the venue's menu. Only categories that contain confirmed dishes are passed in,
 * and only confirmed dishes are drawn. With a single category the tabs are omitted.
 */
export function MenuTabs({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const cat = categories[active];
  const items = cat.items.filter((i) => i.verified);

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
      {categories.length > 1 && (
        <div role="tablist" aria-label="Menu highlights" className="flex flex-wrap gap-2">
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
                  on ? "border-sun bg-sun text-abyss" : "border-white/35 text-ivory hover:border-ivory"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={cat.id}
            role={categories.length > 1 ? "tabpanel" : "group"}
            id={`panel-${cat.id}`}
            aria-labelledby={categories.length > 1 ? `tab-${cat.id}` : undefined}
            aria-label={categories.length > 1 ? undefined : cat.name}
            tabIndex={0}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 md:grid-cols-12"
          >
            <div className="md:col-span-5">
              <h3 className="display text-5xl sm:text-6xl">{cat.name}</h3>
              <p className="mt-4 max-w-[30ch] text-lg text-ivory/85">{cat.blurb}</p>
            </div>
            <ul className="md:col-span-7">
              {items.map((item) => (
                <li
                  key={item.name}
                  className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-white/15 py-5 first:pt-0"
                >
                  <div>
                    <p className="display text-3xl">{item.name}</p>
                    {item.description && <p className="mt-1 text-ivory/85">{item.description}</p>}
                  </div>
                  {item.price !== undefined && (
                    <p className="self-start pt-1 text-xl text-sun">{`₹${item.price}`}</p>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
