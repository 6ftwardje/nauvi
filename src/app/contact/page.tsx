import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarketingIntro } from "@/components/marketing/cinematic-subpage";
import { MarketingShell } from "@/components/marketing/marketing-page";
import { marketingConfig } from "@/components/marketing/site-config";
import shared from "@/components/marketing/cinematic.module.css";
import s from "@/components/marketing/website-info.module.css";

export const metadata: Metadata = {
  title: "Contact | Nauvi",
  description: "Plan een kennismaking met Nauvi of stuur ons een e-mail over het werk dat je wilt automatiseren.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { calendlyUrl, contactEmail, hostName, hostPortrait } = marketingConfig;

  return (
    <MarketingShell>
      <MarketingIntro title="Contact" description="Vertel ons welke taak je team tijd kost. We bekijken samen wat Nauvi kan overnemen." />
      <div className={s.contact}>
        <section aria-labelledby="contact-booking">
          <h2 id="contact-booking">Plan een kennismaking</h2>
          <div className={s.host}>
            <img src={hostPortrait} alt="" width={64} height={64} decoding="async" />
            <div><strong>{hostName}</strong><span>Jouw eerste aanspreekpunt bij Nauvi</span></div>
          </div>
          <p>In een online gesprek van 30 minuten bespreken we je werkwijze en kiezen we welke taak we als eerste kunnen bekijken.</p>
          <a className={shared.darkButton} href={calendlyUrl}>Kies een moment via Calendly <ArrowUpRight size={15} aria-hidden="true" /></a>
        </section>

        <section aria-labelledby="contact-email">
          <h2 id="contact-email">Stuur ons een mail</h2>
          <p>Stel je vraag of vertel kort hoe je team die taak vandaag aanpakt.</p>
          <a className={s.textLink} href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <p className={s.note}>Lees hoe we omgaan met je gegevens in onze <Link className={s.textLink} href="/privacy">privacyverklaring</Link>.</p>
        </section>
      </div>
    </MarketingShell>
  );
}
