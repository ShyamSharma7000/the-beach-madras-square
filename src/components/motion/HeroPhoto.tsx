import Image from "next/image";
import type { VenueConfig } from "@/types/venue";
import { HeroScrim } from "./HeroScrim";

/**
 * Hero for when the venue supplies cleared media. The still image is always rendered (it is the
 * poster and the reduced-motion fallback); a video, if supplied, plays muted on top of it.
 */
export function HeroPhoto({
  media,
  children,
}: {
  media: VenueConfig["media"];
  children: React.ReactNode;
}) {
  const { heroImage, heroVideo } = media;
  return (
    <section
      aria-label="The Beach at the water's edge"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-abyss"
    >
      {heroImage && (
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}
      {heroVideo && (
        <video
          className="hero-video absolute inset-0 -z-10 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroImage?.src}
          aria-hidden="true"
        >
          <source src={heroVideo.src} type={heroVideo.type} />
        </video>
      )}
      <HeroScrim />
      <div className="relative mt-auto">{children}</div>
    </section>
  );
}
