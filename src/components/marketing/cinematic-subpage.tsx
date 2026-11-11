import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { applicationCategories, applications, photos, processSteps } from "./cinematic-content";
import { ApplicationCard } from "./cinematic-home";
import { MarketingShell } from "./marketing-page";
import { marketingConfig } from "./site-config";
import s from "./cinematic.module.css";

export function MarketingIntro({ title, description, image, back }: {
  title: string;
  description: string;
  image?: string;
  back?: { href: string; label: string };
}) {
  return (
    <>
      <div className={s.subpageIntro}>
        {back && <Link className={s.breadcrumb} href={back.href}><ArrowLeft size={14} aria-hidden="true" />{back.label}</Link>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {image && <img className={s.subpagePhoto} src={image} alt="" fetchPriority="high" />}
    </>
  );
}

export function ProcessPage() {
  return (
    <MarketingShell>
      <MarketingIntro title="Eén taak om mee te beginnen." description="Samen kiezen we terugkerend werk dat je team tijd kost. Daarna bouwen we een agent die de taak volgens jullie afspraken uitvoert." image={photos.team} />
      <section className={s.detailSection} aria-labelledby="steps-heading">
        <div>
          <h2 id="steps-heading">Van eerste gesprek tot eerste automatisering.</h2>
          <p>We spreken per taak af wat de agent doet, welk werk je team nakijkt en wat het kost.</p>
          <Link className={s.darkButton} href="/toepassingen">Bekijk de toepassingen <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <ol>
          {processSteps.map(({ title, text }) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
        </ol>
      </section>
    </MarketingShell>
  );
}

export function ApplicationsPage() {
  return (
    <MarketingShell>
      <MarketingIntro title="AI op kantoor en op de werf." description="Van een offerte voorbereiden tot leverbonnen nakijken. Ontdek welke terugkerende taken we kunnen automatiseren voor bouwbedrijven." />
      <div className={s.applicationDirectory}>
        {applicationCategories.map(({ label, id }) => (
            <section id={id} key={id} aria-labelledby={`${id}-title`}>
              <h2 id={`${id}-title`}>{label}</h2>
              <div className={s.directoryGrid}>
                {applications.filter(application => application.category === label).map(application => <ApplicationCard key={application.slug} application={application} />)}
              </div>
            </section>
        ))}
      </div>
    </MarketingShell>
  );
}

export function ApplicationDetail({ application }: { application: typeof applications[number] }) {
  return (
    <MarketingShell>
      <MarketingIntro title={application.title} description={application.description} image={application.image} back={{ href: "/toepassingen", label: "Alle toepassingen" }} />
      <section className={s.detailSection} aria-labelledby="result-heading">
        <div><h2 id="result-heading">Wat je team terugkrijgt.</h2></div>
        <div>
          <p>{application.result}</p>
          <p>We spreken vooraf af welke informatie de agent mag gebruiken en welke stap bij je team blijft.</p>
          <Link className={s.darkButton} href="/werkwijze">Zo pakken we het aan <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>
    </MarketingShell>
  );
}

export function AboutPage() {
  return (
    <MarketingShell>
      <MarketingIntro title="Gebouwd voor teams die het werk kennen." description="Nauvi helpt kmo’s om hun bedrijfskennis vast te leggen en AI-agents aan het werk te zetten." image={photos.team} />
      <section className={s.detailSection} aria-labelledby="meet-heading">
        <div><h2 id="meet-heading">Maak kennis met Nauvi.</h2></div>
        <div>
          <p>Tijdens de kennismaking bespreek je met {marketingConfig.hostName} welke taak je uit handen wilt geven en welke afspraken daarvoor belangrijk zijn.</p>
          <Link className={s.darkButton} href="#demo">Naar contact <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>
    </MarketingShell>
  );
}
