import { Phone } from "lucide-react";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";

export function Reserve() {
  return (
    <section id="reserve" className="relative bg-sea-glass py-24 text-abyss sm:py-32">
      <WaveEdge color="#0A1C2A" />
      <div className="wrap grid gap-10 md:grid-cols-12">
        <h2 className="display text-[clamp(3rem,8vw,7rem)] md:col-span-7">
          Reserve a table
        </h2>
        <div className="md:col-span-5 md:pt-3">
          <p className="max-w-[36ch] text-xl">
            Pick your date and party size on the venue&rsquo;s own booking page. For groups or
            celebrations, call the team and tell them what you have in mind.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={v.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-abyss text-foam hover:bg-tide"
            >
              Reserve a table
              <span className="sr-only"> (opens the venue&rsquo;s booking page in a new tab)</span>
            </a>
            <a href={v.phoneHref} className="btn btn-ghost-dark">
              <Phone size={18} aria-hidden="true" />
              Call {v.phone}
            </a>
          </div>
          <p className="mt-5 text-base text-abyss/80">
            Booking is completed on the venue&rsquo;s page. Nothing is confirmed on this site.
          </p>
        </div>
      </div>
    </section>
  );
}
