import { publicPath } from "@/lib/public-path";
import s from "./wordmark.module.css";

/** Official wordmark. The ink file is for light surfaces, the white file for dark ones. */
export function NauviWordmark({ className }: { className?: string }) {
  return <span className={`${s.stack} ${className ?? ""}`}>
    <img className={s.onLight} src={publicPath("/brand/logo.svg")} width={120} height={41} alt="" draggable={false} />
    <img className={s.onDark} src={publicPath("/brand/logo-white.svg")} width={120} height={41} alt="" draggable={false} />
  </span>;
}
