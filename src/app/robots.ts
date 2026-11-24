import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Netlify sets CONTEXT at build time. Production (or a build without CONTEXT) may be indexed, except /app.
 * Branch deploys and deploy previews ask crawlers to stay out entirely and do not advertise the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const context = process.env.CONTEXT;
  if (context && context !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/app" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
