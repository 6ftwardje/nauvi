"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import s from "./brain-platform.module.css";

const labels = [
  { row: 1, col: 4, text: "Bronnen" },
  { row: 2, col: 7, text: "Werkwijzen" },
  { row: 4, col: 0, text: "Documenten" },
  { row: 4, col: 8, text: "Koppelingen" },
  { row: 6, col: 1, text: "Prijsafspraken" },
  { row: 7, col: 5, text: "Nazicht" },
  { row: 8, col: 3, text: "AI-agents" },
];

const dots = Array.from({ length: 81 }, (_, index) => {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const label = labels.find(item => item.row === row && item.col === col);
  return { index, row, col, label: label?.text, accent: (row + col) % 2 === 0 };
}).filter(({ row, col }) => row < 3 || row > 5 || col < 2 || col > 6);

export function BrainField({ children, mode }: { children: ReactNode; mode: "home" | "platform" }) {
  const field = useRef<HTMLDivElement>(null);
  const inView = useInView(field);
  return (
    <div className={s.field} data-mode={mode} data-running={inView} ref={field}>
      <div className={s.fieldLight} aria-hidden="true" />
      <div className={s.dots} aria-hidden="true">
        {dots.map(({ index, row, col, label, accent }) => (
          <span
            key={index}
            className={s.dot}
            data-accent={accent}
            style={{
              gridRow: row + 1,
              gridColumn: col + 1,
              "--dot-x": `${(4 - col) * 17}px`,
              "--dot-y": `${(4 - row) * 12}px`,
              "--dot-delay": `${(row * .06 + Math.abs(col - 4) * .09).toFixed(2)}s`,
              "--label-delay": `${((index * 13) % 23) * -.53}s`,
            } as CSSProperties}
          >
            {label && <span className={s.dotLabel}>{label}</span>}
          </span>
        ))}
      </div>
      <div className={s.fieldContent}>{children}</div>
    </div>
  );
}
