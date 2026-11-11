"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play,
} from "lucide-react";
import { motion, useInView, useReducedMotion, useScroll, type MotionStyle } from "motion/react";
import { BrainField } from "./brain-field";
import { applicationCategories, applications, integrations, photos } from "./cinematic-content";
import s from "./cinematic.module.css";

const heroImages = [
  { image: photos.hero, duration: 3400, direction: 1 },
  { image: photos.office, duration: 2800, direction: -1 },
  { image: photos.site, duration: 3100, direction: 1 },
  { image: photos.warehouse, duration: 2800, direction: -1 },
  { image: photos.team, duration: 3300, direction: 1 },
];
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
    }, heroImages[frame].duration);
    return () => window.clearTimeout(timer);
  }, [frame, animate]);

  return (
    <section className={s.hero} aria-labelledby="hero-title" data-nav-tone="dark" ref={section}>
      <div className={s.heroMedia} aria-hidden="true" data-playing={animate}>
        {heroImages.map(({ image, duration, direction }, index) => (
          <img
            key={image}
            src={image}
            alt=""
            fetchPriority={index === 0 ? "high" : "low"}
            decoding="async"
            data-active={index === frame}
            style={{ "--shot-duration": `${duration}ms`, "--shot-direction": direction } as CSSProperties}
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
      <BrainField mode="home">
        <p className={s.platformLabel}>Nauvi Company Brain</p>
        <h2 id="platform-heading">Eén Company Brain<br />voor je hele bedrijf.</h2>
        <Link className={s.lightButton} href="/platform">Ontdek het platform <ArrowRight size={15} aria-hidden="true" /></Link>
      </BrainField>
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
            <img src={application.image} alt="" loading="lazy" decoding="async" />
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
          <h2 id="about-heading">Gebouwd voor teams die het werk kennen.</h2>
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
