import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Download, FileSpreadsheet, FileText, FileType } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import shared from "./cinematic.module.css";
import s from "./application-examples.module.css";

const demoImageSizes = "(max-width: 590px) calc(100vw - 44px), (max-width: 800px) 93vw, (max-width: 1260px) 40vw, 484px";

export function ApplicationDemoHero({ title, description, image, className, imageSizes = demoImageSizes }: {
  title: string;
  description: string;
  image: string;
  className?: string;
  imageSizes?: string;
}) {
  return (
    <section className={[s.hero, s.demoHero, className].filter(Boolean).join(" ")} aria-labelledby="application-title">
      <div className={s.heroCopy}>
        <Link className={`${shared.breadcrumb} ${s.backLink}`} href="/toepassingen"><ArrowLeft size={14} aria-hidden="true" />Alle toepassingen</Link>
        <h1 id="application-title">{title}</h1>
        <p>{description}</p>
        <a className={shared.darkButton} href="#voorbeeld">Bekijk het voorbeeld <ArrowRight size={15} aria-hidden="true" /></a>
      </div>
      <div className={s.heroImage}>
        <Image src={image} alt="" fill sizes={imageSizes} loading="eager" fetchPriority="high" />
      </div>
    </section>
  );
}

export type RelatedExample = { href: string; label: string };
type ReviewItem = string | { title: string; detail: string; icon: LucideIcon };

const demoStages = [
  { id: "demo-invoer", label: "Invoer", description: "Bekijk de invoer" },
  { id: "demo-concept", label: "Concept", description: "Lees het concept" },
  { id: "demo-nazicht", label: "Controle", description: "Controleer het resultaat" },
];

export function DemoFrame({ title, intro, illustration, sources, output, review, bring, related, downloads, className, navigation: Navigation, detailed = false }: {
  title: string;
  intro?: string;
  illustration?: ReactNode;
  sources: ReactNode;
  output: ReactNode;
  review: ReviewItem[];
  bring: string;
  related: RelatedExample;
  downloads?: ReactNode;
  className?: string;
  navigation?: ComponentType<{ steps: typeof demoStages }>;
  detailed?: boolean;
}) {
  const ContactArrow = detailed ? ArrowRight : ArrowUpRight;

  return (
    <section className={[s.example, detailed && s.detailed, className].filter(Boolean).join(" ")} id="voorbeeld" aria-labelledby="example-title" tabIndex={Navigation ? -1 : undefined}>
      <div className={s.intro}>
        <p className={s.label}>Productdemo · Fictief dossier</p>
        <h2 id="example-title">{title}</h2>
        {intro && <p>{intro}</p>}
        {illustration}
        {Navigation ? <Navigation steps={demoStages} /> : <nav aria-label="Stappen in de productdemo">
          <ol className={s.stageLinks}>
            {demoStages.map(({ id, label, description }, index) => (
              <li key={id}>
                <a href={`#${id}`}><span aria-hidden={detailed || undefined}>{detailed ? `0${index + 1}` : index + 1}</span>{detailed ? label : description}</a>
              </li>
            ))}
          </ol>
        </nav>}
      </div>

      <section className={s.stage} id="demo-invoer" aria-labelledby="demo-invoer-title">
        <h3 id="demo-invoer-title">Wat de agent ontvangt</h3>
        {sources}
      </section>
      <section className={s.stage} id="demo-concept" aria-labelledby="demo-concept-title">
        <h3 id="demo-concept-title">Wat de agent voorbereidt</h3>
        {detailed ? <div className={s.documentSurface}>{output}</div> : output}
      </section>
      <section className={s.review} id="demo-nazicht" aria-labelledby="demo-nazicht-title">
        <h3 id="demo-nazicht-title">Wat je team controleert</h3>
        <ul role={detailed ? "list" : undefined}>
          {review.map(item => {
            if (typeof item === "string") return <li key={item}>{detailed && <Check size={16} aria-hidden="true" />}{item}</li>;
            const { title, detail, icon: Icon } = item;
            return (
              <li key={title}>
                <Icon size={16} aria-hidden="true" />
                <div className={s.reviewItem}><strong>{title}</strong><span>{detail}</span></div>
              </li>
            );
          })}
        </ul>
      </section>

      {downloads}
      <div className={s.nextStep}>
        <h2>Bespreek je eigen werkwijze</h2>
        <p>Neem {bring} mee naar een kennismaking. Samen bekijken we welke stap Nauvi kan overnemen en wie het resultaat controleert.</p>
        <div className={s.actions}>
          <Link className={shared.darkButton} href="/contact">Plan een kennismaking <ContactArrow size={15} aria-hidden="true" /></Link>
          <Link className={detailed ? s.secondaryAction : undefined} href="/werkwijze">Bekijk onze werkwijze <ArrowRight size={15} aria-hidden="true" /></Link>
          <Link className={detailed ? s.secondaryAction : undefined} href={related.href}>{related.label} <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}

export function DemoOutput({ title, context, statusIcon, children }: { title: ReactNode; context: string; statusIcon?: ReactNode; children: ReactNode }) {
  return (
    <article className={s.output} aria-labelledby="demo-output-title">
      <header className={s.outputHeading}>
        <div><p className={s.label}>{context}</p><h4 id="demo-output-title">{title}</h4></div>
        <p className={s.status}>{statusIcon}Concept ter controle</p>
      </header>
      <div className={s.outputContent}>{children}</div>
    </article>
  );
}

export function DemoTable({ caption, headers, rows, footer }: {
  caption: string;
  headers: string[];
  rows: ReactNode[][];
  footer?: ReactNode;
}) {
  return (
    <table className={s.table} data-columns={headers.length} role="table">
      <caption>{caption}</caption>
      <thead role="rowgroup">
        <tr role="row">{headers.map(header => <th scope="col" role="columnheader" key={header}>{header}</th>)}</tr>
      </thead>
      <tbody role="rowgroup">{rows.map((row, index) => (
        <tr role="row" key={index}>
          <th scope="row" role="rowheader">{row[0]}</th>
          {row.slice(1).map((cell, column) => (
            <td role="cell" key={headers[column + 1]}>
              <span className={s.cellLabel} aria-hidden="true">{headers[column + 1]}</span>{cell}
            </td>
          ))}
        </tr>
      ))}</tbody>
      {footer && <tfoot role="rowgroup">{footer}</tfoot>}
    </table>
  );
}

const fileIcons = { PDF: FileText, Word: FileType, Excel: FileSpreadsheet };

export function DownloadFileCard({ title, type, href }: { title: string; type: keyof typeof fileIcons; href: string }) {
  const Icon = fileIcons[type];

  return (
    <a className={s.fileCard} href={href} download>
      <span className={s.fileIcon}><Icon size={18} aria-hidden="true" /></span>
      <span className={s.fileInfo}><strong>{title}</strong><span>{type}</span></span>
      <Download size={18} aria-hidden="true" />
    </a>
  );
}
