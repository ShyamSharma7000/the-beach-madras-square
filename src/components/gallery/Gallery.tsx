"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Media } from "@/components/gallery/Media";
import type { GalleryItem } from "@/types/venue";

const ASPECT: Record<GalleryItem["aspect"], string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  tall: "aspect-[3/5]",
};

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (dir: 1 | -1) =>
    setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length));

  const current = index === null ? null : items[index];

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {items.map((item, i) => (
          <li key={item.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-xl"
              aria-label={`Open image: ${item.caption}`}
            >
              <Media
                src={item.src}
                alt=""
                variant={item.tile}
                idPrefix={`grid-${item.id}`}
                className={`${ASPECT[item.aspect]} w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]`}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/80 to-transparent px-4 pb-3 pt-10 text-left text-base text-ivory">
                {item.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Gallery viewer"
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialogRef.current && setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto w-[min(92vw,56rem)] max-w-none bg-transparent p-0 text-ivory backdrop:bg-abyss/90"
      >
        {current && (
          <motion.figure
            key={current.id}
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div role="img" aria-label={current.alt} className="overflow-hidden rounded-2xl">
              <Media
                src={current.src}
                alt={current.alt}
                variant={current.tile}
                idPrefix={`lb-${current.id}`}
                sizes="(min-width: 900px) 56rem, 92vw"
                className={current.src ? "aspect-[4/3] max-h-[72vh] w-full" : "max-h-[72vh] w-full"}
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <span className="display text-3xl">{current.caption}</span>
              {current.placeholder && (
                <span className="text-sm text-ivory/80">Illustration</span>
              )}
              {current.credit && <span className="text-sm text-ivory/80">{current.credit}</span>}
            </figcaption>
          </motion.figure>
        )}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-2">
            <button type="button" onClick={() => step(-1)} className="btn btn-ghost !min-h-11 !px-4">
              <ChevronLeft size={18} aria-hidden="true" />
              Previous
            </button>
            <button type="button" onClick={() => step(1)} className="btn btn-ghost !min-h-11 !px-4">
              Next
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIndex(null)}
            className="btn btn-primary !min-h-11 !px-4"
            autoFocus
          >
            <X size={18} aria-hidden="true" />
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
