import { cn } from "@/lib/cn";

/**
 * A quiet topographic contour field — evokes a map without decoration for its
 * own sake. Fully deterministic (no randomness), so it's SSR-safe and stable.
 * Inherits color via currentColor; set opacity/tone where it's placed.
 */
export function ContourBackdrop({ className }: { className?: string }) {
  const width = 800;
  const height = 520;
  const centers: [number, number][] = [
    [width * 0.3, height * 0.42],
    [width * 0.72, height * 0.58],
  ];
  const rings: { d: string; emphasis: boolean }[] = [];

  centers.forEach(([cx, cy], ci) => {
    for (let i = 0; i < 7; i++) {
      const radius = 28 + i * 30;
      const points: string[] = [];
      const steps = 48;
      for (let k = 0; k <= steps; k++) {
        const a = (k / steps) * Math.PI * 2;
        const wobble =
          1 +
          0.16 * Math.sin(a * 3 + ci * 1.7 + i * 0.5) +
          0.08 * Math.cos(a * 2 - i);
        const x = cx + radius * wobble * Math.cos(a);
        const y = cy + radius * wobble * Math.sin(a) * 0.74;
        points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      rings.push({
        d: `M${points.join(" L")}Z`,
        emphasis: i % 3 === 0,
      });
    }
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    >
      {rings.map((ring, i) => (
        <path
          key={i}
          d={ring.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={ring.emphasis ? 1.1 : 0.7}
        />
      ))}
    </svg>
  );
}
