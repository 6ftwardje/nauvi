"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    feature: { image: photos.office, title: "Bekijk Company Brain", href: "/platform" },
  },
  {
    id: "toepassingen", label: "Toepassingen", href: "/toepassingen",
    links: applicationCategories.map(({ id, label, text }) => ({ label, href: `/toepassingen#${id}`, description: text })),
    feature: { image: photos.site, title: "Van spraakbericht naar werfverslag", href: "/toepassingen/werfverslagen-maken" },
  },
  {
    id: "over", label: "Over Nauvi", href: "/over-nauvi",
    links: [
      { label: "Over ons", href: "/over-nauvi", description: "Leer Nauvi kennen" },
      { label: "Werken bij Nauvi", href: "/careers", description: "Bouw mee aan AI voor het dagelijkse werk" },
    ],
    feature: { image: photos.handover, title: "Werken bij Nauvi", href: "/careers" },
  },
  { id: "werkwijze", label: "Werkwijze", href: "/werkwijze" },
];

export function CinematicNav({ onBooking, overlay }: { onBooking: () => void; overlay: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tone, setTone] = useState<"overlay" | "dark" | "light">(overlay ? "overlay" : "light");
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    let scrollFrame = 0;
    const updateTone = () => {
      const bar = header.current;
      if (!bar) return;
      if (overlay && window.scrollY < 32) {
        setTone("overlay");
        return;
      }
      const position = bar.getBoundingClientRect().bottom + 2;
      const dark = Array.from(document.querySelectorAll('[data-nav-tone="dark"]')).some(section => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= position && bottom > position;
      });
      setTone(dark ? "dark" : "light");
    };
    const scheduleTone = () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(updateTone);
    };
    const close = () => {
      window.clearTimeout(hoverTimer.current);
      setMobileOpen(false);
      setExpanded(null);
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) close();
    };
    close();
    updateTone();
    window.addEventListener("scroll", scheduleTone, { passive: true });
    window.addEventListener("resize", scheduleTone);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", close);
    return () => {
      window.clearTimeout(hoverTimer.current);
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", scheduleTone);
      window.removeEventListener("resize", scheduleTone);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", close);
    };
  }, [overlay, pathname]);

  function closeMenus() {
    window.clearTimeout(hoverTimer.current);
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
    <>
      <div className={s.announcement}>
        <Link href="/toepassingen"><span>AI voor bouwbedrijven</span><span>Bekijk de voorbeelden <ArrowRight size={14} aria-hidden="true" /></span></Link>
      </div>
      <header
        className={s.header}
        ref={header}
        data-tone={mobileOpen || expanded ? "light" : tone}
        onPointerEnter={() => window.clearTimeout(hoverTimer.current)}
        onPointerLeave={event => {
          const menu = event.currentTarget.querySelector('[data-open="true"]');
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
        <div className={s.headerInner}>
          <Link className={s.headerLogo} href="/" aria-label="Nauvi startpagina" onClick={closeMenus}><NauviWordmark /></Link>
          <nav className={s.desktopNav} aria-label="Hoofdnavigatie">
            {navigation.map(item => (
              <div className={s.navItem} key={item.id}>
                <div className={s.navTrigger} onPointerEnter={event => {
                  if (event.pointerType === "mouse") queueMenu(item.links ? item.id : null, 90);
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
                  ><ChevronDown size={15} aria-hidden="true" /></button>}
                </div>
                {item.links && <div
                  className={s.navDropdown}
                  id={`nav-menu-${item.id}`}
                  data-open={expanded === item.id}
                  inert={expanded !== item.id}
                  aria-hidden={expanded !== item.id}
                  onPointerEnter={() => window.clearTimeout(hoverTimer.current)}
                >
                  <div className={s.dropdownLinks}>
                    {item.links.map(link => (
                      <Link key={link.href} href={link.href} onClick={closeMenus}>
                        <span>{link.label}<small>{link.description}</small></span><ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                  <Link className={s.dropdownFeature} href={item.feature.href} onClick={closeMenus}>
                    <img src={item.feature.image} alt="" />
                    <span>{item.feature.title}<ArrowUpRight size={15} aria-hidden="true" /></span>
                  </Link>
                </div>}
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
          <Link href="/careers" onClick={closeMenus}>Werken bij Nauvi <ArrowUpRight size={19} aria-hidden="true" /></Link>
          <a href="/app" onClick={closeMenus}>Inloggen <ArrowUpRight size={19} aria-hidden="true" /></a>
          <button type="button" className={s.darkButton} onClick={book}>Plan een kennismaking</button>
        </nav>
      </header>
    </>
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
