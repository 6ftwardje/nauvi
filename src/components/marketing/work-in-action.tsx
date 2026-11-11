"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Check, ChevronRight, Circle, Clock3, FileText, Globe, Layers3, MessageSquare,
  Pause, Pencil, RotateCcw, Workflow,
} from "lucide-react";
import { animate, motion } from "motion/react";
import { AccentLine, Kicker } from "./editorial";
import { fluidDotsDurationMs, SiriFluidDots } from "@/components/ui/siri-fluid-dots";
import s from "./work-in-action.module.css";

const endHoldMs = 3200;
const stepEnterMs = 480;
const approvalCues = [0, fluidDotsDurationMs];

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

const sourceCues = [0, ...sources.map((_, index) => (index + 1) * fluidDotsDurationMs)];
const taskCues = taskTimeline(tasks.length, 480, 250);
const reviewCues = taskTimeline(tasks.length - 1, 540, 310);

function taskTimeline(count: number, delay: number, gap: number) {
  const cues = [0];
  for (let index = 0; index < count; index++) {
    const start = delay + index * (fluidDotsDurationMs + gap);
    cues.push(start, start + fluidDotsDurationMs);
  }
  return cues;
}

type Phase = "waiting" | "busy" | "done";

function useDemoTimeline(cues: readonly number[], revealed: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(-1);
  const [auto, setAuto] = useState(true);
  const [reduced, setReduced] = useState(false);
  const autoplay = useRef(true);
  const visible = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const finish = useRef<(() => void) | null>(null);
  const clear = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    finish.current = null;
  }, []);
  const settle = useCallback(() => {
    if (finish.current) finish.current();
    else clear();
  }, [clear]);

  const play = useCallback((sequence = cues, first = 0) => {
    clear();
    const last = sequence.length - 1;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) {
      setFrame(first + last);
      return;
    }
    const finishCycle = () => {
      clear();
      setFrame(first + last);
    };
    const advance = (index: number) => {
      timer.current = window.setTimeout(() => {
        if (index < last) {
          setFrame(first + index);
          advance(index + 1);
        } else {
          finishCycle();
          if (autoplay.current && visible.current) {
            timer.current = window.setTimeout(start, endHoldMs);
          }
        }
      }, sequence[index] - sequence[index - 1]);
    };
    const start = () => {
      finish.current = finishCycle;
      setFrame(first);
      advance(1);
    };
    start();
  }, [clear, cues]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !revealed) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) {
      setFrame(cues.length - 1);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.intersectionRatio >= 0.4;
      const entered = inView && !visible.current;
      visible.current = inView;
      if (!entry.isIntersecting || (!inView && autoplay.current)) settle();
      if (entered && autoplay.current && !preference.matches && !document.hidden) play();
    }, { threshold: [0, 0.4] });
    const visibility = () => {
      if (document.hidden) settle();
      else if (visible.current && autoplay.current && !preference.matches) play();
    };
    const motionChange = () => {
      setReduced(preference.matches);
      if (preference.matches) {
        settle();
        if (autoplay.current) setFrame(cues.length - 1);
      } else if (visible.current && autoplay.current && !document.hidden) {
        play();
      }
    };
    motionChange();
    observer.observe(node);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", motionChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", motionChange);
      visible.current = false;
      clear();
    };
  }, [clear, cues, play, revealed, settle]);

  function pause() {
    autoplay.current = false;
    setAuto(false);
    settle();
    setFrame(current => Math.max(current, cues.length - 1));
  }

  function resume() {
    autoplay.current = true;
    setAuto(true);
    play();
  }

  function playOnce(sequence: readonly number[], first: number) {
    autoplay.current = false;
    setAuto(false);
    play(sequence, first);
  }

  const looping = auto && !reduced;
  return { ref, frame, reduced, looping, pause, resume, playOnce, toggle: looping ? pause : resume };
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
      <span className={s.loader}><SiriFluidDots playing={phase === "busy"} /></span>
      <span className={s.successIcon}><Check size={12} strokeWidth={2.5} /></span>
    </span>
    <span className={iconOnly ? s.visuallyHidden : undefined}>
      {phase === "done" ? done : phase === "busy" ? processing : waiting}
    </span>
  </span>;
}

function DemoFrame({ area, title, description, looping, onPlayback, canReset = false, children }: {
  area: string;
  title: string;
  description: string;
  looping: boolean;
  onPlayback: () => void;
  canReset?: boolean;
  children: ReactNode;
}) {
  return <>
    <div className={s.chrome}>
      <span className={s.chromeIcon}>nauvi</span>
      <span className={s.breadcrumb}><span>Nauvi</span> <ChevronRight size={11} aria-hidden="true" /> <strong>{area}</strong></span>
      <span className={s.demoLabel}>Voorbeeld</span>
      <button className={s.replay} data-replay-only={!canReset} type="button"
        title={looping ? "Pauzeren" : "Opnieuw afspelen"}
        aria-label={looping ? `Pauzeer voorbeeld ${area}` : `Speel voorbeeld ${area} opnieuw af`}
        onClick={onPlayback}>
        {looping ? <Pause size={15} aria-hidden="true" /> : <RotateCcw size={15} aria-hidden="true" />}
      </button>
    </div>
    <div className={s.sceneBody}>
      <h4>{title}</h4>
      <p className={s.sceneIntro}>{description}</p>
      {children}
    </div>
  </>;
}

