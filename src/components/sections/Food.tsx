import { ArrowUpRight } from "lucide-react";
import { MenuTabs } from "@/components/menu/MenuTabs";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";
import { COLOR } from "@/lib/tokens";

export function Food() {
  // Dishes only appear once the venue has confirmed them. Until then the menus are linked.
  const highlights = v.menuCategories.filter((c) => c.items.some((i) => i.verified));

  return (
    <section id="food" className="relative bg-tide py-24 sm:py-32">
      <WaveEdge color={COLOR.ivory} />
      <div className="wrap grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Asian and continental, plus the bar</h2>
          <p className="mt-5 max-w-[34ch] text-lg text-ivory/85">
            The venue keeps its menus on its own pages. Open them to see what the kitchen and the
            bar are serving.
          </p>
        </div>

        <ul className="md:col-span-7">
          {v.menus.map((m) => (
            <li key={m.id} className="border-b border-ivory/25 first:border-t">
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-7 no-underline"
              >
                <span className="flex items-end gap-4">
                  <span className="display text-[clamp(2.4rem,5vw,4.2rem)] leading-none transition-colors duration-200 group-hover:text-sun">
                    {m.label}
                  </span>
                  <span aria-hidden="true" className="mb-2 flex-1 border-b border-dotted border-ivory/40" />
                  <span
                    aria-hidden="true"
                    className="mb-1 grid size-11 shrink-0 place-items-center rounded-full border border-ivory/45 transition-colors duration-200 group-hover:border-sun group-hover:bg-sun group-hover:text-abyss"
                  >
                    <ArrowUpRight size={20} />
                  </span>
                </span>
                <span className="mt-3 block text-ivory/80">{m.note}</span>
                <span className="sr-only">(opens the venue&rsquo;s {m.label.toLowerCase()} in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {highlights.length > 0 && (
        <div className="wrap mt-20">
          <MenuTabs categories={highlights} />
        </div>
      )}
    </section>
  );
}
