"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, CalendarDays, Check, Plus, RefreshCw, Video, X } from "lucide-react";
import { calendlyEmbedUrl, marketingConfig } from "./site-config";
import { NauviWordmark } from "./nauvi-brand";
import { AboutChapter, ApplicationCarousel, ApplicationTabs, Hero, PlatformChapter, Statement, ToolLogos } from "./cinematic-home";
import { CinematicFooter, CinematicNav } from "./cinematic-nav";
import s from "./marketing.module.css";
import cinematic from "./cinematic.module.css";

const faqs = [
  {
    question: "Koop ik software of nemen jullie werk over?",
    answer: <>
      <p>We nemen afgesproken taken over met AI-agents. In Nauvi leggen we vast hoe je bedrijf werkt, zodat de agents jouw werkwijze kunnen volgen.</p>
      <p>We kiezen samen een eerste taak en spreken af hoe we het resultaat controleren. De kostprijs bepalen we per opdracht.</p>
    </>,
  },
  {
    question: "Is dit iets voor ons?",
    answer: <p>Nauvi is er voor kmo’s waar kennis verspreid zit over collega’s, mails en documenten. Je hebt geen ervaring met AI-agents nodig. In de kennismaking bekijken we welke taak je als eerste kunt uitbesteden.</p>,
  },
  {
    question: "Moeten we alles omgooien?",
    answer: <p>We vertrekken van hoe je team vandaag werkt. We beginnen met één taak en bekijken samen wat er voor die taak moet veranderen.</p>,
  },
  {
    question: "Werkt het met onze tools?",
    answer: <p>Onze ontwikkelaars bouwen koppelingen op maat. Welke koppelingen nodig en haalbaar zijn, hangt af van je tools en de taak die je wilt uitbesteden.</p>,
  },
  {
    question: "Waar bewaren jullie onze gegevens?",
    answer: <>
      <p>Je klantomgeving draait bij Hetzner in Duitsland. We maken back-ups van de database, zodat we die bij een storing kunnen herstellen.</p>
      <p>Voor de start spreken we af wie toegang krijgt en welke bronnen een agent mag gebruiken.</p>
    </>,
  },
  {
    question: "Welk AI-model gebruiken jullie?",
    answer: <>
      <p>We gebruiken momenteel Claude van Anthropic. Gegevens die we voor een taak aan Claude doorgeven, kunnen buiten de EU worden verwerkt en opgeslagen.</p>
      <p>Anthropic gebruikt invoer en antwoorden uit zijn zakelijke diensten standaard niet voor modeltraining. We willen overstappen zodra een Europees model onze taken even betrouwbaar kan uitvoeren.</p>
    </>,
  },
  {
    question: "Hoelang bewaren jullie onze gegevens?",
    answer: <>
      <p>We verwijderen de klantgegevens die we zelf bewaren zodra we ze niet meer nodig hebben. Dat doen we uiterlijk 12 maanden na het einde van de samenwerking.</p>
      <p>Je kunt je vastgelegde bedrijfskennis controleren en exporteren. Je kunt ons ook vragen om je gegevens eerder te verwijderen.</p>
    </>,
  },
  {
    question: "Hoe krijg ik toegang als testgebruiker?",
    answer: <p>Open je persoonlijke uitnodigingslink om toegang te krijgen tot de testomgeving. Heb je in deze browser al een actieve sessie? Dan kun je via ‘Inloggen’ verderwerken.</p>,
  },
];

function Host() {
  return (
    <div className={s.host}>
      {marketingConfig.hostPortrait
        ? <img src={marketingConfig.hostPortrait} alt="" width={96} height={96} decoding="async" />
        : <span className={s.avatar} aria-hidden="true">{marketingConfig.hostName.charAt(0)}</span>}
      <span><strong>{marketingConfig.hostName}</strong><span>Jouw eerste aanspreekpunt bij Nauvi</span></span>
    </div>
  );
}

export function MarketingShell({ children }: { children?: ReactNode }) {
  const [booking, setBooking] = useState(false);
  const [calendarVersion, setCalendarVersion] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const embed = booking ? calendlyEmbedUrl(marketingConfig.calendlyUrl) : undefined;
  const home = children === undefined;

  useEffect(() => {
    if (!booking) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [booking]);

  function openBooking() {
    dialog.current?.showModal();
    setBooking(true);
  }

  function closeBooking() {
    dialog.current?.close();
  }

  return <div className={`${s.page} ${cinematic.site}`}>
    <a className={s.skip} href="#main">Naar de inhoud</a>
    <CinematicNav home={home} onBooking={openBooking} />
    <main id="main">
      {children ?? <>
        <Hero onBooking={openBooking} />
        <ToolLogos />
        <ApplicationCarousel />
        <Statement />
        <PlatformChapter />
        <ApplicationTabs />
        <AboutChapter />
        <section className={cinematic.faq} id="vragen" aria-labelledby="faq-title">
          <div><h2 id="faq-title">Veelgestelde vragen</h2><p>Meer weten? We nemen je vragen mee in de kennismaking.</p></div>
          <div className={cinematic.faqList}>{faqs.map(({ question, answer }) => (
            <details key={question}><summary>{question}<Plus size={19} aria-hidden="true" /></summary>{answer}</details>
          ))}</div>
        </section>
      </>}
    </main>
    <CinematicFooter onBooking={openBooking} />
    <dialog ref={dialog} className={s.bookingDialog} aria-labelledby="booking-title" onClose={() => setBooking(false)} onClick={e => { if (e.target === e.currentTarget) closeBooking(); }}>
      <button type="button" className={s.closeDialog} aria-label="Afspraakvenster sluiten" onClick={closeBooking}><X size={21} aria-hidden="true" /></button>
      <div className={s.bookingLayout}>
        <div className={s.bookingInfo}>
          <NauviWordmark className={s.brand} />
          <Host />
          <h2 id="booking-title">Plan een kennismaking</h2>
          <p>Vertel welke taak je uit handen wilt geven. Samen met {marketingConfig.hostName} bekijk je wat daarvoor nodig is en hoe we je kunnen helpen.</p>
          <span className={s.callType}><Video size={17} aria-hidden="true" /> Online kennismaking</span>
          <p className={s.copyNote}>30 minuten</p>
          <div className={s.bookingAgenda}>
            <span><Check size={15} aria-hidden="true" /> Vertel welke taak je tijd kost</span>
            <span><Check size={15} aria-hidden="true" /> Bespreek je werkwijze en afspraken</span>
            <span><Check size={15} aria-hidden="true" /> Bekijk wat we kunnen overnemen</span>
          </div>
        </div>
        <div className={s.calendarArea}>
          {booking && (embed ? <>
            <iframe key={calendarVersion} src={embed} title="Kies een moment voor je kennismaking bij Nauvi" width="100%" height="700" />
            <button type="button" className={s.calendarReload} onClick={() => setCalendarVersion(version => version + 1)}><RefreshCw size={14} aria-hidden="true" />Agenda opnieuw laden</button>
          </> : <div className={s.calendarPending}>
            <CalendarDays size={36} strokeWidth={1.3} aria-hidden="true" />
            <h3>Online boeken is momenteel niet beschikbaar.</h3>
            <p>Probeer het later opnieuw.</p>
            <Link className={`${s.button} ${s.outline}`} href="/platform#mogelijkheden" onClick={closeBooking}>Bekijk wat Nauvi doet <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>)}
        </div>
      </div>
    </dialog>
  </div>;
}

export default function MarketingPage() {
  return <MarketingShell />;
}
