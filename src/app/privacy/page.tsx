import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/marketing-page";
import { ToConfirm } from "@/components/marketing/to-confirm";
import r from "@/components/marketing/reading-page.module.css";
import { homeFaq, pageMetadata } from "@/lib/seo";

// Preview only (D56). Every [TE BEVESTIGEN: …] must be replaced with a locked fact before this page goes to production.
export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy | Nauvi",
  description: "Hoe Nauvi omgaat met gegevens. Ontbrekende gegevens staan nog als te bevestigen.",
});

/** Restated word for word from the homepage FAQ, the only privacy statements already on the site. */
function FaqQuote({ question }: { question: string }) {
  const item = homeFaq.find(faq => faq.question === question);
  if (!item) throw new Error(`Missing homepage FAQ item: ${question}`);
  return (
    <blockquote className={r.quote}>
      {item.answer.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </blockquote>
  );
}

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <article className={r.page} aria-labelledby="privacy-heading">
        <header className={r.intro}>
          <h1 id="privacy-heading">Privacy</h1>
          <p>Hier lees je hoe Nauvi met gegevens omgaat. Deze pagina is nog niet af. Waar je ‘te bevestigen’ ziet, ontbreekt nog een gegeven. Een paar punten staan al in de veelgestelde vragen op de homepage. Die herhalen we hieronder.</p>
        </header>

        <section className={r.section} aria-labelledby="privacy-who">
          <h2 id="privacy-who">Wie we zijn</h2>
          <dl className={r.rows}>
            <div><dt>Naam</dt><dd><ToConfirm>wettelijke naam</ToConfirm></dd></div>
            <div><dt>Ondernemingsnummer</dt><dd><ToConfirm>ondernemingsnummer</ToConfirm></dd></div>
            <div><dt>BTW-nummer</dt><dd><ToConfirm>BTW-nummer</ToConfirm></dd></div>
            <div><dt>Adres</dt><dd><ToConfirm>adres</ToConfirm></dd></div>
          </dl>
        </section>

        <section className={r.section} aria-labelledby="privacy-data">
          <h2 id="privacy-data">Welke gegevens we verwerken</h2>
          <p><ToConfirm>welke gegevens, voor welke doelen</ToConfirm></p>
        </section>

        <section className={r.section} aria-labelledby="privacy-where">
          <h2 id="privacy-where">Waar gegevens staan</h2>
          <p className={r.source}>Dit staat al in de veelgestelde vragen op de homepage.</p>
          <FaqQuote question="Waar bewaren jullie onze gegevens?" />
          <FaqQuote question="Welk AI-model gebruiken jullie?" />
          <p>Om een kennismaking te plannen, gebruikt deze website Calendly. Daarmee plan je een afspraak.</p>
          <p>Overige verwerkers: <ToConfirm>overige verwerkers</ToConfirm></p>
        </section>

        <section className={r.section} aria-labelledby="privacy-retention">
          <h2 id="privacy-retention">Hoe lang we gegevens bewaren</h2>
          <p className={r.source}>Dit staat al in de veelgestelde vragen op de homepage.</p>
          <FaqQuote question="Hoelang bewaren jullie onze gegevens?" />
        </section>

        <section className={r.section} aria-labelledby="privacy-cookies">
          <h2 id="privacy-cookies">Cookies</h2>
          <p><ToConfirm>welke cookies, waarvoor, hoe je ze weigert</ToConfirm></p>
          <p>Op 24 november 2026 stond er in de HTML van de publieke homepage geen code van Google Analytics of gtag.</p>
        </section>

        <section className={r.section} aria-labelledby="privacy-contact">
          <h2 id="privacy-contact">Contact over privacy</h2>
          <p><ToConfirm>privacy-e-mail of ander contactpunt</ToConfirm></p>
          <p>Je kunt ook naar de <Link className={r.link} href="/contact">contactpagina</Link> gaan.</p>
        </section>
      </article>
    </MarketingShell>
  );
}
