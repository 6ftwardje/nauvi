"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { NauviWordmark } from "./nauvi-brand";
import { applicationCategories } from "./cinematic-content";
import s from "./cinematic.module.css";

const navigation = [
  {
    label: "Platform", href: "/platform",
    links: [
      { label: "Company Brain", href: "/platform" },
      { label: "Interactieve demo", href: "/platform#mogelijkheden" },
      { label: "Koppelingen", href: "/platform#koppelingen" },
    ],
  },
  {
    label: "Toepassingen", href: "/toepassingen",
    links: applicationCategories.map(({ id, label }) => ({ label, href: `/toepassingen#${id}` })),
  },
  { label: "Werkwijze", href: "/werkwijze" },
  { label: "Over Nauvi", href: "/over-nauvi" },
];

export function CinematicNav({ onBooking, home }: { onBooking: () => void; home: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const update = () => setScrolled(window.scrollY > 48);
    const closeOnResize = () => {
      setMobileOpen(false);
      setExpanded(null);
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) closeOnResize();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnResize);
    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnResize);
    };
  }, []);

  function closeMenus() {
    setExpanded(null);
    setMobileOpen(false);
  }

  function book() {
    if (mobileOpen) menuButton.current?.focus();
    closeMenus();
    onBooking();
  }

  return (
    <>
      <div className={s.announcement}>
        <Link href="/toepassingen"><span>AI voor bouwbedrijven</span><span>Bekijk de voorbeelden <ArrowRight size={14} aria-hidden="true" /></span></Link>
      </div>
      <header
        className={s.header}
        ref={header}
        data-solid={!home || scrolled || mobileOpen || expanded !== null}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) closeMenus();
        }}
        onKeyDown={event => {
          if (event.key !== "Escape") return;
          if (mobileOpen) menuButton.current?.focus();
          if (expanded) document.getElementById(`nav-trigger-${expanded}`)?.focus();
          closeMenus();
        }}
      >
        <div className={s.headerInner}>
          <Link className={s.headerLogo} href="/" aria-label="Nauvi startpagina" onClick={closeMenus}><NauviWordmark /></Link>
          <nav className={s.desktopNav} aria-label="Hoofdnavigatie">
            {navigation.map(item => (
              <div className={s.navItem} key={item.href}>
                <Link href={item.href} onClick={closeMenus}>{item.label}</Link>
                {item.links && <>
                  <button
                    id={`nav-trigger-${item.label}`}
                    className={s.navChevron}
                    type="button"
                    aria-label={`Meer over ${item.label.toLowerCase()}`}
                    aria-expanded={expanded === item.label}
                    aria-controls={`nav-menu-${item.label}`}
                    onClick={() => setExpanded(current => current === item.label ? null : item.label)}
                  ><ChevronDown size={15} aria-hidden="true" /></button>
                  <div className={s.navDropdown} id={`nav-menu-${item.label}`} hidden={expanded !== item.label}>
                    {item.links.map(link => <Link key={link.href} href={link.href} onClick={closeMenus}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}
                  </div>
                </>}
              </div>
            ))}
          </nav>
          <div className={s.headerActions}>
            <a href="/app">Inloggen</a>
            <button type="button" className={s.headerButton} onClick={book}>Plan een kennismaking</button>
          </div>
          <button
            className={s.menuButton}
            type="button"
            ref={menuButton}
            onClick={() => setMobileOpen(current => !current)}
            aria-expanded={mobileOpen}
            aria-controls="nauvi-mobile-menu"
            aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
          >{mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}</button>
        </div>
        <nav className={s.mobileMenu} id="nauvi-mobile-menu" aria-label="Mobiele hoofdnavigatie" hidden={!mobileOpen}>
          {navigation.map(item => <Link href={item.href} key={item.href} onClick={closeMenus}>{item.label}<ArrowUpRight size={19} aria-hidden="true" /></Link>)}
          <a href="/app" onClick={closeMenus}>Inloggen <ArrowUpRight size={19} aria-hidden="true" /></a>
          <button type="button" className={s.darkButton} onClick={book}>Plan een kennismaking</button>
        </nav>
      </header>
    </>
  );
}

export function CinematicFooter({ onBooking }: { onBooking: () => void }) {
  return (
    <footer className={s.footer} id="demo">
      <div className={s.footerMain}>
        <div className={s.footerIntro}>
          <Link href="/" className={s.footerLogo} aria-label="Nauvi startpagina"><NauviWordmark /></Link>
          <p>Welke taak wil jij uit handen geven?</p>
          <button className={s.lightButton} type="button" onClick={onBooking}>Plan een kennismaking <ArrowUpRight size={14} aria-hidden="true" /></button>
          <small>© {new Date().getFullYear()} Nauvi</small>
        </div>
        <nav aria-label="Platform">
          <strong>Platform</strong>
          <Link href="/platform">Company Brain</Link>
          <Link href="/platform#mogelijkheden">AI-agents</Link>
          <Link href="/platform#koppelingen">Koppelingen op maat</Link>
          <Link href="/werkwijze">Werkwijze</Link>
        </nav>
        <nav aria-label="Toepassingen">
          <strong>Toepassingen</strong>
          {navigation[1].links?.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <nav aria-label="Nauvi">
          <strong>Nauvi</strong>
          <Link href="/over-nauvi">Over ons</Link>
          <Link href="/#vragen">Veelgestelde vragen</Link>
          <a href="/app">Login voor testgebruikers <ArrowUpRight size={13} aria-hidden="true" /></a>
        </nav>
      </div>
      <div className={s.footerWordmark} aria-hidden="true"><NauviWordmark /></div>
    </footer>
  );
}
