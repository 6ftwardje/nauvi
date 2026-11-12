"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play,
} from "lucide-react";
import { motion, useInView, useReducedMotion, useScroll, type MotionStyle } from "motion/react";
import { BrainField } from "./brain-field";
import { RevealHeading } from "./reveal-heading";
import { applicationCategories, applications, integrations, photos } from "./cinematic-content";
import s from "./cinematic.module.css";

const heroMotionQuery = "(prefers-reduced-motion: reduce)";

export function Hero({ onBooking }: { onBooking: () => void }) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(section);
  const [playing, setPlaying] = useState(false);
  const [requested, setRequested] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const active = playing && pageVisible && inView;

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
    if (active) setRequested(true);
  }, [active]);

  useEffect(() => {
    const player = video.current;
    if (!player || !requested) return;
    if (!active) {
      player.pause();
      return;
    }
    void player.play().catch((error: DOMException) => {
      if (error.name === "NotAllowedError") setPlaying(false);
    });
  }, [active, requested]);

  return (
    <section className={s.hero} aria-labelledby="hero-title" data-nav-tone="overlay" ref={section}>
      <div className={s.heroMedia} aria-hidden="true">
        <img src={photos.hero} alt="" fetchPriority="high" decoding="async" />
        {!unavailable && <video
          ref={video}
          src={requested ? "/marketing/cinematic/hero-montage.mp4" : undefined}
          poster={photos.hero}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          onError={() => { setUnavailable(true); setPlaying(false); }}
        />}
      </div>
      <div className={s.heroContent}>
        <RevealHeading as="h1" id="hero-title" lines={["Geef het werk", "dat blijft liggen", "uit handen."]} when="load" />
        <div className={s.heroAside}>
          <p>Nauvi legt vast hoe je bedrijf werkt en bouwt AI-agents die taken voor je uitvoeren.</p>
          <div className={s.actions}>
            <button className={s.lightButton} type="button" onClick={onBooking}>Plan een kennismaking</button>
            <Link className={s.outlineLight} href="/platform">Ontdek Nauvi</Link>
          </div>
        </div>
      </div>
      {!unavailable && <button
        className={s.mediaControl}
        type="button"
        onClick={() => setPlaying(current => !current)}
        aria-label={playing ? "Beeldwissel pauzeren" : "Beeldwissel afspelen"}
      >
        {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
      </button>}
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
        <RevealHeading id="carousel-heading" lines={["Welk werk kan Nauvi overnemen?"]} />
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

const statement = "We brengen je bedrijfskennis samen en bouwen AI-agents die werken zoals jouw team.";
const statementWords = statement.split(" ");

export function Statement() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 76%", "end 75%"] });
  return (
    <section className={s.statement} ref={section}>
      <motion.h2 aria-label={statement} style={{ "--statement-progress": scrollYProgress } as MotionStyle}>
        {statementWords.map((word, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={s.statementWord}
            style={{ "--word-index": index, "--word-count": statementWords.length } as CSSProperties}
          >{word}{" "}</span>
        ))}
      </motion.h2>
    </section>
  );
}

export function PlatformChapter() {
  return (
    <section className={s.darkChapter} id="ai-agents" aria-labelledby="platform-heading" data-nav-tone="dark">
      <BrainField mode="home" after={
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
            <img src={photos.brainField} alt="" loading="lazy" decoding="async" />
            <div>
              <h3>Jij houdt de controle.</h3>
              <p>Jij bepaalt welke bronnen een agent gebruikt en welk werk eerst langs je team gaat.</p>
              <Link className={s.lightButton} href="/platform#mogelijkheden">Probeer de interactieve demo</Link>
            </div>
          </article>
        </div>
      }>
        <p className={s.platformLabel}>Nauvi Company Brain</p>
        <h2 id="platform-heading">Eén Company Brain<br />voor je hele bedrijf.</h2>
        <Link className={s.lightButton} href="/platform">Ontdek het platform <ArrowRight size={15} aria-hidden="true" /></Link>
      </BrainField>
    </section>
  );
}

export function ApplicationTabs() {
  const [selected, setSelected] = useState(0);

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
      <div className={s.applicationStage}>
        {applicationCategories.map((application, index) => (
          <div
            key={application.id}
            className={s.applicationPanel}
            id={`category-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`category-tab-${index}`}
            aria-hidden={index !== selected}
            tabIndex={index === selected ? 0 : -1}
            inert={index !== selected}
            data-active={index === selected}
          >
            <img src={application.image} alt="" fetchPriority="low" decoding="async" />
            <h3>{application.label}</h3>
            <div>
              <p>{application.text}</p>
              <Link className={s.lightButton} href={`/toepassingen#${application.id}`}>Bekijk de voorbeelden <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutChapter() {
  return (
    <section className={s.about} id="waarom-nu" aria-labelledby="about-heading" data-nav-tone="dark">
      <img src={photos.handover} alt="" loading="lazy" decoding="async" />
      <div className={s.aboutInner}>
        <div className={s.aboutCopy}>
          <RevealHeading id="about-heading" lines={["Gebouwd voor teams die het werk kennen."]} />
          <p>We helpen kmo’s hun kennis vast te leggen en terugkerend werk uit handen te geven. We beginnen met één taak die je team vandaag tijd kost.</p>
        </div>
        <div className={s.aboutLinks}>
          <Link href="/over-nauvi">Over Nauvi <span><ArrowRight size={19} aria-hidden="true" /></span></Link>
          <Link href="/careers">Werken bij Nauvi <span><ArrowRight size={19} aria-hidden="true" /></span></Link>
        </div>
      </div>
    </section>
  );
}
