"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { NauviWordmark } from "./nauvi-brand";
import { applicationCategories, photos } from "./cinematic-content";
import s from "./cinematic.module.css";

const navigation = [
  {
    id: "platform", label: "Platform", href: "/platform",
    links: [
      { label: "Company Brain", href: "/platform", description: "De kennis van je bedrijf op één plek" },
      { label: "Interactieve demo", href: "/platform#mogelijkheden", description: "Van bedrijfskennis naar uitgevoerd werk" },
      { label: "Koppelingen", href: "/platform#koppelingen", description: "Aansluiten op de tools van je team" },
    ],
    features: [{ image: photos.office, title: "Bekijk Company Brain", href: "/platform" }],
  },
  {
    id: "toepassingen", label: "Toepassingen", href: "/toepassingen",
    links: applicationCategories.map(({ id, label, text }) => ({ label, href: `/toepassingen#${id}`, description: text })),
    features: [{ image: photos.site, title: "Van spraakbericht naar werfverslag", href: "/toepassingen/werfverslagen-maken" }],
  },
  {
    id: "over", label: "Over Nauvi", href: "/over-nauvi",
    links: [
      { label: "Over ons", href: "/over-nauvi", description: "Leer Nauvi kennen" },
      { label: "Werken bij Nauvi", href: "/careers", description: "Bouw mee aan AI voor het dagelijkse werk" },
    ],
    features: [
      { image: photos.team, title: "Leer Nauvi kennen", href: "/over-nauvi" },
      { image: photos.handover, title: "Werken bij Nauvi", href: "/careers" },
    ],
  },
  { id: "werkwijze", label: "Werkwijze", href: "/werkwijze" },
];

const announcements = [
  { title: "AI voor bouwbedrijven", action: "Bekijk de voorbeelden", href: "/toepassingen" },
  { title: "Nauvi Company Brain", action: "Ontdek het platform", href: "/platform" },
];

type HeaderTone = "overlay" | "dark" | "light";

