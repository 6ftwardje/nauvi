"use client";

import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import s from "./workflow.module.css";

export default function WorkflowSection({ onBooking }: { onBooking: () => void }) {
  return <section className={s.section} id="werkwijze" aria-labelledby="workflow-title">
    <div className={s.copy} data-reveal>
      <h2 id="workflow-title">Je team kent het werk.<br />De agent voert het uit.</h2>
      <p className={s.description}>We leggen jullie werkwijze vast, koppelen de juiste tools en automatiseren één taak tegelijk.</p>
      <button type="button" className={s.cta} onClick={onBooking}>Plan een kennismaking <ArrowUpRight size={18} aria-hidden="true" /></button>
      <p className={s.reassurance}>Jij houdt de controle over elke stap.</p>
    </div>

    <a className={s.demoLink} href="#mogelijkheden" data-reveal>
      <span className={s.demoIcon}><Mail size={20} aria-hidden="true" /></span>
      <span className={s.demoCopy}>
        <strong>Bekijk de interactieve demo</strong>
        <span>Van een klantvraag naar een antwoord dat je zelf kunt nakijken.</span>
      </span>
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  </section>;
}
