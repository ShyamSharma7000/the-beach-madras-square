import Image from "next/image";
import { ArtTile } from "@/components/gallery/ArtTile";
import type { TileVariant } from "@/types/venue";

/** A cleared photograph when one exists, otherwise the illustrated tile. */
export function Media({
  src,
  alt,
  variant,
  idPrefix,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 50vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  variant: TileVariant;
  idPrefix: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return <ArtTile variant={variant} idPrefix={idPrefix} className={`${className} w-full`} />;
}
