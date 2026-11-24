import type { Metadata } from "next";
import { applications } from "@/components/marketing/cinematic-content";

/** Canonicals, sitemap and schema always point at the production host, also on a Preview. */
export const siteOrigin = "https://nauvi.ai";
export const siteUrl = `${siteOrigin}/`;
export const siteName = "Nauvi";

type ShareImage = { url: string; width: number; height: number };

/** Existing share images only (see SPEC §3). Do not add or crop new files for this. */
export const shareImages = {
  default: { url: "/marketing/cinematic/hero-poster.webp", width: 1280, height: 662 },
  platform: { url: "/marketing/cinematic/brain-field.webp", width: 1344, height: 752 },
  agents: { url: "/marketing/agents/hero.webp", width: 1344, height: 752 },
} satisfies Record<string, ShareImage>;

/** Indexable marketing routes, without trailing slash. Old paths that 301 (see netlify.toml) and /app never belong here. */
export const indexableRoutes = [
  "/",
  "/platform",
  "/agents",
  "/werkwijze",
  "/toepassingen",
  ...applications.map(({ slug }) => `/toepassingen/${slug}`),
  "/over-nauvi",
  "/careers",
  "/privacy",
  "/contact",
];

export function absoluteUrl(path: string): string {
  return path === "/" ? siteUrl : `${siteOrigin}${path}`;
}

/** Per-page metadata: keeps the page's own title and description and adds canonical, Open Graph and Twitter. */
export function pageMetadata({ path, title, description, image = shareImages.default }: {
  path: string;
  title: string;
  description: string;
  image?: ShareImage;
}): Metadata {
  const url = absoluteUrl(path);
  const images = [{ ...image, url: absoluteUrl(image.url) }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "nl_BE", siteName, title, description, url, images },
    twitter: { card: "summary_large_image", title, description, images: images.map(({ url }) => url) },
  };
}

const organizationId = `${siteUrl}#organization`;

/**
 * Site-wide WebSite + Organization. Only facts already on the site: the brand name and an existing logo file.
 * address, telephone, email, taxID, vatID and sameAs stay out until OPEN-FACTS.md is locked.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: siteUrl,
        logo: absoluteUrl("/brand/nauvi-logo-primary.svg"),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: siteName,
        url: siteUrl,
        inLanguage: "nl-BE",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/** The homepage FAQ (/#vragen). One source for the visible answers and the FAQPage schema. */
export const homeFaq: { question: string; answer: string[] }[] = [
  {
    question: "Koop ik software of nemen jullie werk over?",
    answer: [
      "We nemen afgesproken taken over met AI-agents. In Nauvi leggen we vast hoe je bedrijf werkt, zodat de agents jouw werkwijze kunnen volgen.",
      "We kiezen samen een eerste taak en spreken af hoe we het resultaat controleren. De kostprijs bepalen we per opdracht.",
    ],
  },
  {
    question: "Is dit iets voor ons?",
    answer: ["Nauvi is er voor kmo’s waar kennis verspreid zit over collega’s, mails en documenten. Je hebt geen ervaring met AI-agents nodig. In de kennismaking bekijken we welke taak je als eerste kunt uitbesteden."],
  },
  {
    question: "Moeten we alles omgooien?",
    answer: ["We vertrekken van hoe je team vandaag werkt. We beginnen met één taak en bekijken samen wat er voor die taak moet veranderen."],
  },
  {
    question: "Werkt het met onze tools?",
    answer: ["Onze ontwikkelaars bouwen koppelingen op maat. Welke koppelingen nodig en haalbaar zijn, hangt af van je tools en de taak die je wilt uitbesteden."],
  },
  {
    question: "Waar bewaren jullie onze gegevens?",
    answer: [
      "Je klantomgeving draait bij Hetzner in Duitsland. We maken back-ups van de database, zodat we die bij een storing kunnen herstellen.",
      "Voor de start spreken we af wie toegang krijgt en welke bronnen een agent mag gebruiken.",
    ],
  },
  {
    question: "Welk AI-model gebruiken jullie?",
    answer: [
      "We gebruiken momenteel Claude van Anthropic. Gegevens die we voor een taak aan Claude doorgeven, kunnen buiten de EU worden verwerkt en opgeslagen.",
      "Anthropic gebruikt invoer en antwoorden uit zijn zakelijke diensten standaard niet voor modeltraining. We willen overstappen zodra een Europees model onze taken even betrouwbaar kan uitvoeren.",
    ],
  },
  {
    question: "Hoelang bewaren jullie onze gegevens?",
    answer: [
      "We verwijderen de klantgegevens die we zelf bewaren zodra we ze niet meer nodig hebben. Dat doen we uiterlijk 12 maanden na het einde van de samenwerking.",
      "Je kunt je vastgelegde bedrijfskennis controleren en exporteren. Je kunt ons ook vragen om je gegevens eerder te verwijderen.",
    ],
  },
  {
    question: "Hoe krijg ik toegang als testgebruiker?",
    answer: ["Open je persoonlijke uitnodigingslink om toegang te krijgen tot de testomgeving."],
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "nl-BE",
    mainEntity: homeFaq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer.join(" ") },
    })),
  };
}
