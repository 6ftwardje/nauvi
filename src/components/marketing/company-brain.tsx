"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, FileText, Users } from "lucide-react";
import { motion, useScroll, useSpring, useTransform, type MotionStyle } from "motion/react";
import { publicPath } from "@/lib/public-path";
import { BrainDemo } from "./brain-demo";
import { brainSources, type BrainSource, type BrainSourceId } from "./brain-content";
import type { BrainActivity } from "./brain-scene";
import s from "./company-brain.module.css";

function KnowledgeSourceCard({ source, active, selected, onHover, onFocus, onSelect }: {
  source: BrainSource;
  active: boolean;
  selected: boolean;
  onHover: (id: BrainSourceId | null) => void;
  onFocus: (id: BrainSourceId | null) => void;
  onSelect: (id: BrainSourceId) => void;
}) {
  const Icon = source.id === "colleagues" ? Users : FileText;
  return <button
    type="button"
    className={s.source}
    data-source={source.id}
    data-active={active}
    aria-pressed={selected}
    aria-controls="brain-source-status"
    style={{ "--source-x": `${source.x}%`, "--source-y": `${source.y}%` } as CSSProperties}
    onPointerEnter={event => { if (event.pointerType === "mouse") onHover(source.id); }}
    onPointerLeave={() => onHover(null)}
    onFocus={() => onFocus(source.id)}
    onBlur={() => onFocus(null)}
    onClick={() => onSelect(source.id)}
  >
    {source.logo
      ? <img src={publicPath(`/marketing/logos/${source.logo}.svg`)} width="22" height="22" alt="" />
      : <Icon size={22} strokeWidth={1.6} aria-hidden="true" />}
    <span><strong>{source.label}</strong><strong className={s.shortLabel} aria-hidden="true">{source.short}</strong><small>{source.detail}</small></span>
  </button>;
}

function BrainConnections({ isActive }: { isActive: (source: BrainSourceId) => boolean }) {
  return <svg className={s.connections} data-brain-connections viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none" aria-hidden="true">
    {brainSources.slice(0, 4).map(source => {
      // Approximate the neutral pose before WebGL is ready. The scene replaces
      // these endpoints with projected surface coordinates when it renders.
      const sx = source.x < 50 ? 240 : 760;
      const sy = source.y * 10;
      const x = 500 + source.anchor[0] * 350;
      const y = 460 - source.anchor[1] * 420;
      const mid = (sx + x) / 2;
      return <g key={source.id} data-connection={source.id} data-active={isActive(source.id)}>
        <path d={`M${sx} ${sy} C${mid} ${sy} ${mid} ${y} ${x} ${y}`} vectorEffect="non-scaling-stroke" />
        <circle data-terminal cx={x} cy={y} r="3.4" />
        <circle data-signal r="3" opacity="0" />
      </g>;
    })}
  </svg>;
}

