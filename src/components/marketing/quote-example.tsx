import { Calculator, ClipboardCheck, ClipboardList, Clock3, Equal, FileText, Ruler, Tag, X } from "lucide-react";
import { DemoFrame, DemoOutput, DemoTable, DownloadFileCard } from "./application-demo";
import { QuoteWorkflow } from "./quote-workflow";
import example from "./quote-example.json";
import demoStyles from "./application-examples.module.css";
import s from "./quote-example.module.css";

const currency = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" });

function QuoteIllustration({ line }: { line: (typeof example.lines)[number] }) {
  const { code, item, quantity, unit, rateCode, priceCents } = line;
  const measure = `${quantity} ${unit}`;
  const rate = currency.format(priceCents / 100);
  const amount = currency.format(quantity * priceCents / 100);

  return (
    <figure className={s.illustration} data-quote-illustration aria-labelledby="quote-illustration-caption">
      <figcaption id="quote-illustration-caption"><span className={s.postCode}>{code} · </span>{item}</figcaption>
      <div className={s.equation} role="group" aria-label="Van bron naar offertebedrag">
        <a href={`#bestek-post-${code}`} aria-label={`Bestekpost ${code} · ${measure}`}>
          <span><FileText size={14} aria-hidden="true" />Bestek</span>
          <strong>{measure}</strong>
        </a>
        <span className={s.operator}><X size={15} aria-hidden="true" /><span className={s.visuallyHidden}>maal</span></span>
        <a href={`#tarief-${rateCode.toLowerCase()}`} aria-label={`Tarief ${rateCode} · ${rate} per ${unit}`}>
          <span><Tag size={14} aria-hidden="true" />Tarief</span>
          <strong>{rate}</strong>
        </a>
        <span className={s.operator}><Equal size={15} aria-hidden="true" /><span className={s.visuallyHidden}>is gelijk aan</span></span>
        <a href={`#offerte-post-${code}`} aria-label={`Offertepost ${code} · ${amount}`}>
          <span><Calculator size={14} aria-hidden="true" />Bedrag</span>
          <strong>{amount}</strong>
        </a>
      </div>
    </figure>
  );
}

