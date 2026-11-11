import type { ReactNode } from "react";
import e from "./editorial.module.css";

export function Kicker({ children }: { children: ReactNode }) {
  return <p className={e.kicker} data-kicker>{children}</p>;
}

export function AccentLine({ children }: { children: ReactNode }) {
  return <p className={e.accent} data-accent>{children}</p>;
}
