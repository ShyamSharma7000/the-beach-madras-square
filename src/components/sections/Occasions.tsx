import { ArtTile } from "@/components/gallery/ArtTile";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";

export function Occasions() {
  return (
    <section id="occasions" className="relative bg-abyss py-24 sm:py-32">
      <WaveEdge color="#EDF0EA" />
      <div className="wrap">
        <h2 className="display max-w-[14ch] text-[clamp(2.6rem,6vw,5rem)]">
          Come for the reason you have
        </h2>
      </div>
      <ul
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-color:#7cc4b4_transparent]"
        aria-label="Occasions"
      >
        {v.occasions.map((o) => (
          <li key={o.id} className="w-[72vw] max-w-[19rem] shrink-0 snap-start">
            <ArtTile
              variant={o.tile}
              idPrefix={`occ-${o.id}`}
              className="aspect-[4/5] w-full rounded-t-[999px]"
            />
            <h3 className="display mt-5 text-3xl">{o.title}</h3>
            <p className="mt-2 text-foam/85">{o.body}</p>
            <a
              href={o.action.href}
              {...(o.action.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="mt-4 inline-block min-h-11 py-2 font-semibold text-sun underline underline-offset-4"
            >
              {o.action.label}
              <span className="sr-only"> for {o.title.toLowerCase()}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
