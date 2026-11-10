export const brainSources = [
  { id: "folders", label: "Gedeelde mappen", short: "Mappen", detail: "Documenten en versies", logo: "googledrive", x: 12, y: 23, anchor: [-.55, .34] },
  { id: "chats", label: "Teamchats", short: "Teamchats", detail: "Vragen en antwoorden", logo: "slack", x: 88, y: 21, anchor: [.52, .42] },
  { id: "emails", label: "E-mails", short: "E-mails", detail: "Klantafspraken", logo: "gmail", x: 12, y: 68, anchor: [-.54, -.20] },
  { id: "documents", label: "Documenten", short: "Documenten", detail: "Offertes en processen", logo: null, x: 88, y: 67, anchor: [.55, -.27] },
  { id: "crm", label: "CRM", short: "CRM", detail: "Contacten en klantdossiers", logo: "hubspot", x: 0, y: 0, anchor: [.15, .52] },
  { id: "colleagues", label: "Collega’s", short: "Collega’s", detail: "Ervaring en knowhow", logo: null, x: 0, y: 0, anchor: [-.22, -.31] },
] as const;

export type BrainSource = typeof brainSources[number];
export type BrainSourceId = BrainSource["id"];

export const brainQuestions = [
  {
    question: "Hoe maken we een offerte?",
    answer: "Volgens jullie werkwijze begint een offerte met de klantaanvraag. Daarna verzamelen jullie de projectgegevens en controleren jullie de prijsberekening.",
    source: "Werkwijze offertes",
    connections: ["documents", "emails"],
  },
  {
    question: "Wat is onze werkwijze?",
    answer: "Registreer de aanvraag, wijs een verantwoordelijke toe en spreek de volgende stap af. Bespreek uitzonderingen met de zaakvoerder.",
    source: "Werkafspraken en verantwoordelijkheden",
    connections: ["chats", "documents"],
  },
  {
    question: "Waar staat dat document?",
    answer: "De goedgekeurde offerte staat bij het klantdossier in de gedeelde map. Daar vind je ook de laatste versie en de bijbehorende afspraken.",
    source: "Afspraken over klantdossiers",
    connections: ["folders"],
  },
] as const satisfies readonly {
  question: string;
  answer: string;
  source: string;
  connections: readonly BrainSourceId[];
}[];
