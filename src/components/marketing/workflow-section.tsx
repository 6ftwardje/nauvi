"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowUpRight, CheckCircle2, FileCheck2, Layers, Mail } from "lucide-react";
import s from "./workflow.module.css";

const workflow = [
  { icon: Mail, title: "Nieuwe aanvraag", description: "Klant vraagt een offerte" },
  { icon: Layers, title: "Bedrijfskennis", description: "Prijzen · afspraken · werkwijze" },
  { icon: FileCheck2, title: "Conceptofferte klaar", description: "Gegenereerd ter controle" },
];

export default function WorkflowSection({ onBooking }: { onBooking: () => void }) {
  const visual = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = visual.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRevealed(true);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <section className={s.section} id="werkwijze" aria-labelledby="workflow-title">
    <div className={s.copy} data-reveal>
      <h2 id="workflow-title">Je team kent het werk.<br />De agent voert het uit.</h2>
      <p className={s.description}>We leggen jullie werkwijze vast, koppelen de juiste tools en automatiseren één taak tegelijk.</p>
      <button type="button" className={s.cta} onClick={onBooking}>Plan een kennismaking <ArrowUpRight size={18} aria-hidden="true" /></button>
      <p className={s.reassurance}>Jij houdt de controle over elke stap.</p>
    </div>

    <figure className={s.visual} ref={visual} data-revealed={revealed} data-reveal aria-labelledby="workflow-example-title">
      <div className={s.panel}>
        <span className={s.exampleLabel}>In de praktijk</span>
        <h3 id="workflow-example-title">Van aanvraag naar conceptofferte</h3>
        <ol className={s.nodes} aria-label="Voorbeeldworkflow van aanvraag naar conceptofferte">
          {workflow.map(({ icon: Icon, title, description }, index) => <li className={s.node} data-knowledge={index === 1} key={title} style={{ "--flow-order": index } as CSSProperties}>
            <span className={s.nodeIcon} aria-hidden="true"><Icon size={26} strokeWidth={1.6} /></span>
            <h4>{title}</h4>
            <p>{description}</p>
            {index < workflow.length - 1 && <svg className={s.connector} viewBox="0 0 32 8" fill="none" aria-hidden="true">
              <path className={s.connectionBase} d="M2 4H30" />
              <path className={s.connectionProgress} d="M2 4H30" pathLength={1} />
              <circle cx="2" cy="4" r="2.5" /><circle cx="30" cy="4" r="2.5" />
            </svg>}
          </li>)}
        </ol>
        <div className={s.approval}>
          <CheckCircle2 size={32} strokeWidth={1.7} aria-hidden="true" />
          <div><strong>Klaar voor jouw goedkeuring</strong><p>Er wordt niets verstuurd zonder akkoord.</p></div>
        </div>
      </div>
      <figcaption className={s.caption}>Voorbeeld van maatwerk. We spreken per taak af wat de agent doet en wanneer jij beslist.</figcaption>
    </figure>
  </section>;
}
