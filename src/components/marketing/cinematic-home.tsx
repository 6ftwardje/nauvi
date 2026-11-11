"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Boxes, FileText, GitBranch, Layers3,
  Pause, Play, ScanLine, ShieldCheck, UsersRound, Workflow,
} from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { NauviMark } from "./nauvi-brand";
import { applicationCategories, applications, integrations, photos } from "./cinematic-content";
import s from "./cinematic.module.css";

const heroImages = [photos.hero, photos.office, photos.site];
const heroMotionQuery = "(prefers-reduced-motion: reduce)";

export function Hero({ onBooking }: { onBooking: () => void }) {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const animate = playing && pageVisible && inView;

  useEffect(() => {
    const preference = window.matchMedia(heroMotionQuery);
    const updatePreference = () => setPlaying(!preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!animate) return;
    const timer = window.setTimeout(() => {
      setFrame(current => (current + 1) % heroImages.length);
    }, 6300);
    return () => window.clearTimeout(timer);
  }, [frame, animate]);

  return (
    <section className={s.hero} aria-labelledby="hero-title" ref={section}>
      <div className={s.heroMedia} aria-hidden="true" data-playing={animate}>
        {heroImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            fetchPriority={index === 0 ? "high" : "low"}
            decoding="async"
            data-active={index === frame}
          />
        ))}
      </div>
      <div className={s.heroContent}>
        <h1 id="hero-title">Geef het werk<br />{" "}dat blijft liggen<br />{" "}uit handen.</h1>
        <div className={s.heroAside}>
          <p>Nauvi legt vast hoe je bedrijf werkt en bouwt AI-agents die taken voor je uitvoeren.</p>
          <div className={s.actions}>
            <button className={s.lightButton} type="button" onClick={onBooking}>Plan een kennismaking</button>
            <Link className={s.outlineLight} href="/platform">Ontdek Nauvi</Link>
          </div>
        </div>
      </div>
      <button
        className={s.mediaControl}
        type="button"
        onClick={() => setPlaying(current => !current)}
        aria-label={playing ? "Beeldwissel pauzeren" : "Beeldwissel afspelen"}
      >
        {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
      </button>
    </section>
  );
}

export function ToolLogos() {
  return (
    <section className={s.tools} id="integraties" aria-labelledby="tools-heading">
      <h2 id="tools-heading">Met de tools die je team al gebruikt</h2>
      <ul>
        {integrations.slice(0, 12).map(({ id, name }) => (
          <li key={id}><img src={`/marketing/logos/${id}.svg`} width={24} height={24} alt="" />{name}</li>
        ))}
      </ul>
      <Link href="/platform#koppelingen">Bekijk hoe koppelingen op maat werken <ArrowRight size={14} aria-hidden="true" /></Link>
    </section>
  );
}

export function ApplicationCard({ application }: { application: typeof applications[number] }) {
  return (
    <Link className={s.applicationCard} href={`/toepassingen/${application.slug}`}>
      <img src={application.image} alt="" loading="lazy" decoding="async" />
      <h3>{application.title}</h3>
      <ArrowUpRight size={23} aria-hidden="true" />
      <span>{application.category}</span>
    </Link>
  );
}

export function ApplicationCarousel() {
  const carousel = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ start: true, end: false });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = carousel.current;
    if (!track) return;
    const update = () => setBounds({
      start: track.scrollLeft < 2,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
    });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    update();
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, []);

  function move(direction: number) {
    const track = carousel.current;
    const first = track?.firstElementChild;
    if (!track || !first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({ left: step * direction, behavior: reducedMotion ? "instant" : "smooth" });
  }

  return (
    <section className={s.carouselSection} id="dienstverlening" aria-labelledby="carousel-heading">
      <div className={s.carouselHeader}>
        <h2 id="carousel-heading">Welk werk kan Nauvi overnemen?</h2>
        <div className={s.carouselControls}>
          <button type="button" onClick={() => move(-1)} disabled={bounds.start} aria-label="Vorige toepassing" aria-controls="application-carousel"><ArrowLeft size={19} aria-hidden="true" /></button>
          <button type="button" onClick={() => move(1)} disabled={bounds.end} aria-label="Volgende toepassing" aria-controls="application-carousel"><ArrowRight size={19} aria-hidden="true" /></button>
        </div>
      </div>
      <div className={s.carouselTrack} id="application-carousel" ref={carousel}>
        {applications.slice(0, 7).map(application => <ApplicationCard key={application.slug} application={application} />)}
      </div>
    </section>
  );
}

