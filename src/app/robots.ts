import type { MetadataRoute } from "next";
import { launched, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!launched) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
