export function NauviWordmark({ className }: { className?: string }) {
  return <img className={className} src="/brand/nauvi-logo-primary.svg" width={112} height={39} alt="Nauvi" draggable={false} />;
}

export function NauviMark({ size }: { size: number }) {
  return <img src="/brand/nauvi-star.svg" width={size} height={Math.round(size * 195 / 310)} alt="" draggable={false} />;
}
