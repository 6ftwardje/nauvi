"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import {
  ArrowRight, Box, Check, ChevronRight, Circle, Clock3, FileText, Globe, Layers3, MessageSquare,
  Pause, Pencil, RotateCcw, ShieldCheck, Workflow,
} from "lucide-react";
import { animate, useInView } from "motion/react";
import { CompanyBrain } from "./company-brain";
import { NauviMark } from "./nauvi-brand";
import s from "./work-in-action.module.css";

const processingMs = 720;
const approvalCues = [0, 640];

const sources = [
  { label: "Je website", Icon: Globe },
  { label: "Je documenten", Icon: FileText },
  { label: "Je visie en aanbod", Icon: Layers3 },
  { label: "Je tone of voice", Icon: MessageSquare },
  { label: "Je werkwijzen", Icon: Workflow },
];
const topics = [
  { title: "Merk", detail: "Stem en stijl" },
  { title: "Markt", detail: "Doelgroep" },
  { title: "Aanbod", detail: "Diensten en prijzen" },
  { title: "Processen", detail: "Zo werken we" },
];
const tasks = [
  { team: "Marketing", task: "Posts voor volgende week", approved: "Ingepland" },
  { team: "Sales", task: "Offerte voor een nieuwe klant", approved: "Verstuurd" },
  { team: "Klantendienst", task: "Antwoord op een klantvraag", approved: "Goedgekeurd" },
];
const response = "Bedankt voor je bericht. We bekijken je aanvraag en laten je weten welke planning mogelijk is.";

const sourceCues = [0, ...sources.map((_, index) => (index + 1) * processingMs)];
const taskCues = taskTimeline(tasks.length, 480, 250);
const reviewCues = taskTimeline(tasks.length - 1, 540, 310);

function taskTimeline(count: number, delay: number, gap: number) {
  const cues = [0];
  for (let index = 0; index < count; index++) {
    const start = delay + index * (processingMs + gap);
    cues.push(start, start + processingMs);
  }
  return cues;
}

type Phase = "waiting" | "busy" | "done";

function useDemoTimeline(cues: readonly number[], active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: .35 });
  const [frame, setFrame] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const hasPlayed = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const finish = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    finish.current = null;
    setPlaying(false);
  }, []);

  const settle = useCallback(() => {
    if (finish.current) finish.current();
    else stop();
  }, [stop]);

  const play = useCallback((sequence = cues, first = 0) => {
    stop();
    hasPlayed.current = true;
    const last = sequence.length - 1;
    const complete = () => {
      stop();
      setFrame(first + last);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) {
      complete();
      return;
    }

    function advance(index: number) {
      timer.current = window.setTimeout(() => {
        if (index === last) complete();
        else {
          setFrame(first + index);
          advance(index + 1);
        }
      }, sequence[index] - sequence[index - 1]);
    }

    finish.current = complete;
    setPlaying(true);
    if (first === 0) setFrame(-1);
    timer.current = window.setTimeout(() => {
      setFrame(first);
      advance(1);
    }, first === 0 ? 210 : 0);
  }, [cues, stop]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(preference.matches);
      if (preference.matches) {
        if (finish.current) settle();
        else if (!hasPlayed.current) {
          hasPlayed.current = true;
          setFrame(cues.length - 1);
        }
      }
    };
    const visibility = () => { if (document.hidden && finish.current) settle(); };
    update();
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      window.clearTimeout(timer.current);
    };
  }, [cues, settle]);

  useEffect(() => {
    if (!active || !inView) {
      if (finish.current) settle();
    } else if (!hasPlayed.current) {
      play();
    }
  }, [active, inView, play, settle]);

  const replay = () => play();
  return { ref, frame, reduced, playing, pause: settle, replay, playOnce: play, toggle: playing ? stop : replay };
}

