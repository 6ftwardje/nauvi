"use client";

import { ArrowUpRight } from "lucide-react";
import { publicPath } from "@/lib/public-path";
import { AccentLine, Kicker } from "./editorial";
import e from "./editorial.module.css";
import s from "./workflow.module.css";

export default function WorkflowSection({ onBooking }: { onBooking: () => void }) {
  return <section className={s.section} id="werkwijze" aria-labelledby="workflow-title">
    <figure className={s.figure}>
      <img src={publicPath("/marketing/editorial/research-dna.webp")} alt="Een teal dossier met een DNA-helix en een vergrootglas." width={933} height={1400} />
    </figure>
    <div className={s.copy}>
      <Kicker>Werkwijze</Kicker>
      <h2 id="workflow-title">Je team kent het werk.</h2>
      <AccentLine>De agent voert het uit.</AccentLine>
      <p className={s.description}>We leggen jullie werkwijze vast, koppelen de juiste tools en automatiseren één taak tegelijk.</p>
      <button type="button" className={e.button} onClick={onBooking}>Plan een kennismaking <ArrowUpRight size={16} aria-hidden="true" /></button>
      <p className={s.reassurance}>Jij houdt de controle over elke stap.</p>
      <a className={s.demoLink} href="#mogelijkheden">Bekijk de interactieve demo</a>
    </div>
  </section>;
}
