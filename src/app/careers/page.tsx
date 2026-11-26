import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Shield } from "lucide-react";
import { photos } from "@/components/marketing/cinematic-content";
import { MarketingShell } from "@/components/marketing/marketing-page";
import shared from "@/components/marketing/cinematic.module.css";
import { applicationHref, openings } from "./openings";
import s from "./careers.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Werken bij Nauvi",
  description: "Bekijk de vacatures Sales en Forward Deployed Engineer bij Nauvi. Help kmo’s terugkerend werk uit handen geven met AI-agents.",
};

const work = [
  { title: "Engineering", text: "Bouw Company Brain en de koppelingen waarmee AI-agents in de tools van een klant kunnen werken." },
  { title: "Implementatie", text: "Breng samen met een klant een taak in kaart. Test wat de agent doet met voorbeelden uit het dagelijkse werk." },
  { title: "Product & ontwerp", text: "Maak het voor teams eenvoudig om kennis vast te leggen en te zien welk werk hun aandacht nodig heeft." },
];

function JobCard({ opening }: { opening: (typeof openings)[number] }) {
  const { slug, title, contractType, summary } = opening;

  return (
    <li className={s.jobCard}>
      <div className={s.jobCopy}>
        <h3>{title}</h3>
        <span className={s.contractType}>{contractType}</span>
        <p>{summary}</p>
      </div>
      <div className={s.jobActions}>
        <a className={shared.darkButton} href={applicationHref(title)} aria-label={`Solliciteer voor ${title}`}>
          Solliciteer <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <Link className={s.secondaryAction} href={`/careers/${slug}`} aria-label={`Bekijk vacature ${title}`}>
          Bekijk vacature <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

export default function CareersPage() {
  const openingCount: number = openings.length;

  return (
    <MarketingShell>
      <section className={`${s.content} ${s.hero}`} aria-labelledby="careers-heading">
        <div className={s.intro}>
          <h1 id="careers-heading">Werken bij Nauvi</h1>
          <div className={s.introCopy}>
            <p>We bouwen AI-agents die terugkerend werk overnemen voor kmo’s. Dat begint met begrijpen hoe het er op kantoor en op de werf aan toegaat.</p>
            <a className={shared.darkButton} href="#vacatures">Bekijk de vacatures <ArrowDown size={15} aria-hidden="true" /></a>
          </div>
        </div>
        <img
          className={s.heroImage}
          src={photos.team}
          alt="Vijf mensen overleggen rond een tafel met een laptop en bouwplannen."
          width={1344}
          height={752}
          fetchPriority="high"
          decoding="async"
        />
      </section>

      <section className={`${s.content} ${s.statement}`} aria-labelledby="careers-work-heading">
        <h2 className={s.sectionHeading} id="careers-work-heading">Van een gesprek op de werf naar een agent die het werk begrijpt.</h2>
        <p>Een automatisering begint met de werkwijze van de mensen die de taak vandaag uitvoeren. We leggen hun afspraken vast, bouwen de koppelingen en testen samen waar een agent het werk uit handen kan nemen.</p>
      </section>

      <section className={s.disciplines} data-nav-tone="dark" aria-labelledby="careers-disciplines-heading">
        <div className={s.content}>
          <h2 className={s.sectionHeading} id="careers-disciplines-heading">Waar we aan werken</h2>
          <ul>
            {work.map(({ title, text }) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${s.content} ${s.openings}`} id="vacatures" aria-labelledby="openings-heading" tabIndex={-1}>
        <div className={s.openingsIntro}>
          <h2 className={s.sectionHeading} id="openings-heading">Vacatures</h2>
          <p>{openingCount} {openingCount === 1 ? "openstaande functie" : "openstaande functies"}</p>
        </div>
        <div>
          <ul className={s.jobList}>
            {openings.map(opening => <JobCard key={opening.slug} opening={opening} />)}
          </ul>
          <Link className={`${s.secondaryAction} ${s.privacyLink}`} href="/privacy#sollicitaties">
            <Shield size={15} aria-hidden="true" /> Privacy bij sollicitaties
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
