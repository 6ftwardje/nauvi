"use client";

import { useRef, type ComponentPropsWithRef, type PointerEvent } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from "motion/react";
import s from "./gradient-section.module.css";

type Gradient = "hero" | "contact";
type Props = Omit<ComponentPropsWithRef<"section">, "onPointerMove" | "onPointerLeave"> & { gradient: Gradient };

const follow = { stiffness: 90, damping: 24, restDelta: .1 };

export function GradientSection({ gradient, className, children, ...props }: Props) {
  const frame = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-23px", "23px"]);
  const x = useSpring(0, follow);
  const y = useSpring(0, follow);

  function move(event: PointerEvent<HTMLElement>) {
    if (reduce || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - .5;
    const vertical = (event.clientY - bounds.top) / bounds.height - .5;
    x.set(Math.max(-20, Math.min(20, horizontal * 40)));
    y.set(Math.max(-15, Math.min(15, vertical * 30)));
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <section {...props} className={className ? `${s.section} ${className}` : s.section} onPointerMove={move} onPointerLeave={reset}>
      <span ref={frame} className={s.frame} aria-hidden="true" data-gradient={gradient}>
        <motion.span className={s.light} style={reduce ? undefined : { x, y, "--gradient-drift": drift } as MotionStyle} />
      </span>
      {children}
    </section>
  );
}
