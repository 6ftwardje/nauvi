import type { Metadata } from "next";
import { pageMetadata, shareImages } from "@/lib/seo";
import { PlatformPage } from "@/components/marketing/brain-platform";

export const metadata: Metadata = pageMetadata({
  path: "/platform",
  title: "Company Brain en AI-agents | Nauvi",
  description: "Leg je bedrijfskennis vast in je Company Brain en zie hoe een AI-agent ermee werkt.",
  image: shareImages.platform,
});

export default PlatformPage;
