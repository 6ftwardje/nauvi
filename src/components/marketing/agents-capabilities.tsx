import s from "./agents-page.module.css";

const capabilities = [
  {
    title: "Leadkwalificatie",
    text: "Kwalificeer inkomende leads, verzamel kerninformatie en stuur opportuniteiten naar de juiste persoon.",
    icon: <><circle cx="12" cy="7.4" r="3.05" /><circle cx="4.3" cy="9.15" r="2.2" /><circle cx="19.7" cy="9.15" r="2.2" /><path d="M6.1 18.2v-1.1a5.9 5.9 0 0 1 11.8 0v1.1c0 .9-.6 1.55-1.5 1.55H7.6c-.9 0-1.5-.65-1.5-1.55ZM.5 17.95v-.7a4.1 4.1 0 0 1 5.5-3.85 7.8 7.8 0 0 0-1.47 4.55H.5Zm23 0v-.7A4.1 4.1 0 0 0 18 13.4a7.8 7.8 0 0 1 1.47 4.55h4.03Z" /></>,
  },
  {
    title: "Klantenondersteuning",
    text: "Beantwoord routinevragen met je bedrijfskennis, met een menselijke overdracht wanneer nodig.",
    icon: <path fillRule="evenodd" d="M12 2.65c-6.02 0-10.9 3.82-10.9 8.54 0 1.94.82 3.73 2.23 5.16l-1.12 4.45a.55.55 0 0 0 .79.63l5.03-2.6c1.23.55 2.58.89 3.97.89 6.02 0 10.9-3.82 10.9-8.53 0-4.72-4.88-8.54-10.9-8.54Zm-5.15 7.04a1.55 1.55 0 1 0 0 3.1 1.55 1.55 0 0 0 0-3.1Zm5.15 0a1.55 1.55 0 1 0 0 3.1 1.55 1.55 0 0 0 0-3.1Zm5.15 0a1.55 1.55 0 1 0 0 3.1 1.55 1.55 0 0 0 0-3.1Z" />,
  },
  {
    title: "Offertevoorbereiding",
    text: "Zet aanvragen en documenten om in offertes die binnen enkele minuten klaar zijn om na te kijken.",
    icon: <path fillRule="evenodd" d="M5.7 1.5H14l7 7.05v11.2a2.75 2.75 0 0 1-2.75 2.75H5.7a2.75 2.75 0 0 1-2.75-2.75V4.25A2.75 2.75 0 0 1 5.7 1.5Zm8.15 2.65v4.33h4.3l-4.3-4.33ZM6.55 9v1.65h5.12V9H6.55Zm0 3.85v1.65h10.9v-1.65H6.55Zm0 3.85v1.65h10.9V16.7H6.55Z" />,
  },
  {
    title: "Meetingplanning",
    text: "Vind het juiste moment, plan meetings in en houd agenda’s synchroon.",
    icon: <><rect x="2.8" y="5.1" width="18.4" height="15.8" rx="2.25" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M2.8 8.05h18.4M7.1 2.7v3.5m9.8-3.5v3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="7.75" cy="12.65" r="1.15" /><circle cx="12" cy="12.65" r="1.15" /><circle cx="16.25" cy="12.65" r="1.15" /><circle cx="7.75" cy="17" r="1.15" /><circle cx="12" cy="17" r="1.15" /></>,
  },
  {
    title: "Documentverwerking",
    text: "Haal gegevens uit facturen, formulieren en pdf’s zonder manuele invoer.",
    icon: <><path d="m2.7 7.05 8.54-4.2c.48-.23 1.04-.23 1.52 0l8.54 4.2a1.18 1.18 0 0 1 0 2.11l-8.54 4.2c-.48.23-1.04.23-1.52 0L2.7 9.16a1.18 1.18 0 0 1 0-2.11Z" /><path d="m3.05 12.3 8.18 4.04c.48.23 1.06.23 1.54 0l8.18-4.04m-17.9 4.3 8.18 4.04c.48.23 1.06.23 1.54 0l8.18-4.04" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" /></>,
  },
  {
    title: "Sales-opvolging",
    text: "Stel tijdige opvolgingen op en houd deals in beweging zonder extra administratie.",
    icon: <path fillRule="evenodd" d="M1.7 10.02 21.6 1.55c.88-.38 1.75.49 1.37 1.37L14.5 22.7a1.08 1.08 0 0 1-1.93.13L8.5 15.94l-6.93-4a1.08 1.08 0 0 1 .13-1.92Zm5.02 1.29 4.42 2.56 7.1-7.11-11.52 4.55Z" />,
  },
  {
    title: "Interne kennis",
    text: "Vind betrouwbare antwoorden in bedrijfsbestanden, tools en procedures.",
    icon: <path d="M12 6.2C8.75 3.66 5.31 3.51 1.65 5.25v13.3c3.66-1.73 7.1-1.59 10.35.95 3.25-2.54 6.69-2.68 10.35-.95V5.25C18.69 3.51 15.25 3.66 12 6.2Zm0 0v13.3" fill="none" stroke="currentColor" strokeWidth="1.95" strokeLinejoin="round" />,
  },
  {
    title: "Workflowautomatisatie",
    text: "Koppel tools, activeer acties en houd dagelijkse processen draaiende.",
    icon: <path d="M15.28.6a.88.88 0 0 1 1.47.88l-2.6 7.38h5.52c.76 0 1.17.89.67 1.46L8.74 23.35a.88.88 0 0 1-1.47-.88l3-8.41H4.3a.88.88 0 0 1-.66-1.46L15.28.6Z" />,
  },
];

export function AgentsCapabilities() {
  return (
    <section className={s.capabilities} aria-labelledby="agents-capabilities-heading">
      <div className={s.capabilitiesInner}>
        <header className={s.capabilitiesHeader}>
          <h2 id="agents-capabilities-heading">AI-agents die werk uit handen nemen.</h2>
          <p>Van eerste aanvraag tot laatste opvolging. Praktische AI-agents die repetitief werk van je team overnemen.</p>
        </header>
        <ul className={s.capabilityGrid} role="list">
          {capabilities.map(({ title, text, icon }) => (
            <li key={title}>
              <svg className={s.capabilityIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{icon}</svg>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
