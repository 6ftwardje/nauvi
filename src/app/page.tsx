import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MarketingPage from "@/components/marketing/marketing-page";

export const metadata: Metadata = {
  title: "Nauvi — Je bedrijf klaar voor AI-agents",
  description: "Jij deelt hoe je bedrijf werkt. Wij brengen je kennis samen in je Company Brain en bouwen agents die taken overnemen. Plan een kennismaking.",
};

export default async function Home({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  // Persoonlijke links die vóór de landingspagina zijn gemaakt, blijven werken.
  if (query.invite || query.token) {
    const invitation = new URLSearchParams();
    for (const key of ["invite", "token"] as const) {
      const value = query[key];
      if (typeof value === "string") invitation.set(key, value);
    }
    redirect(`/app?${invitation.toString()}`);
  }
  return <MarketingPage />;
}
