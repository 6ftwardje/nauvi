import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { MarketingIntro } from "@/components/marketing/cinematic-subpage";
import { MarketingShell } from "@/components/marketing/marketing-page";
import shared from "@/components/marketing/cinematic.module.css";
import s from "@/components/marketing/website-info.module.css";
import careers from "../careers.module.css";
import { applicationHref, openings } from "../openings";

type CareerProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return openings.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: CareerProps): Promise<Metadata> {
  const { slug } = await params;
  const opening = openings.find(role => role.slug === slug);
  if (!opening) notFound();

  return {
    title: `${opening.title} | Werken bij Nauvi`,
    description: opening.summary,
    alternates: { canonical: `/careers/${opening.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function CareerOpeningPage({ params }: CareerProps) {
  const { slug } = await params;
  const opening = openings.find(role => role.slug === slug);
  if (!opening) notFound();

  const { title, contractType, summary, responsibilities, fit } = opening;

  return (
    <MarketingShell>
      <MarketingIntro title={title} description={summary} back={{ href: "/careers#vacatures", label: "Alle vacatures" }} />
      <div className={s.privacy}>
        <div className={careers.detailActions}>
          <span className={careers.contractType}>{contractType}</span>
          <a className={shared.darkButton} href={applicationHref(title)}>Solliciteer per e-mail <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <section aria-labelledby="opening-responsibilities">
          <h2 id="opening-responsibilities">Wat je doet</h2>
          <ul>{responsibilities.map(item => <li key={item}>{item}</li>)}</ul>
        </section>
        <section aria-labelledby="opening-fit">
          <h2 id="opening-fit">Wat je meebrengt</h2>
          <p>{fit}</p>
        </section>
        <section aria-labelledby="opening-apply">
          <h2 id="opening-apply">Hoe je reageert</h2>
          <p>Mail ons voor deze functie en vertel kort welke ervaring aansluit op het werk. In onze <Link href="/privacy#sollicitaties">privacyverklaring</Link> lees je hoe we omgaan met sollicitatiegegevens.</p>
        </section>
      </div>
    </MarketingShell>
  );
}
