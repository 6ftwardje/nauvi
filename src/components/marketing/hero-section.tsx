"use client";

import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { CompanyBrain } from "./company-brain";
import { GradientSection } from "./gradient-section";
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

function HeroTools() {
  return <div className={s.heroTools}>
    <p>Met de tools die je team al gebruikt</p>
    <ul aria-label="Voorbeelden van tools voor koppelingen op maat">
      {familiarTools.map(tool => <li key={tool.id}><img src={`/marketing/logos/${tool.id}.svg`} width={23} height={23} alt="" /><span>{tool.name}</span></li>)}
    </ul>
  </div>;
}

function CompanyLogos() {
  return <div className={s.companyLogos} aria-label="Publieke verhalen over bedrijfskennis en AI">
    <div className={s.referenceIntro}><p>Een bedrijfsbrein is geen ver toekomstbeeld.</p><span>Ook deze bedrijven bouwen aan gedeelde kennis voor AI.</span></div>
    <ul className={s.logoList}>
      {knowledgeReferences.map(reference => <li key={reference.id} className={s.companyLogo}>
        <a href={reference.href} target="_blank" rel="noopener noreferrer" aria-label={`${reference.name}: ${reference.subject} — publieke bron (opent in nieuw tabblad)`}>
          <span className={s.referenceBrand}><img src={`/marketing/logos/${reference.id}.svg`} width={26} height={26} alt="" /><strong>{reference.name}</strong><ArrowUpRight size={13} aria-hidden="true" /></span>
          <span className={s.referenceSubject}>{reference.subject}</span>
        </a>
      </li>)}
    </ul>
  </div>;
}

export default function HeroSection({ onStart }: { onStart: () => void }) {
  return <GradientSection gradient="hero" className={s.hero} aria-labelledby="hero-title">
    <div className={s.inner}>
      <div className={s.copy}>
        <h1 className={s.headline} id="hero-title">Is jouw bedrijf klaar voor de <mark>toekomst</mark> van AI?</h1>
        <p className={s.description}>Nauvi verzamelt je bedrijfskennis, documenten en processen op één plek. Zo kan je team, en straks ook AI-agents, verder met de juiste context.</p>
        <div className={s.actions}><button type="button" className={s.primary} onClick={onStart}>Maak je bedrijf AI klaar <ArrowRight size={19} aria-hidden="true" /></button><a className={s.secondary} href="#werkwijze">Hoe het werkt <ChevronRight size={18} aria-hidden="true" /></a></div>
        <HeroTools />
      </div>
      <CompanyBrain />
    </div>
    <CompanyLogos />
  </GradientSection>;
}
