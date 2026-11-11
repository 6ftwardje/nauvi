"use client";

import { useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import {
  ArrowRight, CalendarDays, Camera, ChartNoAxesCombined, ClipboardCheck,
  ClipboardList, FileCheck2, FileText, Files, Inbox, ListChecks, Mail,
  MessageSquare, Mic, ReceiptText, Scale, ShieldCheck, Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { AccentLine, Kicker } from "./editorial";
import s from "./use-cases.module.css";

type Automation = {
  title: string;
  description: string;
  result: string;
  sourceIcon: LucideIcon;
  resultIcon: LucideIcon;
};

const groups = [
  {
    id: "offertes",
    label: "Aanvragen & offertes",
    cards: [
      {
        title: "Aanvragen verwerken",
        description: "Een agent leest e-mails en formulieren, maakt een dossier aan en geeft aan welke gegevens nog ontbreken.",
        result: "Aanvraagdossier met open vragen",
        sourceIcon: Mail,
        resultIcon: Inbox,
      },
      {
        title: "Offertes voorbereiden",
        description: "De agent haalt de posten uit het bestek en past je prijslijsten, prijsafspraken en offertemodel toe.",
        result: "Conceptofferte klaar voor nazicht",
        sourceIcon: Files,
        resultIcon: FileCheck2,
      },
      {
        title: "Offertes opvolgen",
        description: "Het systeem merkt onbeantwoorde offertes op en stelt met de klantafspraken erbij een opvolgbericht voor.",
        result: "Opvolgbericht klaar voor nazicht",
        sourceIcon: FileText,
        resultIcon: MessageSquare,
      },
    ],
  },
  {
    id: "werf",
    label: "Werf & planning",
    cards: [
      {
        title: "Werfverslagen uit spraak",
        description: "Een agent zet je ingesproken update en werffoto’s om in een verslag volgens je eigen werkwijze.",
        result: "Werfverslag met actiepunten",
        sourceIcon: Mic,
        resultIcon: ClipboardList,
      },
      {
        title: "Werk- en leverbonnen verwerken",
        description: "De agent leest foto’s van bonnen en stelt per werf de uren, materialen en aantallen voor.",
        result: "Registratie klaar voor nazicht",
        sourceIcon: Camera,
        resultIcon: ClipboardCheck,
      },
      {
        title: "Meerwerken signaleren",
        description: "Een agent vergelijkt mails en werfnotities met de offerte en brengt mogelijke meerwerken onder je aandacht.",
        result: "Mogelijke meerwerken ter controle",
        sourceIcon: MessageSquare,
        resultIcon: ListChecks,
      },
      {
        title: "Planning ondersteunen",
        description: "Het systeem legt de ploegbezetting, leveringen en werfvoortgang naast elkaar en signaleert conflicten.",
        result: "Voorstel voor een aangepaste planning",
        sourceIcon: Truck,
        resultIcon: CalendarDays,
      },
    ],
  },
  {
    id: "kosten",
    label: "Kosten & facturatie",
    cards: [
      {
        title: "Leveranciers vergelijken",
        description: "Een agent zet prijzen, hoeveelheden, levertermijnen en uitsluitingen uit leveranciersoffertes naast elkaar.",
        result: "Vergelijking voor je aankoopbeslissing",
        sourceIcon: Files,
        resultIcon: Scale,
      },
      {
        title: "Facturatie opvolgen",
        description: "Het systeem bereidt facturen voor op basis van goedgekeurde prestaties en houdt vervaldagen bij.",
        result: "Conceptfacturen en zicht op vervaldagen",
        sourceIcon: ClipboardCheck,
        resultIcon: ReceiptText,
      },
      {
        title: "Werfmarges bewaken",
        description: "Een agent vergelijkt je werfbudget met geboekte uren, aankopen en kosten van onderaannemers.",
        result: "Overzicht van kostenafwijkingen per werf",
        sourceIcon: ReceiptText,
        resultIcon: ChartNoAxesCombined,
      },
    ],
  },
];

const tiltRange = 16;
const tiltSpring = { stiffness: 300, damping: 27 };

function AutomationCard({ title, description, result, sourceIcon: SourceIcon, resultIcon: ResultIcon }: Automation) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);
  const y = useSpring(0, tiltSpring);

  function tilt(event: PointerEvent<HTMLLIElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    // Measure the stationary list item so tilting never moves the hit area.
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    rotateX.set((0.5 - (event.clientY - top) / height) * tiltRange);
    rotateY.set(((event.clientX - left) / width - 0.5) * tiltRange);
    y.set(-4);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
    y.set(0);
  }

  return <li className={s.cardScene} onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
    <motion.article className={s.card} style={{ rotateX, rotateY, y }}>
      <div className={s.cardVisual} aria-hidden="true">
        <span className={s.sourcePlate}><SourceIcon size={22} strokeWidth={1.6} /></span>
        <span className={s.connection} aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><rect x="1.25" y="1.25" width="11.5" height="11.5" fill="none" stroke="currentColor" strokeWidth="1.25" /><circle cx="7" cy="7" r="1.5" fill="currentColor" /></svg></span>
        <span className={s.resultPlate}><ResultIcon size={22} strokeWidth={1.6} /></span>
      </div>
      <div className={s.cardCopy}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <p className={s.result}><ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" /><span>{result}</span></p>
    </motion.article>
  </li>;
}

export default function UseCasesSection() {
  const [selected, setSelected] = useState(0);

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowLeft": next = (index + groups.length - 1) % groups.length; break;
      case "ArrowRight": next = (index + 1) % groups.length; break;
      case "Home": next = 0; break;
      case "End": next = groups.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    document.getElementById(`automation-tab-${groups[next].id}`)?.focus();
  }

  return <section className={s.section} id="dienstverlening" aria-labelledby="service-title">
    <div className={s.intro}>
      <div>
        <Kicker>Dienstverlening</Kicker>
        <h2 id="service-title">Van Company Brain naar automatisering.</h2>
        <AccentLine>Jouw werkwijze.</AccentLine>
      </div>
      <p>Als je Company Brain staat, bouwen we automatiseringen die jouw werkwijze en afspraken volgen. Deze voorbeelden komen uit ons werk voor bouwbedrijven.</p>
    </div>

    <div className={s.tabs} role="tablist" aria-label="Soorten automatiseringen">
      {groups.map((group, index) => <button
        key={group.id}
        type="button"
        role="tab"
        id={`automation-tab-${group.id}`}
        aria-selected={selected === index}
        aria-controls={`automation-panel-${group.id}`}
        tabIndex={selected === index ? 0 : -1}
        onClick={() => setSelected(index)}
        onKeyDown={event => navigateTabs(event, index)}
      >{group.label}</button>)}
    </div>

    {groups.map((group, index) => <div
      className={s.panel}
      key={group.id}
      role="tabpanel"
      id={`automation-panel-${group.id}`}
      aria-labelledby={`automation-tab-${group.id}`}
      tabIndex={0}
      hidden={selected !== index}
    >
      <ul className={s.cards} data-count={group.cards.length} role="list" tabIndex={0} aria-label={`Voorbeelden: ${group.label}`}>
        {group.cards.map(card => <AutomationCard key={card.title} {...card} />)}
      </ul>
    </div>)}

    <p className={s.reassurance}>
      <ShieldCheck size={19} strokeWidth={1.7} aria-hidden="true" />
      <span>Per automatisering spreken we af wat ze doet, wat je team controleert en wat het kost.</span>
    </p>
  </section>;
}
