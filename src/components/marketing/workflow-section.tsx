"use client";

import { ArrowUpRight, Video } from "lucide-react";
import s from "./workflow.module.css";

export default function WorkflowSection({ onBooking }: { onBooking: () => void }) {
  return <section className={s.section} id="werkwijze" aria-labelledby="workflow-title">
    <div className={s.copy} data-reveal>
      <h2 id="workflow-title">Je team kent het werk.<br />De agent voert het uit.</h2>
      <p className={s.description}>We leggen jullie werkwijze vast, koppelen de juiste tools en automatiseren één taak tegelijk.</p>
      <button type="button" className={s.cta} onClick={onBooking}>Plan een kennismaking <ArrowUpRight size={18} aria-hidden="true" /></button>
      <p className={s.reassurance}>Jij houdt de controle over elke stap.</p>
    </div>

    <div className={s.videoPlaceholder} data-reveal>
      <Video size={32} aria-hidden="true" />
      <span>Video volgt</span>
    </div>
  </section>;
}
