import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { AgentsCapabilities } from "./agents-capabilities";
import { AgentsWorkflow } from "./agents-workflow";
import { agentPhotos } from "./cinematic-content";
import { MarketingShell } from "./marketing-page";
import { NauviMark } from "./nauvi-brand";
import { RevealHeading } from "./reveal-heading";
import s from "./agents-page.module.css";
import shared from "./cinematic.module.css";

const examples = [
  {
    id: "offertes",
    title: "Offertes voorbereiden",
    text: "Een agent haalt de posten uit het bestek en maakt met je prijslijst een conceptofferte klaar voor nazicht.",
    href: "/toepassingen/offertes-voorbereiden",
    image: agentPhotos.estimation,
  },
  {
    id: "werfverslagen",
    title: "Werfverslagen maken",
    text: "Spreek je update in. De agent maakt van je opname en werffoto’s een verslag met de afgesproken actiepunten.",
    href: "/toepassingen/werfverslagen-maken",
    image: agentPhotos.site,
  },
  {
    id: "leverbonnen",
    title: "Leverbonnen verwerken",
    text: "Fotografeer de bon. De agent leest de materialen en aantallen en stelt voor bij welke werf ze horen.",
    href: "/toepassingen/leverbonnen-verwerken",
    image: agentPhotos.materials,
  },
];

export function AgentsPage() {
  return (
    <MarketingShell className={s.agentsPage} darkHeader closing closingTitle="Met welke taak wil je beginnen?">
      <section className={s.hero} data-nav-tone="overlay" aria-labelledby="agents-heading">
        <img className={s.heroPhoto} src={agentPhotos.hero} alt="" fetchPriority="high" />
        <div className={s.heroInner}>
          <div className={s.heroCopy}>
            <p className={s.signature}><NauviMark size={25} /> Nauvi Agents</p>
            <RevealHeading as="h1" id="agents-heading" lines={["AI-agents voor", "kantoor en werf."]} when="load" />
            <p className={s.heroDescription}>Laat offertes en werfverslagen voorbereiden en leverbonnen verwerken volgens jullie werkwijze. Jij beslist wat je team nakijkt.</p>
            <a className={shared.lightButton} href="#taken">Bekijk wat agents doen <ArrowDown size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className={s.examples} id="taken" aria-labelledby="agents-examples-heading">
        <div className={s.examplesInner}>
          <header className={s.examplesHeader}>
            <h2 id="agents-examples-heading">Welk werk kun je uit handen geven?</h2>
            <Link className={s.textLink} href="/toepassingen">Alle toepassingen <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </header>
          <div className={s.exampleGrid}>
            {examples.map(({ id, title, text, href, image }) => (
              <article key={href}>
                <Link className={s.example} href={href} aria-labelledby={`agents-card-${id}`}>
                  <img src={image} alt="" width={820} height={1025} loading="lazy" decoding="async" />
                  <span className={s.exampleArrow}><ArrowUpRight size={18} aria-hidden="true" /></span>
                  <div className={s.exampleCopy}>
                    <h3 id={`agents-card-${id}`}>{title}</h3>
                    <p>{text}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={s.workflow} aria-labelledby="agents-workflow-heading" data-nav-tone="dark">
        <div className={`${s.sectionInner} ${s.workflowInner}`}>
          <div className={s.workflowCopy}>
            <h2 id="agents-workflow-heading">Van aanvraag naar dossier.</h2>
            <p>Bij een offerteaanvraag verzamelt de agent de gegevens en zet hij een dossier klaar. Je collega kijkt het na vóór de aanvraag verdergaat.</p>
            <Link className={shared.lightButton} href="/platform#mogelijkheden">Probeer de interactieve demo <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <AgentsWorkflow />
        </div>
      </section>

      <AgentsCapabilities />

      <section className={s.brain} aria-labelledby="agents-setup-heading">
        <div className={`${s.sectionInner} ${s.brainInner}`}>
          <div>
            <h2 id="agents-setup-heading">Company Brain</h2>
            <p>Leg prijslijsten, sjablonen en werkafspraken op één plek vast. Zo weet je agent welke bronnen hij mag gebruiken en hoe jullie een taak aanpakken.</p>
          </div>
          <div className={s.brainActions}>
            <Link className={`${shared.darkButton} ${s.brainAction}`} href="/platform">Ontdek Company Brain <ArrowUpRight size={15} aria-hidden="true" /></Link>
            <Link className={s.textLink} href="/werkwijze">Bekijk onze werkwijze <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