function Status({ phase, done, waiting = "Wacht", processing = "Bezig", iconOnly = false }: {
  phase: Phase;
  done: string;
  waiting?: string;
  processing?: string;
  iconOnly?: boolean;
}) {
  return <span className={s.status} data-phase={phase}>
    <span className={s.statusIcon} aria-hidden="true">
      <Clock3 className={s.waitingIcon} size={13} />
      <span className={s.loader}><i /><i /><i /></span>
      <span className={s.successIcon}><Check size={12} strokeWidth={2.5} /></span>
    </span>
    <span className={iconOnly ? s.visuallyHidden : undefined}>
      {phase === "done" ? done : phase === "busy" ? processing : waiting}
    </span>
  </span>;
}

function DemoFrame({ area, title, description, playing, onPlayback, canReset = false, children }: {
  area: string;
  title: string;
  description: string;
  playing: boolean;
  onPlayback: () => void;
  canReset?: boolean;
  children: ReactNode;
}) {
  return <>
    <div className={s.chrome}>
      <span className={s.chromeIcon}><NauviMark size={21} /></span>
      <span className={s.breadcrumb}><span>Nauvi</span> <ChevronRight size={11} aria-hidden="true" /> <strong>{area}</strong></span>
      <span className={s.demoLabel}>Voorbeeld</span>
      <button className={s.replay} data-replay-only={!canReset} type="button"
        title={playing ? "Pauzeren" : "Opnieuw afspelen"}
        aria-label={playing ? `Pauzeer voorbeeld ${area}` : `Speel voorbeeld ${area} opnieuw af`}
        onClick={onPlayback}>
        {playing ? <Pause size={15} aria-hidden="true" /> : <RotateCcw size={15} aria-hidden="true" />}
      </button>
    </div>
    <div className={s.sceneBody}>
      <h3>{title}</h3>
      <p className={s.sceneIntro}>{description}</p>
      {children}
    </div>
  </>;
}

function KnowledgeDemo({ active }: { active: boolean }) {
  const { ref, frame, reduced, playing, toggle } = useDemoTimeline(sourceCues, active);
  const progress = Math.round(Math.max(0, frame) / sources.length * 92);
  const percent = useRef<HTMLElement>(null);

  useEffect(() => {
    const label = percent.current;
    if (!label) return;
    if (!progress || document.hidden || reduced) {
      label.textContent = `${progress}%`;
      return;
    }
    const from = Number.parseInt(label.textContent ?? "", 10);
    if (from === progress) return;
    const animation = animate(from, progress, {
      duration: .47,
      ease: [.19, 1, .32, 1],
      onUpdate: value => { label.textContent = `${Math.round(value)}%`; },
    });
    return () => animation.stop();
  }, [progress, reduced]);

  return <div ref={ref} className={s.scene}>
    <DemoFrame area="Company Brain" title="Je bedrijfsbrein" description="Bronnen worden bruikbare bedrijfskennis." playing={playing} onPlayback={toggle}>
      <div className={s.brainGrid}>
        <ul className={s.sourceList} aria-label="Bronnen">
          {sources.map(({ label, Icon }, index) => {
            const phase = index < frame ? "done" : index === frame ? "busy" : "waiting";
            return <li key={label} data-phase={phase}>
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
              <Status phase={phase} done="Verwerkt" iconOnly />
            </li>;
          })}
        </ul>
        <div className={s.coverage}>
          <span id="synaps-knowledge-coverage">Kennis in kaart</span>
          <strong ref={percent} aria-hidden="true">0%</strong>
          <div role="progressbar" aria-labelledby="synaps-knowledge-coverage" aria-valuenow={progress} className={s.track}>
            <span style={{ "--progress": progress / 100 } as CSSProperties} />
          </div>
          <dl className={s.topics}>
            {topics.map(({ title, detail }, index) => <div key={title} data-ready={frame > index}>
              <dt>{title}</dt>
              <dd>{detail}</dd>
            </div>)}
          </dl>
        </div>
      </div>
    </DemoFrame>
  </div>;
}

