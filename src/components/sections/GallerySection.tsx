import { Gallery } from "@/components/gallery/Gallery";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";

export function GallerySection() {
  return (
    <section id="gallery" className="relative bg-foam py-24 text-abyss sm:py-32">
      <WaveEdge color="#12394A" />
      <div className="wrap">
        <div className="mb-12 grid gap-4 md:grid-cols-12">
          <h2 className="display text-[clamp(2.6rem,6vw,5rem)] md:col-span-7">
            One day, from first light to last
          </h2>
          <p className="max-w-[40ch] text-lg text-ink-soft md:col-span-4 md:col-start-9 md:self-end">
            Illustrated stand-ins for now. Tap any frame to open it. The venue&rsquo;s own
            photography replaces these in the final build.
          </p>
        </div>
        <Gallery items={v.gallery} />
      </div>
    </section>
  );
}
