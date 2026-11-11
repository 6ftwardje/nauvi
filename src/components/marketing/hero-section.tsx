"use client";

import { ArrowUpRight } from "lucide-react";
import { publicPath } from "@/lib/public-path";
import { AccentLine, Kicker } from "./editorial";
import e from "./editorial.module.css";
import s from "./hero.module.css";

const familiarTools = [
  { id: "googledrive", name: "Google Drive" },
  { id: "microsoft", name: "Microsoft 365" },
  { id: "slack", name: "Slack" },
  { id: "gmail", name: "Gmail" },
  { id: "notion", name: "Notion" },
  { id: "hubspot", name: "HubSpot" },
];

// Editorial references to public work on organizational knowledge and AI.
// These are sources, not Nauvi customers or endorsements.
const knowledgeReferences = [
  { id: "microsoft", name: "Microsoft", subject: "Work IQ", href: "https://techcommunity.microsoft.com/blog/microsoft365copilotblog/a-closer-look-at-work-iq/4499789" },
  { id: "notion", name: "Notion", subject: "Gedeelde context voor agents", href: "https://www.notion.com/releases" },
  { id: "atlassian", name: "Atlassian", subject: "Teamwork Graph", href: "https://www.atlassian.com/blog/company-news/inside-rovo-mcp-usage" },
  { id: "dropbox", name: "Dropbox", subject: "Dash als second brain", href: "https://dash.dropbox.com/resources/universal-search-files-typos" },
];

export default function HeroSection({ onStart }: { onStart: () => void }) {
  return <>
    <section className={s.hero} data-inverse aria-labelledby="hero-title">
      <img
        className={s.cover}
        src={publicPath("/marketing/editorial/cover-company-brain.webp")}
        alt=""
        width={1588}
        height={2246}
      />
      <div className={s.inner}>
        <Kicker>Nauvi / Company Brain</Kicker>
        <h1 className={s.headline} id="hero-title">Je bedrijfskennis.</h1>
        <AccentLine>Op één plek.</AccentLine>
        <p className={s.description}>Nauvi verzamelt je bedrijfskennis, documenten en processen op één plek. Zo kan je team, en straks ook AI-agents, verder met de juiste context.</p>
        <div className={s.actions}>
          <button type="button" className={e.buttonLight} onClick={onStart}>Plan een kennismaking <ArrowUpRight size={16} aria-hidden="true" /></button>
          <a className={s.secondary} href="#werkwijze">Hoe het werkt</a>
        </div>
        <p className={s.tagline}>Een digitaal atelier, onder menselijke regie.</p>
      </div>
    </section>

    <div className={s.band}>
      <div className={s.heroTools}>
        <p>Met de tools die je team al gebruikt</p>
        <ul aria-label="Voorbeelden van tools voor koppelingen op maat">
          {familiarTools.map(tool => <li key={tool.id}><img src={publicPath(`/marketing/logos/${tool.id}.svg`)} width={22} height={22} alt="" /><span>{tool.name}</span></li>)}
        </ul>
      </div>
      <div className={s.companyLogos} aria-label="Publieke verhalen over bedrijfskennis en AI">
        <div className={s.referenceIntro}>
          <p>Een bedrijfsbrein is geen ver toekomstbeeld.</p>
          <span>Ook deze bedrijven bouwen aan gedeelde kennis voor AI. Publieke bronnen, geen klanten van Nauvi.</span>
        </div>
        <ul className={s.logoList}>
          {knowledgeReferences.map(reference => <li key={reference.id}>
            <a href={reference.href} target="_blank" rel="noopener noreferrer" aria-label={`${reference.name}: ${reference.subject} — publieke bron (opent in nieuw tabblad)`}>
              <span className={s.referenceBrand}><img src={publicPath(`/marketing/logos/${reference.id}.svg`)} width={22} height={22} alt="" /><strong>{reference.name}</strong><ArrowUpRight size={13} aria-hidden="true" /></span>
              <span className={s.referenceSubject}>{reference.subject}</span>
            </a>
          </li>)}
        </ul>
      </div>
    </div>
  </>;
}
