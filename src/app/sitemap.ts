import type { MetadataRoute } from "next";
import { launched, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!launched) return [];
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
