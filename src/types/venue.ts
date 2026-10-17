/** A dish the venue has confirmed. Only confirmed dishes may ever be shown as menu content. */
export type MenuItem = {
  name: string;
  description?: string;
  price?: number;
  verified: boolean;
};

/** Optional highlights. Leave empty until the venue confirms dishes and prices. */
export type MenuCategory = {
  id: string;
  name: string;
  blurb: string;
  items: MenuItem[];
};

/** A menu the venue publishes itself. */
export type MenuLink = {
  id: "food" | "drinks";
  label: string;
  note: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  /** "group" is the Madras Square account, not a profile specific to this venue. */
  scope: "venue" | "group";
};

export type TileVariant = "sunrise" | "shore" | "midday" | "evening" | "night" | "table";

export type GalleryItem = {
  id: string;
  /** Path under /public once a cleared photograph exists, e.g. /images/the-beach/gallery/sunrise.jpg */
  src?: string;
  tile: TileVariant;
  alt: string;
  aspect: "portrait" | "landscape" | "square" | "tall";
  caption: string;
  credit?: string;
  /** true while the image is an illustration and not a real photo of the venue. */
  placeholder: boolean;
};

export type Occasion = {
  id: string;
  title: string;
  body: string;
  tile: TileVariant;
  /** Cleared photograph; falls back to the illustrated tile. */
  image?: { src: string; alt: string };
  action: { label: string; href: string };
};

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type HoursBlock = {
  /** Display label, for example "Monday to Friday". */
  label: string;
  days: Weekday[];
  /** 24h "HH:MM" pairs; more than one range means a break between services. */
  ranges: Array<{ opens: string; closes: string; display: string }>;
};

export type VenueConfig = {
  slug: string;
  name: string;
  byline: string;
  tagline: string;
  /** Short line used in the hero. */
  description: string;
  /** Used for the meta description and sharing previews. */
  seoDescription: string;
  locationShort: string;
  address: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  phoneHref: string;
  bookingUrl: string;
  /** Online booking accepts this many guests at most; larger parties call or send an enquiry. */
  maxOnlineGuests: number;
  directionsUrl: string;
  hoursLabel: string;
  hours: HoursBlock[];
  hoursSource: string;
  hoursCheckedOn: string;
  /**
   * The venue's pages list kitchen hours. Keep false until the venue confirms the same times are
   * its opening hours; structured data only publishes opening hours when this is true.
   */
  hoursAreOpeningHours: boolean;
  /** Menus the venue publishes on its own pages. */
  menus: MenuLink[];
  social: SocialLink[];
  theme: {
    background: string;
    foreground: string;
    accent: string;
  };
  /** Cleared hero media. When absent the illustrated hero scene is used. */
  media: {
    heroImage?: { src: string; alt: string };
    heroVideo?: { src: string; type: "video/mp4" | "video/webm" };
  };
  story: string[];
  menuCategories: MenuCategory[];
  gallery: GalleryItem[];
  occasions: Occasion[];
};
