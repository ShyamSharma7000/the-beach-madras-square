import Link from "next/link";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";
import { launched } from "@/lib/site";
import { COLOR } from "@/lib/tokens";

const link = "underline underline-offset-4 hover:text-sun";

export function Footer({ joinColor = COLOR.ivory }: { joinColor?: string }) {
  return (
    <footer className="relative bg-abyss pb-10 pt-24 text-ivory">
      <WaveEdge color={joinColor} />
      <div className="wrap grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="display text-5xl">{v.name}</p>
          <p className="mt-1 text-ivory/80">{v.byline}</p>
        </div>

        <div className="text-ivory/90">
          <address className="not-italic">
            <p className="font-semibold text-ivory">Find us</p>
            <p className="mt-2 max-w-[28ch]">{v.address}</p>
            <p className="mt-3">
              <a href={v.phoneHref} className={link}>
                {v.phone}
              </a>
            </p>
          </address>
          <p className="mt-6 font-semibold text-ivory">{v.hoursLabel}</p>
          <dl className="mt-2 space-y-1 text-sm">
            {v.hours.map((h) => (
              <div key={h.label} className="grid grid-cols-[auto_1fr] gap-x-4">
                <dt className="text-ivory/75">{h.label}</dt>
                <dd>{h.ranges.map((r) => r.display).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Footer" className="text-ivory/90">
          <p className="font-semibold text-ivory">Visit</p>
          <ul className="mt-2 space-y-2">
            <li>
              <a href={v.bookingUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Reserve a table
                <span className="sr-only"> (opens the venue&rsquo;s booking page in a new tab)</span>
              </a>
            </li>
            {v.menus.map((m) => (
              <li key={m.id}>
                <a href={m.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {m.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            {v.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a href="https://www.madrassquare.com/" target="_blank" rel="noopener noreferrer" className={link}>
                Madras Square
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <Link href="/privacy" className={link}>
                Privacy notice
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="wrap mt-12 border-t border-white/15 pt-6 text-sm text-ivory/75">
        {launched ? (
          <p>
            &copy; {v.name} {v.byline}. All rights reserved.
          </p>
        ) : (
          <p className="max-w-[70ch]">
            Independent design concept. This is not the official website of {v.name} {v.byline}.
            Artwork on this page is illustrative and will be replaced with the venue&rsquo;s own
            photography once approved.
          </p>
        )}
      </div>
    </footer>
  );
}