export function Statement() {
  return (
    <section className={s.statement}>
      <h2 data-reveal>We brengen je bedrijfskennis samen en bouwen AI-agents die werken zoals jouw team.</h2>
    </section>
  );
}

const gridNodes = [
  { row: 1, col: 5, Icon: Boxes, label: "Tools" },
  { row: 2, col: 2, Icon: FileText, label: "Documenten" },
  { row: 2, col: 8, Icon: UsersRound, label: "Je team" },
  { row: 4, col: 1, Icon: BookOpen, label: "Afspraken" },
  { row: 4, col: 9, Icon: Workflow, label: "AI-agents" },
  { row: 6, col: 2, Icon: GitBranch, label: "Werkwijzen" },
  { row: 6, col: 8, Icon: ShieldCheck, label: "Nazicht" },
  { row: 7, col: 5, Icon: Layers3, label: "Bedrijfskennis" },
];

export function PlatformChapter() {
  return (
    <section className={s.darkChapter} id="ai-agents" aria-labelledby="platform-heading">
      <div className={s.platform}>
        <div className={s.platformGrid} aria-hidden="true">
          {gridNodes.map(({ row, col, Icon, label }) => (
            <div className={s.gridNode} key={label} style={{ gridRow: row, gridColumn: col }}>
              <Icon size={16} /><span>{label}</span>
            </div>
          ))}
        </div>
        <div className={s.platformCopy}>
          <div className={s.platformMark}><NauviMark size={40} /></div>
          <h2 id="platform-heading">Eén Company Brain<br />voor je hele bedrijf.</h2>
          <Link className={s.lightButton} href="/platform">Ontdek het platform <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className={s.featurePair} id="werkwijze">
        <article className={s.feature} id="mogelijkheden">
          <img src={photos.team} alt="" loading="lazy" decoding="async" />
          <div>
            <h3>We bouwen het samen.</h3>
            <p>Jij toont hoe je team werkt. Wij bouwen de eerste automatisering en testen ze samen met jou.</p>
            <Link className={s.lightButton} href="/werkwijze">Bekijk de werkwijze</Link>
          </div>
        </article>
        <article className={s.feature}>
          <img src={photos.office} alt="" loading="lazy" decoding="async" />
          <div>
            <h3>Jij houdt de controle.</h3>
            <p>Jij bepaalt welke bronnen een agent gebruikt en welk werk eerst langs je team gaat.</p>
            <Link className={s.lightButton} href="/platform#mogelijkheden">Probeer de interactieve demo</Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export function ApplicationTabs() {
  const [selected, setSelected] = useState(0);
  const application = applicationCategories[selected];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = applicationCategories.length - 1;
    const next = {
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowRight: index === last ? 0 : index + 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    document.getElementById(`category-tab-${next}`)?.focus();
  }

  return (
    <section className={s.applicationSection} id="toepassingen" aria-labelledby="applications-heading">
      <h2 id="applications-heading">AI voor het werk dat<br />elke week terugkomt.</h2>
      <div className={s.tabs} role="tablist" aria-label="Toepassingen">
        {applicationCategories.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            role="tab"
            id={`category-tab-${index}`}
            aria-controls={`category-panel-${index}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={event => navigate(event, index)}
          >{label}</button>
        ))}
      </div>
      {applicationCategories.map(({ label }, index) => (
        <div
          key={label}
          className={s.applicationPanel}
          id={`category-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`category-tab-${index}`}
          tabIndex={0}
          hidden={index !== selected}
        >
          {index === selected && <>
            <img src={application.image} alt="" loading="lazy" decoding="async" />
            <h3>{application.label}</h3>
            <div>
              <p>{application.text}</p>
              <Link className={s.lightButton} href={`/toepassingen#${application.id}`}>Bekijk de voorbeelden <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
          </>}
        </div>
      ))}
    </section>
  );
}

export function AboutChapter() {
  return (
    <section className={s.about} id="waarom-nu" aria-labelledby="about-heading">
      <img src={photos.handover} alt="" loading="lazy" decoding="async" />
      <div className={s.aboutCopy}>
        <h2 id="about-heading">Gebouwd voor teams die het werk kennen.</h2>
        <p>We helpen kmo’s hun kennis vast te leggen en terugkerend werk uit handen te geven. We beginnen met één taak die je team vandaag tijd kost.</p>
      </div>
      <div className={s.aboutLinks}>
        <Link href="/over-nauvi">Over Nauvi <ArrowUpRight size={18} aria-hidden="true" /></Link>
        <Link href="/platform#mogelijkheden">Bekijk de demo <ScanLine size={18} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
