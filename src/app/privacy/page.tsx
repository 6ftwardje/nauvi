import type { Metadata } from "next";
import { MarketingIntro } from "@/components/marketing/cinematic-subpage";
import { MarketingShell } from "@/components/marketing/marketing-page";
import { marketingConfig } from "@/components/marketing/site-config";
import s from "@/components/marketing/website-info.module.css";

export const metadata: Metadata = {
  title: "Privacyverklaring | Nauvi",
  description: "Lees hoe Nauvi omgaat met persoonsgegevens bij websitebezoek, contact, kennismakingen en sollicitaties.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const { contactEmail } = marketingConfig;

  return (
    <MarketingShell>
      <MarketingIntro title="Privacy" description="Zo verwerkt Nauvi persoonsgegevens wanneer je deze website bezoekt, contact opneemt, een afspraak maakt of solliciteert." />
      <div className={s.privacy}>
        <section aria-labelledby="privacy-controller">
          <h2 id="privacy-controller">Wie verwerkt je gegevens?</h2>
          <p>Nauvi is verantwoordelijk voor de verwerkingen die op deze pagina beschreven staan. Voor vragen of verzoeken over je persoonsgegevens kun je mailen naar <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
        </section>

        <section aria-labelledby="privacy-site">
          <h2 id="privacy-site">Websitebezoek</h2>
          <p>Netlify verwerkt technische gegevens bij je bezoek, zoals het IP-adres, het tijdstip en de gevraagde pagina. We hebben een gerechtvaardigd belang om de website bereikbaar te houden, storingen te onderzoeken en misbruik tegen te gaan.</p>
          <p>Als je de agenda opent op deze website of via de boekingslink, kan Calendly cookies gebruiken. Informatie over die cookies en voorkeuren staat in de <a href="https://calendly.com/legal/privacy-notice">privacyverklaring van Calendly</a>.</p>
        </section>

        <section aria-labelledby="privacy-booking">
          <h2 id="privacy-booking">Contact en afspraken</h2>
          <p>We gebruiken je naam, e-mailadres en de informatie die je zelf deelt om je vraag te beantwoorden en je afspraak te regelen. We doen dat op jouw verzoek als voorbereiding op een mogelijke overeenkomst, of vanuit ons gerechtvaardigd belang om vragen aan Nauvi op te volgen.</p>
          <p>Voor afspraken gebruiken we Calendly. Als je uitsluitend per e-mail contact wilt opnemen, kun je ons rechtstreeks mailen.</p>
        </section>

        <section id="sollicitaties" aria-labelledby="privacy-applications">
          <h2 id="privacy-applications">Sollicitaties</h2>
          <p>Als je solliciteert, gebruiken we je contactgegevens, de functie waarvoor je reageert en de documenten die je meestuurt. We verwerken die gegevens op jouw verzoek om je kandidatuur te beoordelen en met je te communiceren over een mogelijke samenwerking.</p>
        </section>

        <section aria-labelledby="privacy-providers">
          <h2 id="privacy-providers">Leveranciers en verwerking buiten de EER</h2>
          <p>Onze leveranciers ondersteunen ons bij websitehosting, e-mail en het plannen van afspraken. Netlify en Calendly kunnen gegevens buiten de Europese Economische Ruimte verwerken. Hun verwerkingsovereenkomsten beschrijven de waarborgen voor doorgifte, waaronder standaardcontractbepalingen. Je kunt ons om meer informatie over toepasselijke waarborgen vragen.</p>
          <p>Lees de verwerkingsovereenkomsten van <a href="https://www.netlify.com/pdf/netlify-dpa.pdf">Netlify</a> en <a href="https://calendly.com/legal/data-processing-addendum">Calendly</a>.</p>
        </section>

        <section aria-labelledby="privacy-retention">
          <h2 id="privacy-retention">Hoelang bewaren we je gegevens?</h2>
          <p>We bewaren technische gegevens zolang dat nodig is om de website te beheren en te beveiligen. Contactgegevens bewaren we zolang dat nodig is om je vraag, afspraak of de opvolging ervan af te handelen. Sollicitatiegegevens gebruiken we zolang de procedure loopt en voor de afhandeling ervan. Een wettelijke verplichting of een geschil kan een langere bewaartermijn vragen.</p>
        </section>

        <section aria-labelledby="privacy-rights">
          <h2 id="privacy-rights">Je rechten</h2>
          <p>Je kunt inzage, verbetering, verwijdering, beperking of overdracht van je gegevens vragen. Je kunt bezwaar maken tegen verwerking op basis van gerechtvaardigd belang. Als we gegevens met je toestemming verwerken, kun je die toestemming intrekken.</p>
          <p>Stuur je verzoek naar <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Je kunt ook een klacht indienen bij de <a href="https://www.gegevensbeschermingsautoriteit.be/burger/acties/klacht-indienen">Gegevensbeschermingsautoriteit</a>.</p>
        </section>
      </div>
    </MarketingShell>
  );
}
