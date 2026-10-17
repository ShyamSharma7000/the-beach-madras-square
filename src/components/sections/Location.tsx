import { MapPin } from "lucide-react";
import { Media } from "@/components/gallery/Media";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";
import { COLOR } from "@/lib/tokens";

export function Location() {
  return (
    <section id="visit" className="relative bg-ivory py-24 text-abyss sm:py-32">
      <WaveEdge color={COLOR.abyss} />
      <div className="wrap grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Find us on the coast road</h2>
          <address className="mt-8 text-xl not-italic leading-8">
            <p className="font-semibold">
              {v.name} {v.byline}
            </p>
            <p className="max-w-[28ch]">{v.address}</p>
          </address>
          <h3 className="mt-8 text-lg font-semibold">{v.hoursLabel}</h3>
          <dl className="mt-2 max-w-[28rem] divide-y divide-abyss/15 border-y border-abyss/15">
            {v.hours.map((h) => (
              <div key={h.label} className="grid grid-cols-[1fr_auto] gap-x-6 py-3">
                <dt>{h.label}</dt>
                <dd className="text-right">
                  {h.ranges.map((r) => (
                    <span key={r.display} className="block">
                      {r.display}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 max-w-[40ch] text-sm text-ink-soft">
            Listed on the venue’s booking page. Call ahead to check today’s timings.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={v.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MapPin size={18} aria-hidden="true" />
              Get directions
              <span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
            <a href={v.phoneHref} className="btn btn-ghost-dark">
              Call {v.phone}
            </a>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Media
            variant="shore"
            alt=""
            idPrefix="loc"
            sizes="(min-width: 768px) 40vw, 90vw"
            className="aspect-[4/5] w-full rounded-t-[999px]"
          />
        </div>
      </div>
    </section>
  );
}
