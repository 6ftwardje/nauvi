"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import s from "./cinematic.module.css";

export function RevealHeading({
  as: Heading = "h2",
  id,
  lines,
  when = "visible",
  breakClassName,
}: {
  as?: "h1" | "h2";
  id: string;
  lines: readonly string[];
  when?: "load" | "visible";
  breakClassName?: string;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const seen = useInView(heading, { once: true, amount: .55 });
  let wordIndex = 0;

  return (
    <Heading
      className={s.revealHeading}
      ref={heading}
      id={id}
      aria-label={lines.join(" ")}
      data-revealed={when === "load" || seen}
    >
      {lines.map((line, lineIndex) => (
        <Fragment key={line}>
          {lineIndex > 0 && <>{" "}<br className={breakClassName} aria-hidden="true" /></>}
          {line.split(" ").map((word, index) => (
            <Fragment key={index}>
              {index > 0 && " "}
              <span aria-hidden="true" style={{ "--word-delay": `${wordIndex++ * 37}ms` } as CSSProperties}>{word}</span>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Heading>
  );
}
