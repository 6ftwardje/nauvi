import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ApplicationsPage } from "@/components/marketing/cinematic-subpage";

export const metadata: Metadata = pageMetadata({
  path: "/toepassingen",
  title: "AI voor bouwbedrijven | Nauvi",
  description: "Bekijk toepassingen voor offertes, werfverslagen, leveranciers en facturatie.",
});

export default ApplicationsPage;
