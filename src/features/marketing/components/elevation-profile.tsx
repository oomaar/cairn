import { cn } from "@/lib/cn";

/** A compact elevation area chart. Pure SVG from a sampled profile — colors
 *  inherit the active world accent. */
export function ElevationProfile({
  points,
  className,
}: {
  points: readonly number[];
  className?: string;
}) {
  const w = 520;
  const h = 120;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = Math.max(1, max - min);

  const xy = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - 8 - ((p - min) / span) * (h - 22);
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const line = `M${xy.join(" L")}`;
  const area = `${line} L${w} ${h} L0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block h-24 w-full", className)}
    >
      <path
        d={area}
        className="text-accent"
        fill="currentColor"
        fillOpacity={0.14}
      />
      <path
        d={line}
        className="text-accent-bright"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}