export function QuoteExample() {
  const { lines, openLine } = example;
  const subtotal = lines.reduce((total, line) => total + line.quantity * line.priceCents, 0);

  return (
    <DemoFrame
      detailed
      className={s.quote}
      navigation={QuoteWorkflow}
      title="Een bouwofferte voorbereiden vanuit je bestek"
      illustration={<QuoteIllustration line={lines[1]} />}
      sources={
        <div className={s.sources}>
          <section className={s.source} aria-labelledby="bestek-heading">
            <header className={s.sourceHeading}>
              <span className={s.documentIcon}><FileText size={19} aria-hidden="true" /></span>
              <div>
                <h4 id="bestek-heading">Bestek en meetstaat</h4>
                <p>{example.project} · <span className={s.reference}>{example.specificationVersion}</span></p>
              </div>
            </header>
            <ul className={s.sourceLines} role="list">
              {lines.map(({ code, item, quantity, unit, scope }) => (
                <li key={code} id={`bestek-post-${code}`} data-quote-post={code} tabIndex={-1}>
                  <span className={s.code}>{code}</span>
                  <span>{item}{scope && <small>{scope}</small>}</span>
                  <span className={s.value}>{quantity} {unit}</span>
                </li>
              ))}
              <li id={`bestek-post-${openLine.code}`} data-quote-post={openLine.code} tabIndex={-1}>
                <span className={s.code}>{openLine.code}</span>
                <span>{openLine.item}<small>{openLine.scope}</small></span>
                <span className={s.openStatus}>Open</span>
              </li>
            </ul>
          </section>
          <section className={s.source} aria-labelledby="prijslijst-heading">
            <header className={s.sourceHeading}>
              <span className={s.documentIcon}><Tag size={19} aria-hidden="true" /></span>
              <div>
                <h4 id="prijslijst-heading">Prijslijst afwerking</h4>
                <p><span className={s.reference}>{example.priceListVersion}</span> · Tarieven excl. btw</p>
              </div>
            </header>
            <ul className={s.sourceLines} role="list">
              {lines.map(({ code, rateCode, item, unit, priceCents }) => (
                <li key={rateCode} id={`tarief-${rateCode.toLowerCase()}`} data-quote-post={code} tabIndex={-1}>
                  <span className={s.code}>{rateCode}</span>
                  <span>{item}<small>Bestekpost {code}</small></span>
                  <span className={s.value}>{currency.format(priceCents / 100)}<small>per {unit}</small></span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      }
      output={
        <DemoOutput
          title={<>Conceptofferte <span className={s.documentReference}>{example.reference}</span></>}
          context={`${example.project} · ${example.date}`}
          statusIcon={<ClipboardList size={15} aria-hidden="true" />}
        >
          <div className={s.calculation}>
            <DemoTable
              caption="Berekende offerteposten"
              headers={["Post", "Hoeveelheid", "Tarief", "Bedrag"]}
              rows={lines.map(({ code, rateCode, item, quantity, unit, priceCents }) => [
                <span className={s.lineItem} id={`offerte-post-${code}`} key={code} tabIndex={-1}>
                  <span><span className={s.postCode}>{code} · </span>{item}</span>
                  <span className={`${s.sourceLinks} ${demoStyles.sourceLinks}`}>
                    <a href={`#bestek-post-${code}`} aria-label={`Bestekpost ${code}`}><FileText size={14} aria-hidden="true" />Bestek</a>
                    <a href={`#tarief-${rateCode.toLowerCase()}`} aria-label={`Tarief ${rateCode}`}><Tag size={14} aria-hidden="true" />Tarief</a>
                  </span>
                </span>,
                `${quantity} ${unit}`,
                currency.format(priceCents / 100),
                currency.format(quantity * priceCents / 100),
              ])}
              footer={<tr role="row"><th scope="row" role="rowheader" colSpan={3}><span className={s.subtotalLabel}><Calculator size={16} aria-hidden="true" />Subtotaal excl. btw</span></th><td role="cell">{currency.format(subtotal / 100)}</td></tr>}
            />
          </div>
          <div className={s.openLine}>
            <p className={s.reviewStatus}><Clock3 size={16} aria-hidden="true" />Te bevestigen</p>
            <div>
              <h5>{openLine.code} · {openLine.item}</h5>
              <ul className={s.missingInputs} role="list">
                <li><Ruler size={15} aria-hidden="true" />Oppervlakte te bepalen</li>
                <li><Tag size={15} aria-hidden="true" />Tarief te bevestigen</li>
              </ul>
              <p className={s.exclusion}>De post staat buiten het subtotaal.</p>
            </div>
            <a href={`#bestek-post-${openLine.code}`}><FileText size={14} aria-hidden="true" />Bestekpost {openLine.code}</a>
          </div>
        </DemoOutput>
      }
      review={[
        { icon: Ruler, title: "Hoeveelheden", detail: "Vergelijk de oppervlaktes en lopende meters met de laatste meetstaat." },
        { icon: Tag, title: "Tarieven en afspraken", detail: "Toets aan de geldige prijslijst en bevestig dat de klant de tegels levert." },
        { icon: ClipboardCheck, title: "Goedkeuring vóór verzending", detail: "De calculator beslist over egalisatie, vult de post indien nodig aan en keurt de offerte goed." },
      ]}
      bring="een bestek of geanonimiseerde offerte"
      related={{ href: "/toepassingen/werfverslagen-maken#voorbeeld", label: "Bekijk het werfverslagvoorbeeld" }}
      downloads={
        <section className={`${demoStyles.reportDownloads} ${s.downloads}`} aria-labelledby="quote-downloads-title">
          <h3 id="quote-downloads-title">Neem de conceptofferte mee</h3>
          <div className={demoStyles.fileCards}>
            <DownloadFileCard title="Conceptofferte" type="PDF" href="/downloads/conceptofferte-gelijkvloers.pdf" />
            <DownloadFileCard title="Calculatieblad" type="Excel" href="/downloads/calculatieblad-gelijkvloers.xlsx" />
          </div>
        </section>
      }
    />
  );
}
