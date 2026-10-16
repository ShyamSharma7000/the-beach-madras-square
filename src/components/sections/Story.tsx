import { WaveLine } from "@/components/motion/WaveLine";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";

export function Story() {
  return (
    <section id="story" className="relative bg-foam py-24 text-abyss sm:py-32">
      <WaveEdge color="#EDF0EA" />
      <div className="wrap grid gap-12 md:grid-cols-12">
        <h2 className="display text-[clamp(2.6rem,6.2vw,5.4rem)] md:col-span-7">
          A table with the Bay of Bengal in front of it
        </h2>
        <div className="space-y-5 text-lg leading-8 text-ink-soft md:col-span-5 md:col-start-8 md:pt-4">
          {v.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <div className="wrap">
        <WaveLine />
      </div>
    </section>
  );
}
