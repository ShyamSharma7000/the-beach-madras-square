import type { VenueConfig } from "@/types/venue";

/**
 * Every fact below comes from public listings and must be confirmed with the
 * venue before launch. See docs/content-review.md.
 */
const BOOKING = "https://thebeach.madrassquare.com/the-beach-booking/";

export const theBeach: VenueConfig = {
  slug: "the-beach",
  name: "The Beach",
  byline: "by Madras Square",
  tagline: "Where the coast meets the table",
  description:
    "Continental, modern Indian, Asian and seafood, with the Bay of Bengal in front of you.",
  locationShort: "East Coast Road, Uthandi, Chennai",
  address: "1st Main Road, Uthandi, Chennai, Tamil Nadu 600119",
  phone: "+91 73056 69696",
  phoneHref: "tel:+917305669696",
  bookingUrl: BOOKING,
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Beach+by+Madras+Square+Uthandi+Chennai",
  // Intentionally undefined: hours are not published until the venue confirms them.
  hours: undefined,
  theme: { background: "#0A1C2A", foreground: "#EDF0EA", accent: "#F0643C" },
  media: {},
  story: [
    "The Beach sits on East Coast Road at Uthandi, where Chennai's coast road runs beside the Bay of Bengal.",
    "Some tables are indoors, some are open to the sea. Come for lunch with the light flat and bright, or time it for the hour when the water turns copper.",
    "The kitchen moves between continental, modern Indian, Asian and seafood, so a table of six can usually agree on something.",
  ],
  menuCategories: [
    {
      id: "continental",
      name: "Continental",
      blurb: "Grills, pastas and plates built for sharing.",
      items: [
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
      ],
    },
    {
      id: "indian",
      name: "Modern Indian",
      blurb: "Familiar flavours, plated with a lighter hand.",
      items: [
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
      ],
    },
    {
      id: "asian",
      name: "Asian",
      blurb: "Wok, steam and spice from across the region.",
      items: [
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
      ],
    },
    {
      id: "seafood",
      name: "Seafood",
      blurb: "Catch of the day, cooked the way the coast likes it.",
      items: [
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
        { name: "Dish name", description: "One line from the venue's own menu.", verified: false },
      ],
    },
  ],
  gallery: [
    { id: "g1", tile: "golden", aspect: "tall", alt: "Illustration of a low sun over a calm sea", caption: "Golden hour", placeholder: true },
    { id: "g2", tile: "table", aspect: "landscape", alt: "Illustration of a set table facing the water", caption: "A table facing the water", placeholder: true },
    { id: "g3", tile: "noon", aspect: "square", alt: "Illustration of bright midday light on the sea", caption: "Lunch light", placeholder: true },
    { id: "g4", tile: "dusk", aspect: "portrait", alt: "Illustration of a pink dusk sky over dark water", caption: "Dusk", placeholder: true },
    { id: "g5", tile: "shore", aspect: "landscape", alt: "Illustration of waves reaching a pale shoreline", caption: "The shoreline", placeholder: true },
    { id: "g6", tile: "night", aspect: "tall", alt: "Illustration of a starry sky over the sea", caption: "After dark", placeholder: true },
  ],
  occasions: [
    {
      id: "sea-view",
      title: "Sea-view dinners",
      body: "Ask for a table facing the water when you book.",
      tile: "golden",
      action: { label: "Reserve a table", href: BOOKING },
    },
    {
      id: "sunset",
      title: "Sunset visits",
      body: "Arrive an hour early and watch the sky change over the Bay.",
      tile: "dusk",
      action: { label: "Reserve a table", href: BOOKING },
    },
    {
      id: "groups",
      title: "Group tables",
      body: "A broad menu means everyone finds something they want.",
      tile: "table",
      action: { label: "Call the venue", href: "tel:+917305669696" },
    },
    {
      id: "celebrations",
      title: "Celebrations",
      body: "Birthdays and anniversaries by the sea. Talk to the team about your plans.",
      tile: "night",
      action: { label: "Call the venue", href: "tel:+917305669696" },
    },
  ],
};
