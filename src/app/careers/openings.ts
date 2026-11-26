import { marketingConfig } from "@/components/marketing/site-config";

export const openings = [
  {
    slug: "sales",
    title: "Sales",
    contractType: "Freelance",
    summary: "Je gaat in gesprek met zaakvoerders en teams bij bouwbedrijven. Je ontdekt waar ze tijd verliezen, laat zien wat Nauvi kan overnemen en begeleidt hen van het eerste gesprek tot een voorstel voor een eerste toepassing.",
    responsibilities: [
      "Je voert kennismakingen met bouw- en installatiebedrijven en vraagt hoe hun team taken zoals offertes of werfverslagen vandaag aanpakt.",
      "Je kiest samen met de klant en een engineer welke taak geschikt is om mee te beginnen.",
      "Je werkt het voorstel uit en volgt vragen en afspraken op tot het team klaar is om de eerste taak te testen.",
    ],
    fit: "Je kunt doorvragen over een werkproces, de belangrijkste afspraak helder verwoorden en een voorstel bespreken met mensen die de taak elke dag uitvoeren.",
  },
  {
    slug: "forward-deployed-engineer",
    title: "Forward Deployed Engineer",
    contractType: "Freelance",
    summary: "Je werkt rechtstreeks met klanten. Je brengt hun werkwijze in kaart, bouwt AI-agents en koppelt die aan hun bestaande tools. Met het team van de klant test je of de agent het werk goed uitvoert en stuur je bij waar nodig.",
    responsibilities: [
      "Je brengt met de klant de invoer, werkafspraken en uitzonderingen van één terugkerende taak in kaart.",
      "Je bouwt de workflow en sluit de agent aan op de systemen die voor de taak nodig zijn.",
      "Je test de uitkomst met gewone dossiers en uitzonderingen. Samen spreek je af wat de klant vóór gebruik of verzending controleert.",
    ],
    fit: "Je kunt zelfstandig een koppeling of workflow uitwerken en aan een klant uitleggen waarom de agent in een bepaald geval een antwoord geeft of om nazicht vraagt.",
  },
] as const;

export function applicationHref(title: string) {
  const configuredAddress = process.env.NAUVI_CAREERS_EMAIL?.trim() ?? "";
  const address = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(configuredAddress)
    ? configuredAddress
    : marketingConfig.careersEmail;

  return `mailto:${address}?subject=${encodeURIComponent(`Sollicitatie voor ${title} bij Nauvi`)}`;
}
