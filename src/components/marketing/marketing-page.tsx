"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, CalendarDays, Check, Plus, RefreshCw, Video, X } from "lucide-react";
import { homeFaq } from "@/lib/seo";
import { calendlyEmbedUrl, marketingConfig } from "./site-config";
import { NauviWordmark } from "./nauvi-brand";
import { AboutChapter, ApplicationCarousel, ApplicationTabs, Hero, PlatformChapter, Statement, ToolLogos } from "./cinematic-home";
import { CinematicFooter, CinematicNav } from "./cinematic-nav";
import s from "./marketing.module.css";
import cinematic from "./cinematic.module.css";
import brain from "./brain-platform.module.css";

// The answers live in @/lib/seo so the FAQPage schema always matches the visible text.
const faqs = homeFaq.map(({ question, answer }) => ({
  question,
  answer: answer.map(paragraph => <p key={paragraph}>{paragraph}</p>),
}));

/** Opens the shell's existing "Plan een kennismaking" dialog from page content. */
const BookingContext = createContext<(() => void) | null>(null);

export function BookingButton({ className, children }: { className?: string; children: ReactNode }) {
  const openBooking = useContext(BookingContext);
  return <button type="button" className={className} onClick={() => openBooking?.()}>{children}</button>;
}

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

export function MarketingShell({ children, className, darkHeader = false, closing = false, closingTitle = "Welke taak wil jij uit handen geven?" }: {
  children?: ReactNode;
  className?: string;
  darkHeader?: boolean;
  closing?: boolean;
  closingTitle?: string;
}) {
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

  return <BookingContext.Provider value={openBooking}><div className={`${s.page} ${cinematic.site}${className ? ` ${className}` : ""}`}>
    <a className={s.skip} href="#main">Naar de inhoud</a>
    <CinematicNav overlay={home || darkHeader} onBooking={openBooking} />
    <main id="main">
      {children ?? <>
        <Hero onBooking={openBooking} />
        <ToolLogos />
        <ApplicationCarousel />
        <Statement />
        <PlatformChapter />
        <ApplicationTabs />
        <section className={cinematic.faq} id="vragen" aria-labelledby="faq-title">
          <div><h2 id="faq-title">Veelgestelde vragen</h2><p>Meer weten? We nemen je vragen mee in de kennismaking.</p></div>
          <div className={cinematic.faqList}>{faqs.map(({ question, answer }) => (
            <details key={question}><summary>{question}<Plus size={19} aria-hidden="true" /></summary>{answer}</details>
          ))}</div>
        </section>
        <AboutChapter />
      </>}
      {closing && <section className={brain.closing} aria-labelledby="brain-closing-title" data-nav-tone="dark">
        <h2 id="brain-closing-title">{closingTitle}</h2>
        <button className={cinematic.lightButton} type="button" onClick={openBooking}>Plan een kennismaking</button>
      </section>}
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
  </div></BookingContext.Provider>;
}

export default function MarketingPage() {
  return <MarketingShell />;
}
