"use client";

import { ClipboardCheck, FileText, Mail, Pause, Play } from "lucide-react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./agents-page.module.css";

const stages = [
  { label: "De aanvraag komt binnen", text: "Een klant mailt plannen voor een renovatie en vraagt een offerte.", Icon: Mail },
  { label: "De agent maakt het dossier aan", text: "De agent haalt de projectgegevens uit de mail en bijlagen en duidt aan wat nog ontbreekt.", Icon: FileText },
  { label: "Je collega kijkt het dossier na", text: "Je collega controleert het dossier en beslist welke vragen nog naar de klant gaan.", Icon: ClipboardCheck },
];

export function AgentsWorkflow() {
  const figure = useRef<HTMLElement>(null);
  const inView = useInView(figure, { amount: 0.3 });
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <figure className={s.flow} ref={figure} aria-labelledby="agents-flow-caption" data-playing={inView && pageVisible && !paused}>
      <figcaption id="agents-flow-caption">Voorbeeld: een offerteaanvraag</figcaption>
      <button className={s.flowToggle} type="button" aria-label={paused ? "Hervat de animatie" : "Pauzeer de animatie"} onClick={() => setPaused(value => !value)}>
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
      <ol role="list">
        {stages.map(({ label, text, Icon }) => (
          <li key={label}>
            <span className={s.stageIcon} aria-hidden="true"><Icon size={20} /></span>
            <div><h3>{label}</h3><p>{text}</p></div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
