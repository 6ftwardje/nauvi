import type { MetadataRoute } from "next";
import { absoluteUrl, indexableRoutes } from "@/lib/seo";

/** Indexable routes only, on the production host. No lastModified: there are no real per-page dates to report. */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes.map(path => ({ url: absoluteUrl(path) }));
}
