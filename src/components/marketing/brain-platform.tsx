"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { ArrowRight, BookOpen, CheckCheck, FileText, GitBranch, Layers3, LockKeyhole, Network, Workflow } from "lucide-react";
import { BrainField } from "./brain-field";
import { CompanyBrain } from "./company-brain";
import { IntegrationExplorer } from "./integration-explorer";
import { MarketingShell } from "./marketing-page";
import { NauviMark } from "./nauvi-brand";
import { RevealHeading } from "./reveal-heading";
import WorkInAction from "./work-in-action";
import s from "./brain-platform.module.css";
import shared from "./cinematic.module.css";

const layers = [
  { label: "Toegang & controle", description: "We spreken af welke bronnen een agent mag gebruiken, wie toegang krijgt en welke resultaten eerst langs je team gaan." },
  { label: "Nazicht", description: "Je team kan het voorgestelde resultaat nakijken en aanpassen, bijvoorbeeld een conceptofferte of een antwoord aan een klant." },
  { label: "Automatiseringen", description: "Een agent voert een afgesproken taak uit, van het lezen van een bestek tot het voorbereiden van de volgende stap." },
  { label: "Werkwijzen", description: "Je legt vast hoe je team werkt, welke afspraken gelden en wanneer je van de gebruikelijke werkwijze afwijkt." },
  { label: "Bedrijfskennis", description: "Documenten, prijslijsten en kennis van collega’s komen op één plek samen." },
  { label: "AI-agents", description: "De agent gebruikt de kennis die hij voor zijn taak nodig heeft. Je spreekt af welke stappen hij zelfstandig mag uitvoeren." },
  { label: "Koppelingen", description: "We bouwen koppelingen met de tools en bestanden die voor jouw automatisering nodig zijn." },
];

const chapters = [
  { title: "Bedrijfskennis", text: "Leg documenten, werkwijzen en afspraken samen vast.", href: "#bedrijfskennis", tone: "blue" },
  { title: "AI-agents", text: "Zie hoe een agent met die kennis een taak uitvoert.", href: "#mogelijkheden", tone: "rust" },
  { title: "Koppelingen", text: "Gebruik de tools waar je team al mee werkt.", href: "#koppelingen", tone: "olive" },
];

const benefits = [
  { Icon: BookOpen, title: "Kennis die je kunt hergebruiken", text: "Prijsafspraken en uitzonderingen die je voor één taak vastlegt, kun je later ook voor andere taken gebruiken." },
  { Icon: Workflow, title: "Begin met één taak", text: "We kiezen één taak die tijd kost en testen de automatisering met voorbeelden uit je bedrijf." },
  { Icon: Network, title: "Aansluiten op je eigen tools", text: "We bouwen de koppelingen op maat voor de systemen die de taak nodig heeft." },
  { Icon: CheckCheck, title: "Je team kan het werk nakijken", text: "Je spreekt vooraf af welke voorstellen een collega controleert voor er iets wordt verstuurd of aangepast." },
  { Icon: Layers3, title: "Bedrijfskennis blijft beschikbaar", text: "Je kunt de vastgelegde kennis controleren en exporteren." },
];

const controls = [
  { Icon: Network, title: "Koppelingen per taak", text: "We beginnen met de bestanden en systemen die de eerste automatisering nodig heeft.", color: "blue" },
  { Icon: LockKeyhole, title: "Toegang op afspraak", text: "Voor de start bepalen we samen wie toegang krijgt en welke bronnen een agent mag raadplegen.", color: "ice" },
  { Icon: FileText, title: "Je kennis kunnen exporteren", text: "Je kunt de vastgelegde bedrijfskennis inzien, controleren en exporteren.", color: "violet" },
  { Icon: GitBranch, title: "Goedkeuring door je team", text: "We leggen vast wanneer een voorstel eerst langs je team moet.", color: "steel" },
];

function LayerDiagram() {
  const [active, setActive] = useState(0);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = layers.length - 1;
    const target = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setActive(target);
    document.getElementById(`brain-layer-${target}`)?.focus();
  }

  return (
    <section className={s.infrastructure} aria-labelledby="infrastructure-heading">
      <div className={s.layerCopy}>
        <h2 id="infrastructure-heading">Van kennis naar<br />uitgevoerd werk.</h2>
        <div id="brain-layer-description" className={s.layerDescription} aria-live="polite">
          <div key={active} className={s.layerText}>
            <h3>{layers[active].label}</h3>
            <p>{layers[active].description}</p>
          </div>
        </div>
      </div>
      <div className={s.diagramStage}>
        <div className={s.diagram} role="group" aria-label="Onderdelen van Company Brain">
          {layers.map(({ label }, index) => (
            <button
              type="button"
              key={label}
              id={`brain-layer-${index}`}
              className={s.layer}
              data-wide={index < 4}
              data-access={index === 0}
              aria-pressed={active === index}
              aria-controls="brain-layer-description"
              onClick={() => setActive(index)}
              onKeyDown={event => move(event, index)}
            >{label}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

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

        <LayerDiagram />

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

        <section className={s.benefits} aria-labelledby="brain-benefits-heading">
          <h2 id="brain-benefits-heading">Wat één gedeelde kennisbasis oplevert.</h2>
          <ul>
            {benefits.map(({ Icon, title, text }) => (
              <li key={title}><Icon size={21} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ul>
        </section>
      </div>

      <section className={s.controls} aria-labelledby="brain-controls-heading">
        <h2 id="brain-controls-heading" data-reveal>Jij bepaalt hoe de agent werkt. <span>Van de bronnen die hij gebruikt tot het werk dat je team nakijkt.</span></h2>
        <ul>
          {controls.map(({ Icon, title, text, color }) => (
            <li key={title} className={s.controlRow} tabIndex={0}>
              <h3><span>{title}</span></h3>
              <div className={s.controlArt} data-color={color} aria-hidden="true"><Icon size={36} /></div>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={shared.brainSection} id="bedrijfskennis" aria-labelledby="brain-heading">
        <div>
          <h2 id="brain-heading">Welke kennis gebruikt een agent?</h2>
          <p>Een prijslijst vertelt wat iets kost. De afspraken en uitzonderingen van je team vertellen wanneer die prijs geldt. Open een bron in het model om te zien welke kennis ze toevoegt.</p>
        </div>
        <CompanyBrain />
      </section>
      <WorkInAction />
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
