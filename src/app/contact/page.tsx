import type { Metadata } from "next";
import Link from "next/link";
import { BookingButton, MarketingShell } from "@/components/marketing/marketing-page";
import { ToConfirm } from "@/components/marketing/to-confirm";
import shared from "@/components/marketing/cinematic.module.css";
import r from "@/components/marketing/reading-page.module.css";
import { pageMetadata } from "@/lib/seo";

// Preview only (D56). Every [TE BEVESTIGEN: …] must be replaced with a locked fact before this page goes to production.
export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact | Nauvi",
  description: "Plan een kennismaking of bekijk hoe je Nauvi bereikt.",
});

export default function ContactPage() {
  return (
    <MarketingShell>
      <article className={r.page} aria-labelledby="contact-heading">
        <header className={r.intro}>
          <h1 id="contact-heading">Contact</h1>
          <p>Plan een online kennismaking van 30 minuten. Vertel welke taak je uit handen wilt geven. Dan bekijken we samen wat daarvoor nodig is.</p>
          <BookingButton className={shared.darkButton}>Plan een kennismaking</BookingButton>
        </header>

        <section className={r.section} aria-labelledby="contact-details">
          <h2 id="contact-details">Gegevens</h2>
          <dl className={r.rows}>
            <div><dt>E-mail</dt><dd><ToConfirm>e-mail</ToConfirm></dd></div>
            <div><dt>Telefoon</dt><dd><ToConfirm>telefoon</ToConfirm></dd></div>
            <div><dt>Adres</dt><dd><ToConfirm>adres</ToConfirm></dd></div>
            <div><dt>Ondernemingsnummer / BTW</dt><dd><ToConfirm>ondernemingsnummer / BTW</ToConfirm></dd></div>
          </dl>
        </section>

        <section className={r.section} aria-labelledby="contact-privacy">
          <h2 id="contact-privacy">Privacy</h2>
          <p>Lees hoe we met gegevens omgaan op de <Link className={r.link} href="/privacy">privacypagina</Link>.</p>
        </section>
      </article>
    </MarketingShell>
  );
}
