import type { MetadataRoute } from "next";
import { applications } from "@/components/marketing/cinematic-content";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/platform",
    "/agents",
    "/toepassingen",
    ...applications.map(({ slug }) => `/toepassingen/${slug}`),
    "/werkwijze",
    "/over-nauvi",
    "/careers",
    "/contact",
    "/privacy",
  ];

  return paths.map(path => ({ url: new URL(path, siteUrl).href }));
}
