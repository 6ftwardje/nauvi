import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AboutPage } from "@/components/marketing/cinematic-subpage";

export const metadata: Metadata = pageMetadata({
  path: "/over-nauvi",
  title: "Over Nauvi | Nauvi",
  description: "Nauvi helpt kmo’s hun bedrijfskennis vast te leggen en terugkerend werk uit handen te geven.",
});

export default AboutPage;
