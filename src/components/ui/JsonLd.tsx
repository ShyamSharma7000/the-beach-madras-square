import { theBeach as v } from "@/content/venues/the-beach";
import { siteUrl } from "@/lib/site";

/**
 * Restaurant structured data built only from details confirmed on the venue's official pages.
 * It carries no ratings or reviews, and no photograph until the venue supplies one. Opening hours
 * are published only once the venue confirms its kitchen hours are also its opening hours.
 */
export function JsonLd() {
  const venueProfiles = v.social.filter((s) => s.scope === "venue").map((s) => s.href);
  const food = v.menus.find((m) => m.id === "food");

  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `${v.name} ${v.byline}`,
    description: v.seoDescription,
    url: siteUrl,
    telephone: v.phone,
    servesCuisine: ["Asian", "Continental"],
    acceptsReservations: true,
    ...(food ? { hasMenu: food.href } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: v.streetAddress,
      addressLocality: v.locality,
      addressRegion: v.region,
      postalCode: v.postalCode,
      addressCountry: v.country,
    },
    ...(v.hoursAreOpeningHours
      ? {
          openingHoursSpecification: v.hours.flatMap((h) =>
            h.ranges.map((r) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: h.days,
              opens: r.opens,
              closes: r.closes,
            })),
          ),
        }
      : {}),
    ...(venueProfiles.length ? { sameAs: venueProfiles } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
