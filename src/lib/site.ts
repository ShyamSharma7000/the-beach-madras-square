import { theBeach } from "@/content/venues/the-beach";

/**
 * Launch switch. While false the site is a private preview: noindex, robots
 * disallow, empty sitemap, concept footer line, and illustrated stand-ins shown.
 * Set NEXT_PUBLIC_LAUNCHED=true only after docs/launch-checklist.md is complete.
 */
export const launched = process.env.NEXT_PUBLIC_LAUNCHED === "true";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

/** True once at least one cleared photograph is wired into the gallery. */
export const hasRealPhotos = theBeach.gallery.some((g) => g.src && !g.placeholder);

/** Gallery appears in preview, or at launch only if real photographs exist. */
export const showGallery = !launched || hasRealPhotos;

/** Enquiry email delivery is configured on the server. */
export const enquiryEnabled = Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL);
