import { COLOR } from "@/lib/tokens";
import type { VenueConfig } from "@/types/venue";

/**
 * Source notes. Checked on 17 Oct 2026 against the venue's official pages.
 *
 * Confirmed on official pages:
 * - Name, address, phone, kitchen hours, and the Food menu and Drinks menu links:
 *   thebeach.madrassquare.com/the-beach-booking
 * - Online booking form: its guest selector offers 2 to 15 (madrassquare.com/book-now). The page does
 *   not state this as a limit in words, so the copy says what the form covers, nothing stronger.
 * - "Asian cuisine and continental dishes": the description on the official food menu page
 * - "Restaurant & Bar", "panoramic views of the sea", "right by the beach": the booking page
 * - The Madras Square Instagram account: linked from the official site (group account)
 *
 * Geography, not a venue claim: the Bay of Bengal lies east of Uthandi, so the sun rises out of
 * the sea. The hero scene is drawn that way.
 *
 * Not confirmed, so not published: individual dishes, prices, seating areas, events,
 * celebrations, ratings, awards. See docs/content-review.md.
 */
const BOOKING = "https://thebeach.madrassquare.com/the-beach-booking/";
const PHONE_HREF = "tel:+917305669696";

export const theBeach: VenueConfig = {
  slug: "the-beach",
  name: "The Beach",
  byline: "by Madras Square",
  tagline: "Where the coast meets the table",
  description: "Asian and continental dishes, a bar, and panoramic views of the sea on East Coast Road.",
  seoDescription:
    "Restaurant and bar by the beach on East Coast Road, Uthandi, Chennai. Asian and continental dishes, views of the sea, kitchen hours, directions and table booking.",
  locationShort: "East Coast Road, Uthandi, Chennai",
  address: "ECR, 1st Main Road, Uthandi, Chennai, Tamil Nadu 600119",
  streetAddress: "ECR, 1st Main Road, Uthandi",
  locality: "Chennai",
  region: "Tamil Nadu",
  postalCode: "600119",
  country: "IN",
  phone: "+91 73056 69696",
  phoneHref: PHONE_HREF,
  bookingUrl: BOOKING,
  maxOnlineGuests: 15,
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Beach+by+Madras+Square+Uthandi+Chennai",
  hoursLabel: "Kitchen hours",
  hours: [
    {
      label: "Monday to Friday",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      ranges: [{ opens: "11:00", closes: "22:30", display: "11:00 am to 10:30 pm" }],
    },
    {
      label: "Saturday and Sunday",
      days: ["Saturday", "Sunday"],
      ranges: [
        { opens: "11:00", closes: "15:45", display: "11:00 am to 3:45 pm" },
        { opens: "18:30", closes: "22:30", display: "6:30 pm to 10:30 pm" },
      ],
    },
  ],
  hoursSource: "thebeach.madrassquare.com/the-beach-booking",
  hoursCheckedOn: "2026-10-17",
  hoursAreOpeningHours: false,
  menus: [
    {
      id: "food",
      label: "Food menu",
      note: "Asian and continental dishes.",
      href: "https://thebeach-food-menu.vercel.app/",
    },
    {
      id: "drinks",
      label: "Drinks menu",
      note: "From the bar.",
      href: "https://madrassquare-liquor-menu.vercel.app/",
    },
  ],
  social: [
    { label: "Madras Square on Instagram", href: "https://www.instagram.com/madrassquare/", scope: "group" },
  ],
  theme: { background: COLOR.abyss, foreground: COLOR.ivory, accent: COLOR.ember },
  media: {},
  story: [
    "The Beach by Madras Square is a restaurant and bar on East Coast Road in Uthandi, right by the beach, with panoramic views of the sea.",
    "Chennai’s coast faces east, so the day begins out on the water. The sun comes up out of the Bay of Bengal, and in the evening the sky over the sea turns pink.",
    "The kitchen serves Asian and continental dishes, and the bar has its own drinks menu. Both are kept on the venue’s own pages.",
  ],
  menuCategories: [],
  gallery: [
    { id: "g1", tile: "sunrise", aspect: "tall", alt: "Illustration of the sun rising out of a calm sea", caption: "Sunrise", placeholder: true },
    { id: "g2", tile: "table", aspect: "landscape", alt: "Illustration of a set table facing the water at dusk", caption: "An evening table", placeholder: true },
    { id: "g3", tile: "midday", aspect: "square", alt: "Illustration of bright midday light on the sea", caption: "Midday", placeholder: true },
    { id: "g4", tile: "evening", aspect: "portrait", alt: "Illustration of a pink evening sky over dark water", caption: "Evening", placeholder: true },
    { id: "g5", tile: "shore", aspect: "landscape", alt: "Illustration of waves reaching a pale shoreline", caption: "The shoreline", placeholder: true },
    { id: "g6", tile: "night", aspect: "tall", alt: "Illustration of the moon rising over the sea", caption: "Moonrise", placeholder: true },
  ],
  occasions: [
    {
      id: "lunch",
      title: "Lunch by the sea",
      body: "The kitchen opens at 11 am every day.",
      tile: "midday",
      action: { label: "Reserve a table", href: BOOKING },
    },
    {
      id: "dinner",
      title: "Dinner with the sea in view",
      body: "Panoramic views of the sea, with the kitchen open until 10:30 pm.",
      tile: "evening",
      action: { label: "Reserve a table", href: BOOKING },
    },
    {
      id: "weekend",
      title: "Weekend plans",
      body: "On Saturday and Sunday the kitchen closes between 3:45 pm and 6:30 pm.",
      tile: "shore",
      action: { label: "Reserve a table", href: BOOKING },
    },
    {
      id: "groups",
      title: "Bigger tables",
      body: "The online booking form covers 2 to 15 guests. For a larger party, send an enquiry or call.",
      tile: "table",
      action: { label: "Plan a larger table", href: "#enquire" },
    },
  ],
};
