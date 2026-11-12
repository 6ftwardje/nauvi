"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileOutput, LockKeyhole, Plug } from "lucide-react";
import { BrainField } from "./brain-field";
import { IntegrationExplorer } from "./integration-explorer";
import { MarketingShell } from "./marketing-page";
import { NauviMark } from "./nauvi-brand";
import { RevealHeading } from "./reveal-heading";
import WorkInAction from "./work-in-action";
import s from "./brain-platform.module.css";
import shared from "./cinematic.module.css";

const chapters = [
  { title: "Bedrijfskennis", text: "Leg documenten, werkwijzen en afspraken samen vast.", href: "#bedrijfskennis", tone: "blue" },
  { title: "AI-agents", text: "Zie hoe een agent met die kennis een taak uitvoert.", href: "#mogelijkheden", tone: "rust" },
  { title: "Koppelingen", text: "Gebruik de tools waar je team al mee werkt.", href: "#koppelingen", tone: "olive" },
];

const benefits = [
  { title: "Kennis hergebruiken", text: "Leg prijsafspraken en uitzonderingen één keer vast en gebruik ze ook voor andere taken." },
  { title: "Begin met één taak", text: "We kiezen samen een taak die tijd kost en testen de automatisering met voorbeelden uit je bedrijf." },
  { title: "Je eigen tools koppelen", text: "We bouwen de koppelingen op maat voor de systemen die de taak nodig heeft." },
  { title: "Nazicht door je team", text: "Je spreekt vooraf af wat een collega controleert voor er iets wordt verstuurd of aangepast." },
  { title: "Je kennis blijft beschikbaar", text: "Je kunt de vastgelegde kennis inzien, controleren en exporteren." },
];

const controls = [
  { Icon: Plug, title: "Koppelingen per taak", text: "We beginnen met de bestanden en systemen die de eerste automatisering nodig heeft." },
  { Icon: LockKeyhole, title: "Toegang op afspraak", text: "Voor de start bepalen we samen wie toegang krijgt en welke bronnen een agent mag raadplegen." },
  { Icon: FileOutput, title: "Je kennis kunnen exporteren", text: "Je kunt de vastgelegde bedrijfskennis inzien, controleren en exporteren." },
  { Icon: ClipboardCheck, title: "Goedkeuring door je team", text: "We leggen vast wanneer een voorstel eerst langs je team moet." },
];

export function PlatformPage() {
  return (
    <MarketingShell darkHeader closing>
      <div data-nav-tone="dark" className={s.dark}>
        <section className={s.hero} aria-labelledby="company-brain-heading" data-nav-tone="overlay">
          <BrainField mode="platform">
            <p className={s.signature}><NauviMark size={25} /> Nauvi Company Brain</p>
            <RevealHeading as="h1" id="company-brain-heading" lines={["Eén plek voor de kennis van", "je team en je AI-agents."]} when="load" breakClassName={s.desktopBreak} />
          </BrainField>
        </section>

        <WorkInAction />

        <section className={s.chapters} aria-labelledby="brain-chapters-heading">
          <h2 id="brain-chapters-heading" data-reveal>Zo werkt Company Brain.</h2>
          <div className={s.chapterGrid}>
            {chapters.map(({ title, text, href, tone }) => (
              <article key={title} className={s.chapter} data-tone={tone}>
                <div className={s.chapterLight} aria-hidden="true" />
                <h3>{title}</h3>
                <div><p>{text}</p><a className={shared.lightButton} href={href}>Ontdek {title.toLowerCase()} <ArrowRight size={13} aria-hidden="true" /></a></div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className={s.benefits} id="voordelen" aria-labelledby="brain-benefits-heading">
        <header>
          <h2 id="brain-benefits-heading">Wat één gedeelde kennisbasis oplevert.</h2>
          <p>De afspraken die je vastlegt voor je eerste automatisering, vormen de basis voor het werk dat je daarna aan je agents geeft.</p>
        </header>
        <ul>
          {benefits.map(({ title, text }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.controls} aria-labelledby="brain-controls-heading">
        <header data-reveal>
          <h2 id="brain-controls-heading">Jij bepaalt hoe de agent werkt.</h2>
          <p>Van de bronnen die hij gebruikt tot het werk dat je team nakijkt.</p>
        </header>
        <ul>
          {controls.map(({ Icon, title, text }) => (
            <li key={title}>
              <Icon size={30} strokeWidth={1.55} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={shared.detailSection} id="koppelingen" aria-labelledby="connect-heading">
        <div>
          <h2 id="connect-heading">Koppelingen met je eigen tools.</h2>
          <p>We bekijken per taak welke bestanden en systemen nodig zijn. Onze ontwikkelaars bouwen de koppelingen op maat.</p>
          <Link className={shared.darkButton} href="/werkwijze">Bekijk de werkwijze <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <IntegrationExplorer />
      </section>
    </MarketingShell>
  );
}