function BrainDemo({ revealed }: { revealed: boolean }) {
  const { ref, frame, reduced, looping, toggle } = useDemoTimeline(sourceCues, revealed);
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
      duration: 0.43,
      ease: [0.2, 0.75, 0.25, 1],
      onUpdate: value => { label.textContent = `${Math.round(value)}%`; },
    });
    return () => animation.stop();
  }, [progress, reduced]);

  return <div ref={ref} className={s.scene}>
    <DemoFrame area="Company Brain" title="Je bedrijfsbrein" description="Bronnen worden bruikbare bedrijfskennis." looping={looping} onPlayback={toggle}>
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

function AgentDemo({ revealed }: { revealed: boolean }) {
  const { ref, frame, looping, toggle } = useDemoTimeline(taskCues, revealed);

  return <div ref={ref} className={s.scene}>
    <DemoFrame area="Agents" title="Je agents aan het werk" description="Elke taak vertrekt van jouw afspraken." looping={looping} onPlayback={toggle}>
      <TaskList frame={frame} />
    </DemoFrame>
  </div>;
}

function ApprovalDemo({ revealed }: { revealed: boolean }) {
  const { ref, frame, looping, pause, resume, playOnce } = useDemoTimeline(reviewCues, revealed);
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
    if (looping) {
      pause();
      return;
    }
    setEditing(false);
    setSaved(response);
    setDraft(response);
    setManual(false);
    resume();
  }

  return <div ref={ref} className={s.scene}>
    <DemoFrame area="Goedkeuringen" title={finished ? "Jouw akkoord is vastgelegd" : "Wacht op jouw akkoord"} description="Bekijk wat er klaarstaat voor je beslist." canReset looping={looping} onPlayback={togglePlayback}>
      <TaskList frame={frame} review />
      <div className={s.reviewActions} hidden={editing}>
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
  {
    title: "Eén keer je bedrijf vastleggen",
    description: "Breng je website, documenten en werkwijzen samen in je Company Brain. Jij vult aan wat nog ontbreekt. Zo vertrekken je team en je agents van dezelfde bedrijfskennis.",
    Demo: BrainDemo,
  },
  {
    title: "Je agents plannen en bereiden voor",
    description: "Je agents gebruiken je bedrijfskennis om afgesproken taken uit te werken. Denk aan een week aan posts, een offerte volgens jouw prijsafspraken of een antwoord in je eigen toon.",
    Demo: AgentDemo,
  },
  {
    title: "Jij beslist wat naar buiten gaat",
    description: "Lees het voorstel, pas aan waar nodig en geef zelf je akkoord. Zo bepaal jij welke offerte wordt verstuurd, welke post wordt ingepland en welk antwoord naar de klant gaat.",
    Demo: ApprovalDemo,
  },
];

type RevealStage = "idle" | "pending" | "entering" | "shown";

function useStepReveal() {
  const ref = useRef<HTMLElement>(null);
  const [stages, setStages] = useState<RevealStage[]>(() => steps.map(() => "idle"));

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const showAll = () => setStages(steps.map(() => "shown"));
    if (preference.matches || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    const rows = [...section.querySelectorAll<HTMLElement>(":scope > article")];
    const pending = new Set(rows);
    const inView = new Set<Element>();
    let timer: number | undefined;
    const setStage = (index: number, stage: RevealStage) =>
      setStages(current => current.map((value, i) => i === index ? stage : value));

    function revealNext() {
      if (timer !== undefined) return;
      const index = rows.findIndex(row => pending.has(row) && inView.has(row));
      if (index === -1) return;
      const row = rows[index];
      pending.delete(row);
      observer.unobserve(row);
      setStage(index, "entering");
      timer = window.setTimeout(() => {
        timer = undefined;
        setStage(index, "shown");
        revealNext();
      }, stepEnterMs);
    }

    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) inView.add(target);
        else inView.delete(target);
      }
      revealNext();
    }, { rootMargin: "-72px 0px -90px" });
    const focus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const row = rows.find(candidate => candidate.contains(target));
      if (!row || !pending.delete(row)) return;
      observer.unobserve(row);
      setStage(rows.indexOf(row), "shown");
    };
    const reduce = () => {
      if (!preference.matches) return;
      window.clearTimeout(timer);
      pending.clear();
      observer.disconnect();
      showAll();
    };
    setStages(steps.map(() => "pending"));
    rows.forEach(row => observer.observe(row));
    section.addEventListener("focusin", focus);
    preference.addEventListener("change", reduce);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      section.removeEventListener("focusin", focus);
      preference.removeEventListener("change", reduce);
    };
  }, []);

  return { ref, stages };
}

export default function WorkInAction() {
  const { ref, stages } = useStepReveal();
  const [stickyStory, setStickyStory] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 365px) and (max-width: 760px) and (min-height: 730px) and (prefers-reduced-motion: no-preference)");
    const update = () => setStickyStory(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return <section ref={ref} className={s.section} id="mogelijkheden" aria-labelledby="benefits-title" data-sticky-story={stickyStory || undefined}
    style={{ "--loader-duration": `${fluidDotsDurationMs}ms`, "--step-enter-duration": `${stepEnterMs}ms` } as CSSProperties}>
    <header className={s.intro}>
      <Kicker>Voorbeeld</Kicker>
      <h2 id="benefits-title">Van bedrijfskennis naar goedgekeurd werk.</h2>
      <AccentLine>Jij beslist.</AccentLine>
    </header>
    {steps.map(({ title, description, Demo }, index) => <article className={s.step} data-step-reveal={stages[index]} key={title}>
      <div className={s.copy}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <motion.div className={s.demoStage}
        initial={false}
        animate={stickyStory ? { opacity: 0, y: 10 } : undefined}
        whileInView={stickyStory ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: .25, margin: "-75px 0px -35px 0px" }}
        transition={{ duration: .34, ease: [.16, 1, .3, 1] }}>
        <Demo revealed={stages[index] === "shown"} />
      </motion.div>
    </article>)}
  </section>;
}
