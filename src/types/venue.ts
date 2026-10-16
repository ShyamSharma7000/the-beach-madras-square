export type MenuItem = {
  name: string;
  description?: string;
  price?: number;
  /** Only items with verified: true may ever be shown as real menu content. */
  verified: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  /** One line about the style of food. Must be confirmed with the venue. */
  blurb: string;
  items: MenuItem[];
};

export type GalleryItem = {
  id: string;
  /** Local file under /public once cleared; until then an illustrative tile. */
  src?: string;
  tile: TileVariant;
  alt: string;
  aspect: "portrait" | "landscape" | "square" | "tall";
  caption: string;
  credit?: string;
  /** true while the image is a stand-in and not a real photo of the venue. */
  placeholder: boolean;
};

export type TileVariant = "golden" | "noon" | "dusk" | "night" | "shore" | "table";

export type Occasion = {
  id: string;
  title: string;
  body: string;
  tile: TileVariant;
  action: { label: string; href: string };
};

export type VenueConfig = {
  slug: string;
  name: string;
  byline: string;
  tagline: string;
  description: string;
  locationShort: string;
  address: string;
  phone?: string;
  phoneHref?: string;
  bookingUrl?: string;
  directionsUrl: string;
  hours?: string;
  theme: {
    background: string;
    foreground: string;
    accent: string;
  };
  media: {
    heroImage?: string;
    heroVideo?: string;
  };
  story: string[];
  menuCategories: MenuCategory[];
  gallery: GalleryItem[];
  occasions: Occasion[];
};
