import { HeroScene } from "@/components/motion/HeroScene";
import { theBeach as v } from "@/content/venues/the-beach";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <HeroScene>
      <div className="wrap pb-10 sm:pb-16">
        <p className="rise mb-4 text-base font-medium text-foam/90" style={{ "--i": 0 } as React.CSSProperties}>
          {v.name} {v.byline}, {v.locationShort}
        </p>
        <h1
          className="display rise max-w-[14ch] text-[clamp(3.4rem,10.5vw,9rem)]"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          Where the coast
          <br />
          <em className="italic">meets the table</em>
        </h1>
        <p
          className="rise mt-6 max-w-[34ch] text-lg text-foam/90 sm:text-xl"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          {v.description}
        </p>
        <div
          className="rise mt-8 flex flex-col gap-3 sm:flex-row"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          <a href="#reserve" className="btn btn-primary">
            Reserve a table
          </a>
          <a href="#story" className="btn btn-ghost">
            Explore the experience
            <ChevronDown size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </HeroScene>
  );
}
