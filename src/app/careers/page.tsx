import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { photos } from "@/components/marketing/cinematic-content";
import { MarketingShell } from "@/components/marketing/marketing-page";
import shared from "@/components/marketing/cinematic.module.css";
import s from "./careers.module.css";

export const metadata: Metadata = {
  title: "Werken bij Nauvi",
  description: "Leer het werk achter Nauvi kennen en bekijk onze vacatures.",
};

const work = [
  { title: "Engineering", text: "Bouw Company Brain en de koppelingen waarmee AI-agents in de tools van een klant kunnen werken." },
  { title: "Implementatie", text: "Breng samen met een klant een taak in kaart. Test wat de agent doet met voorbeelden uit het dagelijkse werk." },
  { title: "Product & ontwerp", text: "Maak het voor teams eenvoudig om kennis vast te leggen en te zien welk werk hun aandacht nodig heeft." },
];

export default function CareersPage() {
  const address = process.env.NAUVI_CAREERS_EMAIL?.trim();
  const applicationUrl = address && /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(address)
    ? `mailto:${address}?subject=${encodeURIComponent("Open sollicitatie bij Nauvi")}`
    : undefined;

  return (
    <MarketingShell>
      <section className={s.hero} aria-labelledby="careers-heading">
        <div className={s.intro}>
          <h1 id="careers-heading">Werken bij Nauvi</h1>
          <div>
            <p>We bouwen AI-agents die terugkerend werk overnemen voor kmo’s. Dat begint met begrijpen hoe het er op kantoor en op de werf aan toegaat.</p>
            <a href="#vacatures">Bekijk de vacatures <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
        <div className={s.heroImage}>
          <img src={photos.team} alt="" fetchPriority="high" decoding="async" />
        </div>
      </section>

      <section className={s.statement} aria-labelledby="careers-work-heading">
        <h2 id="careers-work-heading" data-reveal>Van een gesprek op de werf naar een agent die het werk begrijpt.</h2>
        <p data-reveal>Een automatisering begint met de werkwijze van de mensen die de taak vandaag uitvoeren. We leggen hun afspraken vast, bouwen de koppelingen en testen samen waar een agent het werk uit handen kan nemen.</p>
      </section>

      <section className={s.disciplines} data-nav-tone="dark" aria-labelledby="careers-disciplines-heading">
        <h2 id="careers-disciplines-heading" data-reveal>Waar we aan werken</h2>
        <ul>
          {work.map(({ title, text }) => <li key={title} data-reveal><h3>{title}</h3><p>{text}</p></li>)}
        </ul>
      </section>

      <section className={s.openings} id="vacatures" aria-labelledby="openings-heading">
        <h2 id="openings-heading">Vacatures</h2>
        <div>
          <p>Op dit moment staan er geen vacatures op deze pagina.</p>
          {applicationUrl ? (
            <a className={shared.darkButton} href={applicationUrl}>Stuur een open sollicitatie <ArrowUpRight size={15} aria-hidden="true" /></a>
          ) : (
            <Link className={shared.darkButton} href="/over-nauvi">Leer Nauvi kennen <ArrowRight size={15} aria-hidden="true" /></Link>
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
