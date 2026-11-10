"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, useInView, useScroll, useSpring, useTransform, useVelocity, type MotionStyle } from "motion/react";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, FileText, GitBranch, MessageSquare, Plus, RefreshCw, Search, Video, X } from "lucide-react";
import { calendlyEmbedUrl, marketingConfig } from "./site-config";
import HeroSection from "./hero-section";
import MarketingNavbar from "./marketing-navbar";
import { NauviMark, NauviWordmark } from "./nauvi-brand";
import WorkflowSection from "./workflow-section";
import UseCasesSection from "./use-cases-section";
import WorkInAction from "./work-in-action";
import { GradientSection } from "./gradient-section";
import s from "./marketing.module.css";

const tools = [
  { id: "googledrive", name: "Google Drive", category: "Kennis" },
  { id: "microsoft", name: "Microsoft 365", category: "Kennis" },
  { id: "slack", name: "Slack", category: "Communicatie" },
  { id: "notion", name: "Notion", category: "Kennis" },
  { id: "hubspot", name: "HubSpot", category: "CRM & sales" },
  { id: "salesforce", name: "Salesforce", category: "CRM & sales" },
  { id: "gmail", name: "Gmail", category: "Communicatie" },
  { id: "dropbox", name: "Dropbox", category: "Kennis" },
  { id: "asana", name: "Asana", category: "Projecten" },
  { id: "trello", name: "Trello", category: "Projecten" },
  { id: "shopify", name: "Shopify", category: "Commerce" },
  { id: "quickbooks", name: "QuickBooks", category: "Commerce" },
  { id: "zapier", name: "Zapier", category: "Automatisering" },
];
const faqs = [
  { question: "Koop ik software of nemen jullie werk over?", answer: <><p>Wij nemen afgesproken taken over met agents. Nauvi is de software achter die dienstverlening: de plek waar je bedrijfskennis juist en actueel blijft.</p><p>Jij deelt hoe je bedrijf werkt. Wij bekijken welke taak geschikt is, bouwen de agent en spreken af hoe we het resultaat controleren. De aanpak en kost bepalen we samen per opdracht.</p></> },
  { question: "Is dit iets voor ons?", answer: <><p>Nauvi is bedoeld voor kmo’s waar kennis verspreid zit over mensen, mails en documenten.</p><p>Je hoeft nog geen AI-agent te gebruiken. In een kennismaking bekijken we of Nauvi past bij jouw bedrijf.</p></> },
  { question: "Moeten we alles omgooien?", answer: <><p>Je bestaande werkwijze is het vertrekpunt. Je legt vast hoe je bedrijf vandaag werkt.</p><p>Welke aanpassingen nodig zijn om met Nauvi en je agents te werken, bekijken we samen.</p></> },
  { question: "Werkt het met onze tools?", answer: <><p>Onze ontwikkelaars bouwen koppelingen op maat.</p><p>Wat mogelijk is, hangt af van je tools en de taken die je agents moeten uitvoeren. Dat bekijken we voor jouw situatie.</p></> },
  { question: "Wat met onze data?", answer: <><p>Je kunt de vastgelegde kennis controleren en exporteren.</p><p>Opslaglocatie, beveiliging en toegangsrechten: <strong>[IN TE VULLEN]</strong></p><p>Gebruikte AI-diensten en gebruik van gegevens voor modeltraining: <strong>[IN TE VULLEN]</strong></p><p>Bewaartermijnen en verwijdering: <strong>[IN TE VULLEN]</strong></p></> },
  { question: "Hoe krijg ik toegang als testgebruiker?", answer: <p>Via ‘Inloggen’ open je de testomgeving. Je hebt een persoonlijke uitnodigingslink nodig. Heb je al een actieve sessie in deze browser, dan kun je daar verderwerken. Een kennismaking geeft niet automatisch toegang tot de app.</p> },
];

function Logo({ id, name, className = "" }: { id: string; name: string; className?: string }) { return <img className={className} src={`/marketing/logos/${id}.svg`} alt={name} width={30} height={30} />; }
function Host({ small = false }: { small?: boolean }) { return <div className={`${s.host} ${small ? s.hostSmall : ""}`}>
  {marketingConfig.hostPortrait ? <img src={marketingConfig.hostPortrait} alt={marketingConfig.hostName} width={small ? 56 : 96} height={small ? 56 : 96} decoding="async" /> : <span className={s.avatar} aria-label={`Profielfoto van ${marketingConfig.hostName} volgt`}>K</span>}
  <span><strong>{marketingConfig.hostName}</strong><span>Jouw eerste aanspreekpunt bij Nauvi</span></span>
</div>; }

