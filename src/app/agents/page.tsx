import type { Metadata } from "next";
import { pageMetadata, shareImages } from "@/lib/seo";
import { AgentsPage } from "@/components/marketing/agents-page";

export const metadata: Metadata = pageMetadata({
  path: "/agents",
  title: "Nauvi Agents | AI-agents voor bouwbedrijven",
  description: "Geef terugkerend werk op kantoor en op de werf uit handen. Nauvi bouwt AI-agents voor offertes, werfverslagen en leverbonnen, volgens de afspraken van je bouwbedrijf.",
  image: shareImages.agents,
});

export default AgentsPage;
