import { AudioLines, ChevronDown, Image as ImageIcon } from "lucide-react";
import { DemoFrame, DemoOutput, DemoTable, DownloadFileCard, type RelatedExample } from "./application-demo";
import s from "./application-examples.module.css";
import { AudioMessagePlayer, ProjectPhotoGrid } from "./site-report-media";

const siteActions = [
  { task: "Bevestig of de stelling aan de voorgevel is vrijgegeven.", owner: "Werfleider", date: "25 nov. om 10 uur", dateTime: "2026-11-25T10:00:00+01:00" },
  { task: "Bevestig de leverdatum van de profielen.", owner: "Magazijn", date: "25 nov. om 12 uur", dateTime: "2026-11-25T12:00:00+01:00" },
  { task: "Werk de planning bij.", owner: "Projectleider", date: "27 nov.", dateTime: "2026-11-27" },
];

export function SiteReportExample({ related = { href: "/toepassingen/offertes-voorbereiden", label: "Bekijk Offertes voorbereiden" } }: { related?: RelatedExample }) {
  const transcript = "Hey, even een update van de Parklaan. De stelling aan de voorgevel staat. Ik heb er een foto bijgestoken. Binnen is de doorgang op het gelijkvloers weer vrij. Daar zit ook een foto van bij. Kan de werfleider morgen tegen tien uur nakijken of de stelling is vrijgegeven? Laat het magazijn morgen tegen twaalf uur nog bevestigen wanneer de profielen aankomen. En de projectleider past tegen vrijdag de planning aan. Merci.";

  return (
    <DemoFrame
      detailed
      title="Een werfverslag maken uit spraak en foto’s"
      intro="Na de rondgang spreekt de ploeg op renovatiewerf Parklaan een update in. Bekijk hoe twee foto’s en één spraakbericht in een conceptverslag terechtkomen."
      sources={
        <div className={s.sources}>
          <div id="demo-spraaknotitie" className={s.source} tabIndex={-1}>
            <h4>Spraakbericht van de ploeg</h4>
            <div className={s.voiceSource}>
              <p className={s.sourceMeta}>Parklaan · <time dateTime="2026-11-24">24 november 2026</time></p>
              <AudioMessagePlayer src="/marketing/demos/werfnotitie.mp3" />
              <details className={s.transcript}>
                <summary>Lees de transcriptie <ChevronDown size={16} aria-hidden="true" /></summary>
                <p>{transcript}</p>
              </details>
            </div>
          </div>
          <div className={s.source}>
            <h4>Werffoto’s</h4>
            <ProjectPhotoGrid photos={[
              { id: "demo-foto-1", src: "/marketing/demos/parklaan-voorgevel.webp", alt: "Stelling aan de voorgevel van een gebouw in renovatie", caption: "Foto 1 · Voorgevel met stelling", width: 1448, height: 1086 },
              { id: "demo-foto-2", src: "/marketing/demos/parklaan-gelijkvloers.webp", alt: "Vrije doorgang op het gelijkvloers met zicht op de stelling buiten", caption: "Foto 2 · Doorgang op het gelijkvloers", width: 1448, height: 1086 },
            ]} />
          </div>
        </div>
      }
      output={
        <DemoOutput title="Werfverslag Parklaan" context="24 november 2026 · Verslag 07">
          <h5 className={s.documentSectionTitle}>Vaststellingen</h5>
          <div className={s.observations}>
            <div>
              <h6>Voorgevel</h6>
              <p>De stelling staat. De vrijgave is nog te bevestigen.</p>
              <p className={s.sourceLinks}><a href="#demo-foto-1"><ImageIcon size={14} aria-hidden="true" />Foto 1</a><a href="#demo-spraaknotitie"><AudioLines size={14} aria-hidden="true" />Spraakbericht</a></p>
            </div>
            <div>
              <h6>Gelijkvloers</h6>
              <p>De doorgang is vrijgemaakt.</p>
              <p className={s.sourceLinks}><a href="#demo-foto-2"><ImageIcon size={14} aria-hidden="true" />Foto 2</a><a href="#demo-spraaknotitie"><AudioLines size={14} aria-hidden="true" />Spraakbericht</a></p>
            </div>
          </div>
          <DemoTable caption="Actiepunten" headers={["Actie", "Verantwoordelijke", "Tegen"]} rows={siteActions.map(({ task, owner, date, dateTime }) => [task, owner, <time dateTime={dateTime} key={dateTime}>{date}</time>])} />
        </DemoOutput>
      }
      review={[
        "Vergelijk de twee vaststellingen met het spraakbericht en check of de foto’s bij de juiste zones staan.",
        "Laat de werfleider de vrijgave bevestigen en vul het actiepunt aan zodra dat is gebeurd.",
        "Controleer verantwoordelijken en deadlines. De werfleider beslist daarna wie het verslag ontvangt.",
      ]}
      bring="een spraaknotitie of bestaand werfverslag"
      related={related}
      downloads={
        <section className={s.reportDownloads} aria-labelledby="report-downloads-title">
          <div>
            <h3 id="report-downloads-title">Neem het verslag mee</h3>
            <p>Bekijk het ingevulde voorbeeld als pdf of gebruik het Word-sjabloon voor je eigen werf.</p>
          </div>
          <div className={s.fileCards}>
            <DownloadFileCard title="Voorbeeldverslag" type="PDF" href="/downloads/werfverslag-parklaan-voorbeeld.pdf" />
            <DownloadFileCard title="Werfverslag-sjabloon" type="Word" href="/downloads/werfverslag-sjabloon.docx" />
          </div>
        </section>
      }
    />
  );
}