function BrainValueIllustration() {
  const [expanded, setExpanded] = useState(false);
  const tasks = ["Offertes voorbereiden", "Klanten opvolgen", "Dossiers overdragen"];

  return <div className={s.valueIllustration}>
    <div className={s.valueControls} role="tablist" aria-label="Van één taak naar meer mogelijkheden">
      {["Start met één taak", "Als agents meer kunnen"].map((label, i) => <button
        key={label}
        id={`brain-value-tab-${i}`}
        role="tab"
        aria-selected={Number(expanded) === i}
        aria-controls="brain-value-panel"
        tabIndex={Number(expanded) === i ? 0 : -1}
        onClick={() => setExpanded(i === 1)}
        onKeyDown={event => {
          const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowRight" ? 1 - i : -1;
          if (next < 0) return;
          event.preventDefault();
          setExpanded(next === 1);
          document.getElementById(`brain-value-tab-${next}`)?.focus();
        }}
      >{label}</button>)}
    </div>
    <div className={s.valuePanel} id="brain-value-panel" role="tabpanel" aria-labelledby={`brain-value-tab-${Number(expanded)}`} tabIndex={0} data-expanded={expanded}>
      <div className={s.valueDiagram}>
        <div className={s.valueBrain}>
          <span className={s.valueMark} aria-hidden="true"><NauviMark size={76} /></span>
          <strong>Company Brain</strong>
          <span>Jouw bedrijfskennis</span>
          <div><span>Werkwijzen</span><span>Prijsafspraken</span><span>Uitzonderingen</span></div>
        </div>
        <svg className={s.valueConnections} viewBox="0 0 70 240" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120H24Q35 120 35 108V42Q35 30 47 30H70" />
          <path d="M0 120H70" />
          <path d="M0 120H24Q35 120 35 132V198Q35 210 47 210H70" />
        </svg>
        <ul className={s.valueTasks}>
          {tasks.map((task, i) => <li key={task} data-active={i === 0 || expanded} style={{ "--task-order": i } as CSSProperties}>
            <span className={s.valueTaskIcon} aria-hidden="true">{i === 0 ? <FileText size={18} /> : expanded ? i === 1 ? <MessageSquare size={18} /> : <GitBranch size={18} /> : <Plus size={18} />}</span>
            <span key={i === 0 ? task : `${task}-${expanded}`} className={s.valueTaskLabel}>{i === 0 || expanded ? task : "Ruimte voor een volgende taak"}</span>
          </li>)}
        </ul>
      </div>
      <p className={s.valueCaption}>{expanded ? "Meer taken mogelijk. Dezelfde bedrijfskennis als basis." : "Je begint met één taak. Je kennis staat klaar om verder te bouwen."}</p>
    </div>
    <p className={s.valueNote}>Illustratie van mogelijke taken, afhankelijk van je bedrijf en wat agents kunnen.</p>
  </div>;
}