export function CinematicNav({ onBooking, overlay }: { onBooking: () => void; overlay: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tone, setTone] = useState<HeaderTone>(overlay ? "overlay" : "light");
  const [notice, setNotice] = useState(0);
  const [stripVisible, setStripVisible] = useState(true);
  const [stripReturned, setStripReturned] = useState(false);
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const focusRequest = useRef<string | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    let scrollFrame = 0;
    let idleTimer: number | undefined;
    let previousY = window.scrollY;
    let returning = false;

    function updateHeader() {
      if (!bar.current || !strip.current) return;
      const stripHeight = strip.current.offsetHeight;
      const y = Math.max(0, window.scrollY);
      const returned = y >= stripHeight && returning;
      const navBottom = Math.max(stripHeight - y, returned ? stripHeight : 0) + bar.current.offsetHeight + 2;
      const surface = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-tone]")).findLast(section => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= navBottom && bottom > navBottom;
      });
      const surfaceTone = surface?.dataset.navTone;
      setTone(surfaceTone === "overlay" || surfaceTone === "dark" ? surfaceTone : "light");
      setStripReturned(returned);
      setStripVisible(y < stripHeight || returned);
    }

    function revealStrip() {
      returning = true;
      updateHeader();
    }

    function onScroll() {
      window.clearTimeout(idleTimer);
      const y = Math.max(0, window.scrollY);
      if (y < previousY - 2) returning = true;
      if (y > previousY + 2 && !strip.current?.contains(document.activeElement)) returning = false;
      previousY = y;
      if (!returning) idleTimer = window.setTimeout(revealStrip, 580);
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(updateHeader);
    }

    const close = () => {
      window.clearTimeout(hoverTimer.current);
      focusRequest.current = null;
      setMobileOpen(false);
      setExpanded(null);
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) close();
    };
    close();
    updateHeader();
    if (window.scrollY >= (strip.current?.offsetHeight ?? 0)) idleTimer = window.setTimeout(revealStrip, 580);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateHeader);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", close);
    return () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(idleTimer);
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateHeader);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", close);
    };
  }, [pathname]);

  useEffect(() => {
    if (!stripVisible) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (!reducedMotion.matches && !document.hidden && !strip.current?.matches(":hover, :focus-within")) {
        setNotice(current => (current + 1) % announcements.length);
      }
    }, 6500);
    return () => window.clearInterval(timer);
  }, [stripVisible]);

  useEffect(() => {
    if (expanded && focusRequest.current === expanded) {
      focusRequest.current = null;
      document.querySelector<HTMLElement>(`#nav-menu-${expanded} a`)?.focus();
    }
  }, [expanded]);

  function closeMenus() {
    window.clearTimeout(hoverTimer.current);
    focusRequest.current = null;
    setExpanded(null);
    setMobileOpen(false);
  }

  function queueMenu(id: string | null, delay: number) {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setExpanded(id), delay);
  }

  function book() {
    if (mobileOpen) menuButton.current?.focus();
    closeMenus();
    onBooking();
  }

  return (
    <header
      className={s.header}
      ref={header}
      data-tone={mobileOpen || expanded ? "light" : tone}
      data-menu-open={Boolean(expanded || mobileOpen)}
      data-strip-returned={stripReturned}
      onPointerEnter={() => window.clearTimeout(hoverTimer.current)}
      onPointerLeave={event => {
        const menu = event.currentTarget.querySelector('[data-open="true"][id]');
        if (event.pointerType === "mouse" && !menu?.contains(document.activeElement)) queueMenu(null, 140);
      }}
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
      <div className={s.announcement} ref={strip} inert={!stripVisible} aria-hidden={!stripVisible}>
        {announcements.map(({ title, action, href }, index) => (
          <Link key={href} href={href} data-current={notice === index} inert={notice !== index} aria-hidden={notice !== index}>
            <span>{title}</span><span>{action} <ArrowRight size={14} aria-hidden="true" /></span>
          </Link>
        ))}
      </div>
      <div className={s.headerInner} ref={bar}>
        <Link className={s.headerLogo} href="/" aria-label="Nauvi startpagina" onClick={closeMenus}><NauviWordmark /></Link>
        <nav className={s.desktopNav} aria-label="Hoofdnavigatie">
          {navigation.map(item => (
            <div className={s.navTrigger} key={item.id} onPointerEnter={event => {
              if (event.pointerType === "mouse") queueMenu(item.links ? item.id : null, 70);
            }}>
              <Link href={item.href} onClick={closeMenus}>{item.label}</Link>
              {item.links && <button
                id={`nav-trigger-${item.id}`}
                className={s.navChevron}
                type="button"
                aria-label={item.id === "over" ? "Meer over Nauvi" : `Meer over ${item.label.toLowerCase()}`}
                aria-expanded={expanded === item.id}
                aria-controls={`nav-menu-${item.id}`}
                onClick={() => {
                  window.clearTimeout(hoverTimer.current);
                  setExpanded(current => current === item.id ? null : item.id);
                }}
                onKeyDown={event => {
                  if (event.key !== "ArrowDown" && !(event.key === "Tab" && !event.shiftKey && expanded === item.id)) return;
                  event.preventDefault();
                  window.clearTimeout(hoverTimer.current);
                  if (expanded === item.id) {
                    document.querySelector<HTMLElement>(`#nav-menu-${item.id} a`)?.focus();
                  } else {
                    focusRequest.current = item.id;
                    setExpanded(item.id);
                  }
                }}
              ><ChevronDown size={15} aria-hidden="true" /></button>}
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
      <div className={s.navSurface} data-open={expanded !== null} onPointerEnter={() => window.clearTimeout(hoverTimer.current)}>
        {navigation.map(item => item.links && <div
          key={item.id}
          className={s.navDropdown}
          id={`nav-menu-${item.id}`}
          data-open={expanded === item.id}
          inert={expanded !== item.id}
          aria-hidden={expanded !== item.id}
        >
          <div className={s.dropdownLinks}>
            {item.links.map((link, index) => (
              <Link key={link.href} href={link.href} onClick={closeMenus} style={{ "--menu-delay": `${index * 48}ms` } as CSSProperties}>
                <span>{link.label}<small>{link.description}</small></span><ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className={s.dropdownFeatures} data-count={item.features.length}>
            {item.features.map(({ image, title, href }) => (
              <Link key={href} className={s.dropdownFeature} href={href} onClick={closeMenus}>
                <img src={image} alt="" />
                <span>{title}<ArrowUpRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>)}
      </div>
      <nav className={s.mobileMenu} id="nauvi-mobile-menu" aria-label="Mobiele hoofdnavigatie" hidden={!mobileOpen}>
        {navigation.map(item => <Link href={item.href} key={item.href} onClick={closeMenus}>{item.label}<ArrowUpRight size={19} aria-hidden="true" /></Link>)}
        <Link href="/careers" onClick={closeMenus}>Werken bij Nauvi <ArrowUpRight size={19} aria-hidden="true" /></Link>
        <a href="/app" onClick={closeMenus}>Inloggen <ArrowUpRight size={19} aria-hidden="true" /></a>
        <button type="button" className={s.darkButton} onClick={book}>Plan een kennismaking</button>
      </nav>
    </header>
  );
}

export function CinematicFooter({ onBooking }: { onBooking: () => void }) {
  return (
    <footer className={s.footer} id="demo" data-nav-tone="dark">
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
          <Link href="/careers">Werken bij Nauvi</Link>
          <Link href="/#vragen">Veelgestelde vragen</Link>
          <a href="/app">Login voor testgebruikers <ArrowUpRight size={13} aria-hidden="true" /></a>
        </nav>
      </div>
      <div className={s.footerWordmark} aria-hidden="true"><NauviWordmark /></div>
    </footer>
  );
}
