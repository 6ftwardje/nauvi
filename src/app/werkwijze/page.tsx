import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ProcessPage } from "@/components/marketing/cinematic-subpage";

export const metadata: Metadata = pageMetadata({
  path: "/werkwijze",
  title: "Zo werkt Nauvi | Nauvi",
  description: "We kiezen samen een taak, leggen je werkwijze vast en testen de eerste automatisering.",
});

export default ProcessPage;