function TaskList({ frame, review = false }: { frame: number; review?: boolean }) {
  return <ul className={s.taskList} aria-label={review ? "Beslissingen per taak" : "Voorbeeldtaken"}>
    {tasks.map(({ team, task, approved }, index) => {
      const phase = frame >= (index + 1) * 2 ? "done" : frame === index * 2 + 1 ? "busy" : "waiting";
      return <li key={team} data-phase={phase}>
        <span className={s.team} data-team={team}>{team}</span>
        <span className={s.taskName}>{task}</span>
        <Status phase={phase} done={review ? approved : "Klaar"} waiting={review ? "Wacht" : "In wachtrij"} processing={review ? "Vastleggen" : "Bezig"} />
      </li>;
    })}
  </ul>;
}

function AgentDemo({ active }: { active: boolean }) {
  const { ref, frame, playing, toggle } = useDemoTimeline(taskCues, active);

  return <div ref={ref} className={s.scene}>
    <DemoFrame area="Agents" title="Je agents aan het werk" description="Elke taak vertrekt van jouw afspraken." playing={playing} onPlayback={toggle}>
      <TaskList frame={frame} />
    </DemoFrame>
  </div>;
}

function ApprovalDemo({ active }: { active: boolean }) {
  const { ref, frame, playing, pause, replay, playOnce } = useDemoTimeline(reviewCues, active);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(response);
  const [saved, setSaved] = useState(response);
  const [manual, setManual] = useState(false);
  const editButton = useRef<HTMLButtonElement>(null);
  const editField = useRef<HTMLTextAreaElement>(null);
  const finished = frame === 6;
  const busy = frame === 5;
  const locked = busy || finished;
  const note = finished ? "Beslissing vastgelegd · goedgekeurd door jou"
    : busy ? "Je goedkeuring wordt vastgelegd…"
    : saved !== response ? "Aanpassing opgeslagen · klaar voor jouw akkoord"
    : frame === 4 ? "Twee beslissingen vastgelegd · één wacht op jouw akkoord."
    : "Het antwoord wacht op jouw akkoord.";

  useEffect(() => {
    if (editing) editField.current?.focus();
  }, [editing]);

  function closeEditor() {
    setEditing(false);
    requestAnimationFrame(() => editButton.current?.focus());
  }

  function togglePlayback() {
    if (playing) {
      pause();
      return;
    }
    setEditing(false);
    setSaved(response);
    setDraft(response);
    setManual(false);
    replay();
  }

  return <div ref={ref} className={s.scene}>
    <DemoFrame area="Goedkeuringen" title={finished ? "Jouw akkoord is vastgelegd" : "Wacht op jouw akkoord"} description="Bekijk wat er klaarstaat voor je beslist." canReset playing={playing} onPlayback={togglePlayback}>
      <TaskList frame={frame} review />
      <div hidden={editing}>
        <p className={s.reviewPreview}>{saved}</p>
        <div className={s.reviewActions}>
          <button ref={editButton} type="button" className={s.editAction} aria-disabled={locked} onClick={() => {
            if (locked) return;
            pause();
            setDraft(saved);
            setEditing(true);
          }}><Pencil size={14} aria-hidden="true" /> Aanpassen</button>
          <button type="button" className={s.approveAction} aria-disabled={locked} onClick={() => {
            if (locked) return;
            setManual(true);
            playOnce(approvalCues, 5);
          }}><Check size={16} aria-hidden="true" /> {finished ? "Goedgekeurd" : "Goedkeuren"}</button>
        </div>
      </div>
      {editing && <form className={s.editor} onSubmit={event => {
        event.preventDefault();
        if (!draft.trim()) return;
        setSaved(draft.trim());
        setManual(true);
        closeEditor();
      }} onKeyDown={event => {
        if (event.key === "Escape") closeEditor();
      }}>
        <label htmlFor="synaps-example-reply">Antwoord op een klantvraag</label>
        <textarea ref={editField} id="synaps-example-reply" value={draft} onChange={event => setDraft(event.target.value)} rows={3} maxLength={500} required />
        <div className={s.reviewActions}>
          <button type="button" className={s.editAction} onClick={closeEditor}>Annuleren</button>
          <button type="submit" className={s.approveAction} disabled={!draft.trim()}>Opslaan</button>
        </div>
      </form>}
      <div className={s.reviewNote} data-done={finished} aria-hidden="true">
        {finished ? <Check size={15} aria-hidden="true" /> : <Circle size={9} aria-hidden="true" />}
        <span>{note}</span>
      </div>
      <span className={s.visuallyHidden} role="status"><span>{manual ? note : ""}</span></span>
    </DemoFrame>
  </div>;
}

