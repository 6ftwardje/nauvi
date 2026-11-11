"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useIsPresent, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import s from "./resizable-navbar.module.css";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps extends NavbarProps {
  visible?: boolean;
}

interface NavItemsProps {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavMenuProps extends NavbarProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
}

const spring = { type: "spring", stiffness: 200, damping: 50 } as const;

/** The supplied compound navbar API, styled for this CSS Modules codebase. */
export function Navbar({ children, className }: NavbarProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const lastVisible = useRef(false);
  const groupId = useId();

  function update(latest: number) {
    const next = latest > 100;
    if (next === lastVisible.current) return;
    lastVisible.current = next;
    setVisible(next);
  }
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => { update(window.scrollY); }, []);

  return <LayoutGroup id={groupId}>
    <motion.header layoutRoot className={cn(s.navbar, className)} data-scrolled={visible}>
      {React.Children.map(children, child => React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, { visible })
        : child)}
    </motion.header>
  </LayoutGroup>;
}

export function NavBody({ children, className, visible }: NavBodyProps) {
  const reduceMotion = useReducedMotion();
  return <motion.div layout={!reduceMotion} initial={false} animate={{ y: 0 }} transition={reduceMotion ? { duration: 0 } : spring} className={cn(s.navBody, className)} data-compact={visible}>
    {children}
  </motion.div>;
}

export function NavItems({ items, className, onItemClick }: NavItemsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const active = hovered ?? focused;
  return <motion.nav layout={!reduceMotion} className={cn(s.navItems, className)} aria-label="Hoofdnavigatie" onMouseLeave={() => setHovered(null)}>
    {items.map((item, index) => <a key={item.link} href={item.link} onClick={onItemClick} onMouseEnter={() => setHovered(index)} onFocus={() => setFocused(index)} onBlur={() => setFocused(null)}>
      {active === index && <motion.span className={s.hovered} layoutId="navbar-hover" aria-hidden="true" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 36 }} />}
      <span className={s.navLabel}>{item.name}</span>
    </a>)}
  </motion.nav>;
}

export function MobileNav({ children, className, visible }: NavBodyProps) {
  const reduceMotion = useReducedMotion();
  return <motion.div layout={!reduceMotion} initial={false} animate={{ y: 0 }} transition={reduceMotion ? { duration: 0 } : spring} className={cn(s.mobileNav, className)} data-compact={visible}>
    {children}
  </motion.div>;
}

export function MobileNavHeader({ children, className }: NavbarProps) {
  return <div className={cn(s.mobileHeader, className)}>{children}</div>;
}

function MobileMenuPanel({ children, className, id, onClose }: Omit<MobileNavMenuProps, "isOpen">) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const present = useIsPresent();
  useEffect(() => {
    if (!present) return;
    function outside(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element) || ref.current?.contains(target) || target.closest("[data-mobile-nav-toggle]")) return;
      onClose();
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
      const toggle = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-mobile-nav-toggle]")).find(button => button.getAttribute("aria-controls") === id);
      toggle?.focus();
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [id, onClose, present]);

  return <motion.nav ref={ref} id={id} className={cn(s.mobileMenu, className)} aria-label="Mobiele navigatie" aria-hidden={!present || undefined} inert={!present} initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }} transition={{ duration: reduceMotion ? 0 : .16 }}>
    {children}
  </motion.nav>;
}

export function MobileNavMenu({ isOpen, id = "mobile-navigation", ...props }: MobileNavMenuProps) {
  return <AnimatePresence initial={false}>{isOpen && <MobileMenuPanel key={id} id={id} {...props} />}</AnimatePresence>;
}

export function MobileNavToggle({ isOpen, onClick, controls = "mobile-navigation" }: { isOpen: boolean; onClick: () => void; controls?: string }) {
  return <button type="button" className={s.toggle} data-mobile-nav-toggle aria-label={isOpen ? "Menu sluiten" : "Menu openen"} aria-expanded={isOpen} aria-controls={controls} onClick={onClick}>
    {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
  </button>;
}

export function NavbarLogo({ children, className, ...props }: Omit<HTMLMotionProps<"a">, "layout">) {
  const reduceMotion = useReducedMotion();
  return <motion.a layout={reduceMotion ? false : "position"} className={cn(s.logo, className)} href="#main" {...props}>
    {children}
  </motion.a>;
}

type NavbarButtonProps = {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (React.ComponentPropsWithoutRef<"a"> | React.ComponentPropsWithoutRef<"button">);

export function NavbarButton({ href, as: Tag = "a", children, className, variant = "primary", ...props }: NavbarButtonProps) {
  return <Tag href={href || undefined} className={cn(s.button, s[variant], className)} {...(Tag === "button" ? { type: "button" } : {})} {...props}>{children}</Tag>;
}

export function NavbarActions({ children, className }: NavbarProps) {
  const reduceMotion = useReducedMotion();
  return <motion.div layout={reduceMotion ? false : "position"} className={cn(s.actions, className)}>{children}</motion.div>;
}
