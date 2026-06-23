export function barClass(pct: number): string {
  if (pct >= 90) return "bg-ok";
  if (pct >= 75) return "bg-warn";
  return "bg-danger";
}