export function CompanyBrain() {
  const [hovered, setHovered] = useState<BrainSourceId | null>(null);
  const [focused, setFocused] = useState<BrainSourceId | null>(null);
  const [selected, setSelected] = useState<BrainSourceId | null>(null);
  const [demo, setDemo] = useState<readonly BrainSourceId[]>([]);
  const [scene, setScene] = useState<"poster" | "ready" | "fallback">("poster");
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const activity = useRef<BrainActivity>({ hovered: null, focused: null, selected: null, demo: [] });
  const { scrollYProgress } = useScroll({ target: viewport, offset: ["start 0.6", "end 0.24"] });
  const easedScroll = useSpring(scrollYProgress, { stiffness: 105, damping: 27, restDelta: .001 });
  const scrollPose = useTransform(easedScroll, [.16, .88], [0, 1]);
  const posterLift = useTransform(scrollPose, [0, 1], ["0px", "-15px"]);
  const posterTurn = useTransform(scrollPose, [0, 1], ["0deg", "12deg"]);

  useEffect(() => {
    activity.current = { hovered, focused, selected, demo };
    stage.current?.dispatchEvent(new Event("brain-activity"));
  }, [hovered, focused, selected, demo]);

  useEffect(() => {
    const area = stage.current;
    const modelViewport = viewport.current;
    const drawing = canvas.current;
    if (!area || !modelViewport || !drawing) return;
    const controller = new AbortController();
    const { signal } = controller;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void import("./brain-scene").then(({ mountBrainScene }) => {
        if (signal.aborted) return;
        return mountBrainScene({
          stage: area, viewport: modelViewport, canvas: drawing, activity: () => activity.current, scrollPose: () => scrollPose.get(), signal,
          onReady: () => { if (!signal.aborted) setScene("ready"); },
          onFailure: () => { if (!signal.aborted) setScene("fallback"); },
        });
      }).catch(() => { if (!signal.aborted) setScene("fallback"); });
    }, { rootMargin: "120px 0px" });
    observer.observe(area);
    return () => { observer.disconnect(); controller.abort(); };
  }, [scrollPose]);

  const active = hovered ?? focused ?? selected;
  const current = brainSources.find(source => source.id === selected);
  const isActive = (id: BrainSourceId) => id === active || demo.includes(id);
  const renderSource = (source: BrainSource) => <KnowledgeSourceCard
    key={source.id} source={source} active={isActive(source.id)} selected={selected === source.id}
    onHover={setHovered} onFocus={setFocused} onSelect={id => setSelected(previous => previous === id ? null : id)}
  />;

  return <div className={s.visual} role="group" aria-label="Interactief voorbeeld van het Company Brain">
    <div className={s.stage} ref={stage} data-scene={scene} data-engaged={Boolean(active || demo.length)}>
      <div className={s.ground} aria-hidden="true" />
      <div
        className={s.viewport}
        ref={viewport}
        tabIndex={scene === "ready" ? 0 : undefined}
        role="group"
        aria-label="3D-model van het Company Brain"
        aria-describedby={scene === "ready" ? "brain-model-instructions" : undefined}
        aria-keyshortcuts={scene === "ready" ? "ArrowUp ArrowDown ArrowLeft ArrowRight Escape" : undefined}
      >
        <motion.img className={s.poster} style={{ "--poster-lift": posterLift, "--poster-turn": posterTurn } as MotionStyle}
          src={publicPath("/marketing/brain/company-brain.webp")} width="840" height="580" alt="" fetchPriority="high" />
        <canvas ref={canvas} aria-hidden="true" />
      </div>
      <BrainConnections key={scene === "fallback" ? "fallback" : "live"} isActive={isActive} />
      <div className={s.identity}><strong>Company Brain</strong></div>
      <div className={s.sources} role="group" aria-label="Kennisbronnen">
        {brainSources.slice(0, 4).map(renderSource)}
      </div>
    </div>
    <div className={s.meta}>
      <span className={s.modelHelp} aria-hidden="true">{scene === "ready" ? "Sleep om te draaien" : "Bedrijfskennis op één plek"}</span>
      <span id="brain-model-instructions" className={s.srOnly}>Draai het model met de pijltjestoetsen. Druk op Escape om het terug te zetten.</span>
      <a className={s.credit} href={publicPath("/marketing/brain/attribution.txt")} aria-label="Bron en licentie van het 3D-model">3D-model</a>
      <details className={s.more} onToggle={event => {
        if (event.currentTarget.open) return;
        setSelected(previous => previous === "crm" || previous === "colleagues" ||
          (previous === "documents" && window.matchMedia("(max-width: 600px)").matches) ? null : previous);
        setHovered(null);
        setFocused(null);
      }}>
        <summary>Meer bronnen <ChevronDown size={13} aria-hidden="true" /></summary>
        <div className={s.extraSources}>{brainSources.slice(3).map(renderSource)}</div>
      </details>
    </div>
    <p id="brain-source-status" className={s.srOnly} role="status" aria-atomic="true">
      {current ? `Voorbeeldverbinding geselecteerd. ${current.label}. ${current.detail}.` : ""}
    </p>
    <BrainDemo onSources={setDemo} />
  </div>;
}
