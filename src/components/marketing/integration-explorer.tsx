"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useInView } from "motion/react";
import { integrations } from "./cinematic-content";
import s from "./marketing.module.css";

const categories = ["Alles", "Kennis", "Communicatie", "CRM & sales", "Projecten", "Commerce", "Automatisering"];

function Logo({ id }: { id: string }) {
  return <img src={`/marketing/logos/${id}.svg`} alt="" width={30} height={30} />;
}

export function IntegrationExplorer() {
  const [category, setCategory] = useState("Alles");
  const [query, setQuery] = useState("");
  const [staticTools, setStaticTools] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const marquee = useRef<HTMLDivElement>(null);
  const inView = useInView(marquee);
  const searching = category !== "Alles" || query !== "";
  const term = query.toLowerCase();
  const filtered = integrations.filter(tool =>
    (category === "Alles" || tool.category === category) && tool.name.toLowerCase().includes(term)
  );
  const midpoint = Math.ceil(integrations.length / 2);
  const rows = [integrations.slice(0, midpoint), integrations.slice(midpoint)];

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return <div className={s.integrationExplorer} data-reveal data-searching={searching || undefined} data-static-tools={staticTools || undefined}>
    <label className={s.toolSearch}>
      <Search size={17} aria-hidden="true" />
      <input type="search" placeholder="Zoek jouw tool…" aria-label="Zoek een tool" value={query} onChange={event => setQuery(event.target.value)} />
    </label>
    <div className={s.filters} role="group" aria-label="Filter tools">
      {categories.map(item => (
        <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
      ))}
    </div>
    <div className={s.toolGrid} aria-live="polite">
      {filtered.length
        ? filtered.map(tool => <div key={tool.id} className={s.toolItem}><Logo id={tool.id} /><span>{tool.name}</span></div>)
        : <p className={s.emptyTools}>Deze tool staat niet in het overzicht. Bespreek je wensen tijdens de kennismaking.</p>}
    </div>
    <div className={s.integrationMarquee} ref={marquee} data-running={inView && pageVisible} aria-hidden="true">
      {rows.map((row, index) => <div className={s.marqueeRow} key={index}>
        {[0, 1].map(copy => <ul className={s.marqueeGroup} key={copy}>
          {row.map(tool => <li key={tool.id}><Logo id={tool.id} /><span>{tool.name}</span></li>)}
        </ul>)}
      </div>)}
    </div>
    <button className={s.marqueeToggle} type="button" aria-pressed={staticTools} onClick={() => setStaticTools(value => !value)}>Statische lijst</button>
    <p className={s.toolsDisclaimer}>Onze ontwikkelaars bouwen deze koppelingen op maat.</p>
  </div>;
}
