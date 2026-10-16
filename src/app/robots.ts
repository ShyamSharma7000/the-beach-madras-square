import type { MetadataRoute } from "next";

// Concept build: block crawlers until the venue approves and a domain is set.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
