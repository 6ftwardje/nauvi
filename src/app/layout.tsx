import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, shareImages, siteJsonLd, siteName, siteOrigin } from "@/lib/seo";

const title = "Nauvi — Je bedrijf klaar voor AI-agents";
const description = "Jij deelt hoe je bedrijf werkt. Wij brengen je kennis samen in je Company Brain en bouwen agents die taken overnemen.";
const image = { ...shareImages.default, url: absoluteUrl(shareImages.default.url) };

// Defaults only. Every indexable page sets its own canonical, og:url and share tags via pageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title,
  description,
  openGraph: { type: "website", locale: "nl_BE", siteName, title, description, images: [image] },
  twitter: { card: "summary_large_image", title, description, images: [image.url] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl-BE">
      <body>
        <JsonLd data={siteJsonLd()} />
        {children}
      </body>
    </html>
  );
}
