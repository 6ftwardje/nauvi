export const photos = {
  hero: "/marketing/cinematic/hero-poster.webp",
  office: "/marketing/cinematic/office.webp",
  site: "/marketing/cinematic/site.webp",
  team: "/marketing/cinematic/team.webp",
  warehouse: "/marketing/cinematic/warehouse.webp",
  workshop: "/marketing/cinematic/workshop.webp",
  survey: "/marketing/cinematic/survey.webp",
  handover: "/marketing/cinematic/handover.webp",
  intake: "/marketing/cinematic/intake.webp",
  brainField: "/marketing/cinematic/brain-field.webp",
};

export const agentPhotos = {
  hero: "/marketing/agents/hero.webp",
  estimation: "/marketing/agents/estimation.webp",
  site: "/marketing/agents/site.webp",
  materials: "/marketing/agents/materials.webp",
};

export const applications = [
  {
    slug: "offertes-voorbereiden",
    title: "Offertes voorbereiden",
    category: "Aanvragen & offertes",
    image: "/marketing/solutions/solution-quotation-preparation.webp",
    description: "Een agent leest het bestek, haalt de posten eruit en past je prijslijsten en offertemodel toe.",
    result: "Een conceptofferte die je team kan nakijken.",
  },
  {
    slug: "werfverslagen-maken",
    title: "Van spraakbericht naar werfverslag",
    category: "Werf & planning",
    image: "/marketing/solutions/solution-voice-to-report.webp",
    description: "Spreek je update in op de werf. Een agent gebruikt je opname en werffoto’s om een verslag op te stellen volgens jullie werkwijze.",
    result: "Een werfverslag met de afgesproken actiepunten.",
    seo: {
      title: "Werfverslag maken met spraak en foto’s | Nauvi",
      description: "Maak een werfverslag uit spraak en foto’s. Beluister de werfnotitie, bekijk de actiepunten en download het ingevulde voorbeeld of het Word-sjabloon.",
    },
  },
  {
    slug: "leveranciers-vergelijken",
    title: "Leveranciersoffertes vergelijken",
    category: "Kosten & facturatie",
    image: "/marketing/solutions/solution-supplier-comparison.webp",
    description: "Een agent zet prijzen, aantallen, levertermijnen en uitsluitingen uit je leveranciersoffertes naast elkaar.",
    result: "Je ziet de verschillen in één overzicht en kiest zelf bij wie je bestelt.",
  },
  {
    slug: "aanvragen-verwerken",
    title: "Van aanvraag naar dossier",
    category: "Aanvragen & offertes",
    image: "/marketing/solutions/solution-project-dossier.webp",
    description: "Een agent maakt van een mail of formulier een dossier en duidt aan welke info nog ontbreekt.",
    result: "Je team heeft de aanvraag en de open vragen op één plek.",
  },
  {
    slug: "leverbonnen-verwerken",
    title: "Leverbonnen verwerken per werf",
    category: "Werf & planning",
    image: "/marketing/solutions/solution-delivery-notes.webp",
    description: "Een agent leest foto’s van lever- en werkbonnen en stelt voor welke uren, materialen en aantallen bij welke werf horen.",
    result: "Een registratie die je ploeg kan controleren.",
  },
  {
    slug: "facturen-opvolgen",
    title: "Facturen voorbereiden en opvolgen",
    category: "Kosten & facturatie",
    image: "/marketing/solutions/solution-invoice-processing.webp",
    description: "Een agent bereidt facturen voor op basis van goedgekeurde prestaties en houdt de vervaldagen bij.",
    result: "Conceptfacturen en een overzicht van de vervaldagen.",
  },
  {
    slug: "offertes-opvolgen",
    title: "Openstaande offertes opvolgen",
    category: "Aanvragen & offertes",
    image: "/marketing/solutions/solution-quotation-followup.webp",
    description: "Een agent signaleert offertes die nog geen antwoord kregen en stelt met de klantafspraken erbij een opvolgbericht voor.",
    result: "Een opvolgbericht dat klaarstaat voor nazicht.",
  },
  {
    slug: "meerwerken-signaleren",
    title: "Mogelijke meerwerken signaleren",
    category: "Werf & planning",
    image: "/marketing/cinematic/meerwerken.webp",
    description: "Een agent vergelijkt mails en werfnotities met de offerte en brengt mogelijke meerwerken onder je aandacht.",
    result: "Een overzicht van mogelijke meerwerken om zelf te beoordelen.",
  },
  {
    slug: "werfplanning-ondersteunen",
    title: "Conflicten in de werfplanning signaleren",
    category: "Werf & planning",
    image: "/marketing/solutions/solution-planning-conflicts.webp",
    description: "Een agent legt ploegbezetting, leveringen en werfvoortgang naast elkaar en signaleert wanneer die botsen.",
    result: "Een voorstel voor een aangepaste planning.",
  },
  {
    slug: "werfmarges-bewaken",
    title: "Werfmarges bewaken",
    category: "Kosten & facturatie",
    image: "/marketing/solutions/solution-site-margins.webp",
    description: "Een agent vergelijkt het werfbudget met de geboekte uren, aankopen en kosten van onderaannemers.",
    result: "Een overzicht van kostenafwijkingen per werf.",
  },
];

export const applicationCategories = [
  {
    id: "aanvragen",
    label: "Aanvragen & offertes",
    image: photos.office,
    text: "Van een nieuwe aanvraag in je inbox tot een conceptofferte die je kunt nakijken.",
  },
  {
    id: "werf",
    label: "Werf & planning",
    image: photos.workshop,
    text: "Maak van spraaknotities en foto’s een werfverslag en verwerk bonnen per werf.",
  },
  {
    id: "kosten",
    label: "Kosten & facturatie",
    image: photos.warehouse,
    text: "Vergelijk leveranciers en bereid facturen voor vanuit goedgekeurde prestaties.",
  },
];

export const processSteps = [
  {
    title: "Kies één taak",
    text: "We bekijken waar je team tijd aan verliest en spreken af wat Nauvi overneemt en wat jij controleert.",
  },
  {
    title: "Leg je werkwijze vast",
    text: "Je team deelt de documenten, prijsafspraken en uitzonderingen die bij die taak horen. Die krijgen een plek in je Company Brain.",
  },
  {
    title: "Probeer het samen uit",
    text: "We bouwen de koppelingen die nodig zijn en testen de taak met voorbeelden uit je bedrijf. Je team kijkt het resultaat na.",
  },
];

export const integrations = [
  { id: "googledrive", name: "Google Drive", category: "Kennis" },
  { id: "microsoft", name: "Microsoft 365", category: "Kennis" },
  { id: "slack", name: "Slack", category: "Communicatie" },
  { id: "notion", name: "Notion", category: "Kennis" },
  { id: "hubspot", name: "HubSpot", category: "CRM & sales" },
  { id: "salesforce", name: "Salesforce", category: "CRM & sales" },
  { id: "gmail", name: "Gmail", category: "Communicatie" },
  { id: "dropbox", name: "Dropbox", category: "Kennis" },
  { id: "asana", name: "Asana", category: "Projecten" },
  { id: "trello", name: "Trello", category: "Projecten" },
  { id: "shopify", name: "Shopify", category: "Commerce" },
  { id: "quickbooks", name: "QuickBooks", category: "Commerce" },
  { id: "zapier", name: "Zapier", category: "Automatisering" },
];
