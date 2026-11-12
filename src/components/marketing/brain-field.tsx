"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import s from "./brain-platform.module.css";

const labelSlot = 2.35;
const labels = [
  { row: 1, col: 4, text: "Bronnen" },
  { row: 7, col: 5, text: "Nazicht" },
  { row: 2, col: 7, text: "Werkwijzen" },
  { row: 6, col: 1, text: "Prijsafspraken" },
  { row: 4, col: 8, text: "Koppelingen" },
  { row: 8, col: 3, text: "AI-agents" },
  { row: 4, col: 0, text: "Documenten" },
];

const dots = Array.from({ length: 81 }, (_, index) => {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const labelIndex = labels.findIndex(item => item.row === row && item.col === col);
  return { index, row, col, label: labels[labelIndex]?.text, labelIndex, accent: (row + col) % 2 === 0 };
}).filter(({ row, col }) => row < 3 || row > 5 || col < 2 || col > 6);

export function BrainField({ children, mode, after }: {
  children: ReactNode;
  mode: "home" | "platform";
  after?: ReactNode;
}) {
  const field = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const inView = useInView(field);
  const started = useInView(intro, { once: true });

  return (
    <div className={s.field} data-mode={mode} data-running={inView} data-started={started} ref={field}>
      <div className={s.fieldLight} aria-hidden="true" />
      <div className={s.fieldIntro} ref={intro}>
        <div className={s.dots} aria-hidden="true">
          {dots.map(({ index, row, col, label, labelIndex, accent }) => (
            <span
              key={index}
              className={s.dot}
              data-accent={accent}
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
                "--dot-delay": `${(Math.abs(col - 4) * .13 + Math.abs(row - 4) * .025).toFixed(2)}s`,
              } as CSSProperties}
            >
              {label && <span className={s.dotLabel}
                data-side={col > 4 ? "left" : "right"}
                style={{
                  "--label-cycle": `${labelSlot * labels.length}s`,
                  "--label-delay": `${1 + labelIndex * labelSlot}s`,
                  "--label-length": label.length,
                } as CSSProperties}
              >
                <span className={s.labelChip} />
                <span className={s.labelStrip}><span className={s.labelText}>{label}</span></span>
              </span>}
            </span>
          ))}
        </div>
        <div className={s.fieldContent}>{children}</div>
      </div>
      {after}
    </div>
  );
}