const steps = [
  { id: "knowledge", label: "Kennis vastleggen", Icon: Layers3, description: "Breng je website, documenten en werkwijzen samen in je Company Brain. Jij vult aan wat nog ontbreekt.", Demo: KnowledgeDemo },
  { id: "sources", label: "Bronnen verkennen", Icon: Box, description: "Verken het 3D-model of stel een voorbeeldvraag. Je ziet welke bronnen het Company Brain gebruikt.", Demo: ModelDemo },
  { id: "agents", label: "Agents aan het werk", Icon: Workflow, description: "Volg hoe een agent met jouw afspraken een offerte voorbereidt, posts uitwerkt of een klantvraag beantwoordt.", Demo: AgentDemo },
  { id: "review", label: "Werk goedkeuren", Icon: ShieldCheck, description: "Lees het voorstel, pas het aan en geef zelf je akkoord. Je bepaalt welk werk naar buiten gaat.", Demo: ApprovalDemo },
] as const;

function ModelDemo({ active }: { active: boolean }) {
  return <div className={`${s.scene} ${s.modelScene}`}><CompanyBrain appearance="stage" active={active} /></div>;
}

export default function WorkInAction() {
  const [selected, setSelected] = useState(0);
  const [modelVisited, setModelVisited] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    setSelected(index);
    if (steps[index].id === "sources") setModelVisited(true);
  }

  function selectFromControl(index: number) {
    select(index);
    const { hash, pathname, search } = window.location;
    if ((hash === "#bedrijfskennis" && index !== 1) || (hash === "#mogelijkheden" && index !== 2)) {
      window.history.replaceState(window.history.state, "", pathname + search);
    }
  }

  useEffect(() => {
    const selectFromLink = () => {
      if (window.location.hash === "#bedrijfskennis") select(1);
      if (window.location.hash === "#mogelijkheden") select(2);
    };
    selectFromLink();
    window.addEventListener("hashchange", selectFromLink);
    return () => window.removeEventListener("hashchange", selectFromLink);
  }, []);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = steps.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    selectFromControl(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className={s.showcase} id="mogelijkheden" aria-labelledby="work-showcase-heading">
      <span className={s.hashAnchor} id="bedrijfskennis" />
      <div className={s.copy}>
        <h2 id="work-showcase-heading">Van kennis naar<br /> uitgevoerd werk.</h2>
        <div className={s.descriptions}>
          {steps.map(({ id, description }, index) => (
            <p key={id} id={`showcase-description-${id}`} data-current={selected === index} aria-hidden={selected !== index}>
              {description}
            </p>
          ))}
        </div>
        <div className={s.tabs} role="tablist" aria-label="Company Brain in actie">
          {steps.map(({ id, label, Icon }, index) => (
            <button
              type="button"
              key={id}
              ref={element => { tabs.current[index] = element; }}
              role="tab"
              id={`showcase-tab-${id}`}
              aria-controls={`showcase-panel-${id}`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => selectFromControl(index)}
              onKeyDown={event => move(event, index)}
            ><Icon size={17} aria-hidden="true" /><span>{label}</span><ArrowRight size={16} aria-hidden="true" /></button>
          ))}
        </div>
      </div>
      <div className={s.showcaseStage}>
        <div className={s.scenes}>
          {steps.map(({ id, Demo }, index) => {
            const active = selected === index;
            return (
              <div
                key={id}
                className={s.showcasePanel}
                id={`showcase-panel-${id}`}
                role="tabpanel"
                aria-labelledby={`showcase-tab-${id}`}
                aria-describedby={`showcase-description-${id}`}
                aria-hidden={!active}
                inert={!active}
                tabIndex={active ? 0 : -1}
                data-current={active}
              >
                {(id !== "sources" || modelVisited) && <Demo active={active} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
