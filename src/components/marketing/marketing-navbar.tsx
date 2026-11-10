"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle, Navbar, NavbarActions, NavbarButton, NavbarLogo, NavBody, NavItems } from "@/components/ui/resizable-navbar";
import { NauviWordmark } from "./nauvi-brand";

const items = [
  { name: "Zo werkt het", link: "#werkwijze" },
  { name: "Wat wij overnemen", link: "#dienstverlening" },
  { name: "Je tools", link: "#integraties" },
];

export default function MarketingNavbar({ onBooking }: { onBooking: () => void }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = (event: MediaQueryListEvent) => { if (event.matches) close(); };
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, [close]);
  const book = () => {
    if (open) document.querySelector<HTMLButtonElement>("[data-mobile-nav-toggle]")?.focus();
    close();
    onBooking();
  };

  return <Navbar>
    <NavBody>
      <NavbarLogo aria-label="Nauvi startpagina"><NauviWordmark /></NavbarLogo>
      <NavItems items={items} />
      <NavbarActions><NavbarButton href="/app" variant="secondary">Inloggen <ArrowUpRight size={14} aria-hidden="true" /></NavbarButton><NavbarButton as="button" onClick={book}>Plan een kennismaking <ArrowUpRight size={16} aria-hidden="true" /></NavbarButton></NavbarActions>
    </NavBody>
    <MobileNav>
      <MobileNavHeader><NavbarLogo aria-label="Nauvi startpagina" onClick={close}><NauviWordmark /></NavbarLogo><MobileNavToggle isOpen={open} onClick={() => setOpen(current => !current)} controls="marketing-menu" /></MobileNavHeader>
      <MobileNavMenu id="marketing-menu" isOpen={open} onClose={close}>
        {items.map(item => <a key={item.link} href={item.link} onClick={close}>{item.name}<ArrowRight size={16} aria-hidden="true" /></a>)}
        <NavbarActions><NavbarButton href="/app" variant="secondary" onClick={close}>Inloggen <ArrowUpRight size={15} aria-hidden="true" /></NavbarButton><NavbarButton as="button" onClick={book}>Plan een kennismaking <ArrowUpRight size={16} aria-hidden="true" /></NavbarButton></NavbarActions>
      </MobileNavMenu>
    </MobileNav>
  </Navbar>;
}
