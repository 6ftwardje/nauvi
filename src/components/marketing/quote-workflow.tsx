"use client";

import { ArrowRight, Calculator, ClipboardCheck, FileInput } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import s from "./quote-example.module.css";

const stepIcons: Partial<Record<string, LucideIcon>> = { "demo-invoer": FileInput, "demo-concept": Calculator, "demo-nazicht": ClipboardCheck };
const illustrationThreshold = 0.65;

export function QuoteWorkflow({ steps }: { steps: { id: string; label: string }[] }) {
  const navigation = useRef<HTMLElement>(null);
  const [active, setActive] = useState(steps[0].id);

  useEffect(() => {
    const demo = navigation.current?.closest<HTMLElement>("#voorbeeld");
    if (!demo) return;

    const sections = steps.flatMap(({ id }) => {
      const section = document.getElementById(id);
      return section && demo.contains(section) ? [section] : [];
    });
    const sources = Array.from(demo.querySelectorAll<HTMLElement>("[data-quote-post]"));
    const illustration = demo.querySelector("[data-quote-illustration]");
    const heroLink = demo.parentElement?.querySelector('section[aria-labelledby="application-title"] a[href="#voorbeeld"]');
    const fragmentTarget = () => document.getElementById(window.location.hash.slice(1));

    function updatePosition() {
      const readingLine = Math.max(128, window.innerHeight * 0.28);
      const target = fragmentTarget();
      const targetTop = target?.getBoundingClientRect().top;
      if (target && targetTop !== undefined && targetTop >= 0 && targetTop <= readingLine) {
        const anchoredSection = sections.find(section => section.contains(target));
        if (anchoredSection) {
          setActive(anchoredSection.id);
          return;
        }
      }
      let current = steps[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break;
        current = section.id;
      }
      setActive(current);
    }

    function updateFragment() {
      const target = fragmentTarget();
      const current = sections.find(section => target && section.contains(target));
      const post = sources.find(source => source === target)?.dataset.quotePost;

      for (const source of sources) {
        source.toggleAttribute("data-quote-match", Boolean(post && source.dataset.quotePost === post));
      }
      if (current) setActive(current.id);
      else updatePosition();
    }

    function openExample(event: Event) {
      if (!(event instanceof MouseEvent) || event.defaultPrevented || event.button !== 0 ||
          event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      if (window.location.hash !== "#voorbeeld") window.history.pushState(null, "", "#voorbeeld");
      demo?.focus({ preventScroll: true });
      demo?.scrollIntoView({ behavior: "smooth" });
      updateFragment();
    }

    let frame: number | undefined;
    function trackPosition() {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        updatePosition();
      });
    }

    updateFragment();
    const illustrationObserver = illustration && typeof IntersectionObserver !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? new IntersectionObserver(([entry], observer) => {
          if (entry.intersectionRatio < illustrationThreshold) return;
          entry.target.setAttribute("data-quote-illustrated", "");
          observer.disconnect();
        }, { threshold: illustrationThreshold })
      : null;
    if (illustration) illustrationObserver?.observe(illustration);
    heroLink?.addEventListener("click", openExample);
    window.addEventListener("hashchange", updateFragment);
    window.addEventListener("scroll", trackPosition, { passive: true });
    window.addEventListener("resize", trackPosition);

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      illustrationObserver?.disconnect();
      heroLink?.removeEventListener("click", openExample);
      window.removeEventListener("hashchange", updateFragment);
      window.removeEventListener("scroll", trackPosition);
      window.removeEventListener("resize", trackPosition);
      for (const source of sources) source.removeAttribute("data-quote-match");
    };
  }, [steps]);

  return (
    <nav ref={navigation} className={s.workflow} aria-label="Stappen in de productdemo">
      <ol>
        {steps.map(({ id, label }, index) => {
          const Icon = stepIcons[id];
          return (
            <li key={id}>
              <a href={"#" + id} aria-current={active === id ? "location" : undefined}>
                <span className={s.stepSymbols} aria-hidden="true">
                  {Icon && <Icon size={16} />}
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </span>
                {label}
              </a>
              {index < steps.length - 1 && <ArrowRight className={s.workflowArrow} size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
