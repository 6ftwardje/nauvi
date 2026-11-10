"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronRight, X } from "lucide-react";
import { NauviMark } from "./nauvi-brand";
import { brainQuestions, type BrainSourceId } from "./brain-content";
import s from "./company-brain.module.css";

const normalize = (value: string) => value.trim().toLocaleLowerCase("nl-BE").replace(/\?$/, "");

function AnswerDetails({ answer, source }: { answer: string; source: string }) {
  return <><p>{answer}</p><span>Gebaseerd op: {source}</span></>;
}

export function BrainDemo({ onSources }: { onSources: (sources: readonly BrainSourceId[]) => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "answered" | "unmatched">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const questions = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => () => { if (timeout.current !== null) clearTimeout(timeout.current); }, []);

  function cancelPending() {
    if (timeout.current !== null) clearTimeout(timeout.current);
    timeout.current = null;
  }

  function clearAnswer() {
    cancelPending();
    setSelected(null);
    setStatus("idle");
    onSources([]);
  }

  function reset() {
    const trigger = selected === null ? input.current : questions.current[selected];
    clearAnswer();
    setQuery("");
    trigger?.focus();
  }

  function submit(value: string) {
    if (!value.trim()) return;
    cancelPending();
    const index = brainQuestions.findIndex(item => normalize(item.question) === normalize(value));
    if (index < 0) {
      setSelected(null);
      setStatus("unmatched");
      onSources([]);
      return;
    }
    setQuery(brainQuestions[index].question);
    setSelected(index);
    onSources(brainQuestions[index].connections);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStatus("answered");
      return;
    }
    setStatus("sending");
    timeout.current = setTimeout(() => {
      timeout.current = null;
      setStatus("answered");
    }, 440);
  }

  const result = selected === null ? null : brainQuestions[selected];
  return <div className={s.demo} data-status={status} onKeyDown={event => {
    if (event.key === "Escape" && (status !== "idle" || query)) {
      event.stopPropagation();
      reset();
    }
  }}>
    <div className={s.demoControls}>
      <form className={s.prompt} onSubmit={event => { event.preventDefault(); submit(query); }}>
        <label className={s.srOnly} htmlFor="hero-brain-question">Vraag aan je Company Brain</label>
        <NauviMark size={23} />
        <input
          id="hero-brain-question"
          ref={input}
          placeholder="Vraag aan je Company Brain..."
          value={query}
          aria-describedby="brain-demo-description"
          autoComplete="off"
          maxLength={180}
          onChange={event => { clearAnswer(); setQuery(event.target.value); }}
        />
        <span className={s.demoLabel} aria-hidden="true">Demo</span>
        <span className={s.srOnly} id="brain-demo-description">Probeer een voorbeeldvraag met fictieve bedrijfskennis.</span>
        <button type="submit" aria-label="Voorbeeldvraag versturen" disabled={!query.trim() || status === "sending"}><ArrowUp size={18} aria-hidden="true" /></button>
      </form>
      <div className={s.questions} role="group" aria-label="Kies een voorbeeldvraag">
        {brainQuestions.map((item, index) => <button
          key={item.question}
          ref={element => { questions.current[index] = element; }}
          type="button"
          aria-expanded={selected === index && status === "answered"}
          aria-controls="hero-demo-answer"
          onClick={() => submit(item.question)}
        >{item.question}<ChevronRight size={13} aria-hidden="true" /></button>)}
      </div>
    </div>
    <div className={s.replySlot}>
      {/* Size this row for the longest wrapped reply before the demo starts. */}
      {brainQuestions.map(item => <div key={item.question} className={`${s.reply} ${s.replySizer}`} aria-hidden="true">
        <div className={s.replyHeading} />
        <AnswerDetails {...item} />
      </div>)}
      <div id="hero-demo-answer" className={s.reply} role="status" aria-atomic="true">
        {status === "sending" && <p className={s.srOnly}>Voorbeeldantwoord wordt geopend.</p>}
        {status === "unmatched" && <p>Kies een van de drie voorbeeldvragen om de demo te proberen.</p>}
        {status === "answered" && result && <>
          <div className={s.replyHeading}><strong>Demo · fictieve bedrijfskennis</strong><button type="button" aria-label="Voorbeeldantwoord sluiten" onClick={reset}><X size={17} aria-hidden="true" /></button></div>
          <AnswerDetails {...result} />
        </>}
      </div>
    </div>
  </div>;
}
