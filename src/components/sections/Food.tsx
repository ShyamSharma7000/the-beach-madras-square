import { MenuTabs } from "@/components/menu/MenuTabs";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";

export function Food() {
  return (
    <section id="food" className="relative bg-tide py-24 sm:py-32">
      <WaveEdge color="#EDF0EA" />
      <div className="wrap">
        <h2 className="display max-w-[16ch] text-[clamp(2.6rem,6vw,5rem)]">
          Four kitchens, one table
        </h2>
        <p className="mt-5 max-w-[48ch] text-lg text-foam/85">
          Continental, modern Indian, Asian and seafood, so a big group can order without a
          negotiation.
        </p>
        <div className="mt-12">
          <MenuTabs categories={v.menuCategories} />
        </div>
        <p className="mt-10">
          <a
            href="https://www.madrassquare.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-sun"
          >
            See the full menu on the Madras Square site
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </section>
  );
}
