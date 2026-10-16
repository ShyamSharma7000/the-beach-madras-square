"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { theBeach as v } from "@/content/venues/the-beach";

const LINKS = [
  { href: "#story", label: "The place" },
  { href: "#food", label: "Food and drink" },
  { href: "#gallery", label: "Gallery" },
  { href: "#occasions", label: "Occasions" },
  { href: "#visit", label: "Find us" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const bg = solid || open ? "bg-abyss/95 backdrop-blur-sm" : "bg-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${bg}`}
    >
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <a href="#top" className="flex items-baseline gap-2 no-underline" aria-label={`${v.name} ${v.byline}, back to top`}>
          <span className="display text-3xl">{v.name}</span>
          <span className="hidden text-sm text-foam/80 sm:inline">{v.byline}</span>
        </a>

        <nav
          id="site-nav"
          aria-label="Main"
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col gap-1 bg-abyss/95 px-[var(--gutter)] pb-6 pt-2 md:static md:flex md:flex-row md:items-center md:gap-7 md:bg-transparent md:p-0`}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base text-foam/90 no-underline hover:text-sun md:py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href={v.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-2 md:mt-0 md:min-h-10 md:px-5 md:py-2"
          >
            Reserve a table
            <span className="sr-only"> (opens the venue&rsquo;s booking page in a new tab)</span>
          </a>
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-white/30 md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
    </header>
  );
}