function IntegrationExplorer() {
  const [category, setCategory] = useState("Alles");
  const [query, setQuery] = useState("");
  const [staticTools, setStaticTools] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const marquee = useRef<HTMLDivElement>(null);
  const inView = useInView(marquee);
  const searching = category !== "Alles" || query !== "";
  const filtered = tools.filter(tool => (category === "Alles" || tool.category === category) && tool.name.toLowerCase().includes(query.toLowerCase()));
  const midpoint = Math.ceil(tools.length / 2);
  const rows = [tools.slice(0, midpoint), tools.slice(midpoint)];

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return <div className={s.integrationExplorer} data-reveal data-searching={searching || undefined} data-static-tools={staticTools || undefined}>
    <label className={s.toolSearch}><Search size={17} /><input type="search" placeholder="Zoek jouw tool…" aria-label="Zoek een tool" value={query} onChange={event => setQuery(event.target.value)} /><span>↵</span></label>
    <div className={s.filters} role="group" aria-label="Filter tools">
      {["Alles", "Kennis", "Communicatie", "CRM & sales", "Projecten", "Commerce", "Automatisering"].map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
    </div>
    <div className={s.toolGrid} aria-live="polite">
      {filtered.length ? filtered.map(tool => <div key={tool.id} className={s.toolItem}><Logo id={tool.id} name="" /><span>{tool.name}</span></div>) : <p className={s.emptyTools}>Deze tool staat niet in het overzicht. Bespreek je wensen tijdens de kennismaking.</p>}
    </div>
    <div className={s.integrationMarquee} ref={marquee} data-running={inView && pageVisible} aria-hidden="true">
      {rows.map((row, index) => <div className={s.marqueeRow} key={index}>
        {[0, 1].map(copy => <ul className={s.marqueeGroup} key={copy}>
          {row.map(tool => <li key={tool.id}><Logo id={tool.id} name="" /><span>{tool.name}</span></li>)}
        </ul>)}
      </div>)}
    </div>
    <button className={s.marqueeToggle} type="button" aria-pressed={staticTools} onClick={() => setStaticTools(value => !value)}>Statische lijst</button>
    <p className={s.toolsDisclaimer}>Voorbeelden van tools voor maatwerk, geen ingebouwde koppelingen.</p>
  </div>;
}

export default function MarketingPage() {
  const [booking, setBooking] = useState(false);
  const [calendarVersion, setCalendarVersion] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const cta = useRef<HTMLElement>(null);
  const { scrollY, scrollYProgress } = useScroll({ target: cta, offset: ["start end", "end start"] });
  const velocity = useVelocity(scrollY);
  const ctaTravel = useTransform(() => {
    const progress = scrollYProgress.get();
    const momentum = Math.max(-9, Math.min(9, velocity.get() / 150));
    return (progress - .5) * 26 + Math.sin(progress * Math.PI) * momentum;
  });
  const offset = useSpring(ctaTravel, { stiffness: 90, damping: 28, restDelta: .05 });
  const embed = calendlyEmbedUrl(marketingConfig.calendlyUrl);
  useEffect(() => {
    if (!booking) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [booking]);
  function openBooking() { setBooking(true); dialog.current?.showModal(); }
  function closeBooking() { dialog.current?.close(); }
  const bookingButton = (className = s.button) => <button className={className} onClick={openBooking}>Plan een kennismaking <ArrowUpRight size={17} /></button>;

  return <div className={s.page}>
    <a className={s.skip} href="#main">Naar de inhoud</a>
    <MarketingNavbar onBooking={openBooking} />
    <main id="main">
      <HeroSection onStart={openBooking} />

      <section className={s.controlSection} id="ai-agents" aria-labelledby="agents-title" data-reveal>
        <div className={s.controlMark} aria-hidden="true"><NauviMark size={144} /><span /></div>
        <div>
          <h2 id="agents-title">Ook AI moet weten hoe jouw bedrijf werkt.</h2>
          <p>Een AI-agent is een digitale collega die taken uitvoert. Maar die kent jouw prijsafspraken en uitzonderingen niet vanzelf.</p>
          <p>Je Company Brain geeft die kennis een vaste plek. Zo maken we je bedrijf klaar om werk aan agents toe te vertrouwen.</p>
        </div>
      </section>

      <WorkflowSection onBooking={openBooking} />

      <UseCasesSection />

      <WorkInAction />

      <section className={s.valueSection} id="waarom-nu" aria-labelledby="why-title">
        <div className={s.valueCopy} data-reveal>
          <h2 id="why-title">AI wordt beter.<br /><span>Jouw bedrijfskennis wordt waardevoller.</span></h2>
          <p>Hoe meer agents kunnen, hoe meer taken ze met jouw kennis kunnen uitvoeren.</p>
          <p>Wat je vandaag juist vastlegt en blijft bijhouden, is de basis voor het werk dat je morgen kunt uitbesteden.</p>
          <span className={s.valueTakeaway}><BookOpen size={18} aria-hidden="true" /> Eén Company Brain. Steeds meer mogelijkheden.</span>
        </div>
        <BrainValueIllustration />
      </section>

      <section className={s.integrationSection} id="integraties" aria-labelledby="tools-title">
        <div className={s.integrationIntro} data-reveal><h2 id="tools-title">Je tools blijven het vertrekpunt.</h2><p>Onze ontwikkelaars bouwen koppelingen op maat. Zo kunnen je agents kennis uit Nauvi gebruiken in de tools die je bedrijf al gebruikt.</p><div className={s.integrationNote}><GitBranch size={17} /><span>Welke koppelingen nodig en mogelijk zijn,<br />spreken we samen af.</span></div>{bookingButton(`${s.button} ${s.outline}`)}</div>
        <IntegrationExplorer />
      </section>

      <section className={s.faqSection} id="vragen" aria-labelledby="faq-title"><div data-reveal><h2 id="faq-title">Even helder voor je begint.</h2><p>Staat jouw vraag er niet bij?<br />Stel ze tijdens de kennismaking.</p></div><div className={s.faqList}>{faqs.map(({ question, answer }) => <details key={question}><summary>{question}<Plus size={19} /></summary>{answer}</details>)}</div></section>

      <GradientSection gradient="contact" className={s.ctaSection} id="demo" aria-labelledby="cta-title" ref={cta}>
        <div className={s.ctaInner} data-reveal><h2 id="cta-title">Welke taak wil jij uit handen geven?</h2><p>Vertel wat je team tijd kost. We bekijken samen welke kennis nodig is en hoe we het werk kunnen overnemen.</p>{bookingButton(`${s.button} ${s.ctaButton}`)}<p className={s.copyNote}>30 minuten · Online kennismaking</p><Host small /></div>
        <motion.div className={s.ctaSymbol} style={{ "--cta-offset": offset } as MotionStyle} aria-hidden="true"><NauviMark size={600} /></motion.div>
      </GradientSection>
    </main>
    <footer className={s.footer}><div className={s.footerMain}><div><a href="#main" aria-label="Nauvi startpagina"><NauviWordmark className={s.brand} /></a><p>Nauvi is het brein <br />van je bedrijf.</p></div><nav aria-label="Meer over Nauvi"><span>ONTDEK NAUVI</span><a href="#werkwijze">Zo werkt het</a><a href="#dienstverlening">Wat wij overnemen</a><a href="#integraties">Je tools</a></nav><nav aria-label="Toegang en contact"><span>AAN DE SLAG</span><button onClick={openBooking}>Plan een kennismaking <ArrowUpRight size={13} /></button><a href="/app">Login voor testgebruikers <ArrowUpRight size={13} /></a><a href="#vragen">Veelgestelde vragen</a></nav></div><div className={s.footerBottom}><span>© {new Date().getFullYear()} Nauvi</span><span>AI die je bedrijf echt kent.</span><span>De kennis achter jouw werk.</span></div></footer>
    <dialog ref={dialog} className={s.bookingDialog} aria-labelledby="booking-title" onClose={() => setBooking(false)} onClick={e => { if (e.target === e.currentTarget) closeBooking(); }}>
      <button className={s.closeDialog} aria-label="Afspraakvenster sluiten" onClick={closeBooking}><X size={21} /></button>
      <div className={s.bookingLayout}>
        <div className={s.bookingInfo}><NauviWordmark className={s.brand} /><Host /><h2 id="booking-title">Plan een kennismaking</h2><p>Vertel welke taak je uit handen wilt geven. Samen met {marketingConfig.hostName} bekijk je wat daarvoor nodig is en hoe we je kunnen helpen.</p><span className={s.callType}><Video size={17} /> Online kennismaking</span><p className={s.copyNote}>Duur: 30 minuten</p><div className={s.bookingAgenda}><span><Check size={15} /> Vertel welke taak je tijd kost</span><span><Check size={15} /> Bespreek je werkwijze en afspraken</span><span><Check size={15} /> Bekijk wat we kunnen overnemen</span></div></div>
        <div className={s.calendarArea}>{booking && embed ? <><iframe key={calendarVersion} src={embed} title="Kies een moment voor je kennismaking bij Nauvi" width="100%" height="700" /><button type="button" className={s.calendarReload} onClick={() => setCalendarVersion(version => version + 1)}><RefreshCw size={14} aria-hidden="true" />Agenda opnieuw laden</button></> : <div className={s.calendarPending}><CalendarDays size={36} strokeWidth={1.3} /><h3>De agenda is nog niet beschikbaar.</h3><p>Boekingslink: <strong>[IN TE VULLEN]</strong></p><span>Er is nog geen afspraak ingepland.</span><button className={`${s.button} ${s.outline}`} onClick={() => { closeBooking(); document.getElementById("mogelijkheden")?.scrollIntoView({ behavior: "smooth" }); }}>Bekijk wat Nauvi doet <ArrowRight size={15} /></button></div>}</div>
      </div>
    </dialog>
  </div>;
}
