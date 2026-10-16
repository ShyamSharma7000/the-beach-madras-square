import { MapPin } from "lucide-react";
import { ArtTile } from "@/components/gallery/ArtTile";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";

export function Location() {
  return (
    <section id="visit" className="relative bg-foam py-24 text-abyss sm:py-32">
      <WaveEdge color="#7CC4B4" />
      <div className="wrap grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Find us on the coast road</h2>
          <address className="mt-8 text-xl not-italic leading-8">
            <p className="font-semibold">
              {v.name} {v.byline}
            </p>
            <p className="max-w-[28ch]">{v.address}</p>
          </address>
          <p className="mt-6 max-w-[40ch] text-ink-soft">
            {v.hours ??
              "Opening hours will be listed here once the venue confirms them. Call ahead to check today's timings."}
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
          <ArtTile
            variant="shore"
            idPrefix="loc"
            className="aspect-[4/5] w-full rounded-t-[999px]"
          />
        </div>
      </div>
    </section>
  );
}
