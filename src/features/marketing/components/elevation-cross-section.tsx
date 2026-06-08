import { cn } from "@/lib/cn";

interface Marker {
  id: string;
  km: number;
  hazard: boolean;
}

interface ElevationCrossSectionProps {
  profile: readonly number[];
  /** Distance the profile spans (km), used to place markers along x. */
  distanceKm: number;
  markers: readonly Marker[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const W = 520;
const H = 132;

/** Route elevation profile with selectable checkpoint markers. Uniform scaling
 *  (no preserveAspectRatio override) keeps the markers round at any width. */
export function ElevationCrossSection({
  profile,
  distanceKm,
  markers,
  selectedId,
  onSelect,
}: ElevationCrossSectionProps) {
  const max = Math.max(...profile);
  const min = Math.min(...profile);
  const span = Math.max(1, max - min);

  const toY = (value: number) => H - 10 - ((value - min) / span) * (H - 28);
  const xy = profile.map(
    (p, i) => [(i / (profile.length - 1)) * W, toY(p)] as const,
  );
  const line = `M${xy.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")}`;
  const area = `${line} L${W} ${H} L0 ${H} Z`;

  const yAtFraction = (f: number) => {
    const idx = f * (profile.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    const t = idx - lo;
    return toY(profile[lo] + (profile[hi] - profile[lo]) * t);
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Route elevation cross-section"
    >
      <path
        d={area}
        className="text-accent"
        fill="currentColor"
        fillOpacity={0.12}
      />
      <path
        d={line}
        className="text-accent-bright"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      {markers.map((m) => {
        const f = distanceKm > 0 ? Math.min(1, m.km / distanceKm) : 0;
        const x = f * W;
        const y = yAtFraction(f);
        const selected = m.id === selectedId;
        return (
          <g
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="cursor-pointer"
          >
            <line
              x1={x}
              y1={y}
              x2={x}
              y2={H}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="2 3"
              className={selected ? "text-accent-bright" : "text-border-strong"}
            />
            <circle
              cx={x}
              cy={y}
              r={selected ? 5 : 3.5}
              strokeWidth={2}
              stroke="currentColor"
              className={cn(
                "fill-surface",
                m.hazard
                  ? "text-danger-bright"
                  : selected
                    ? "text-accent-bright"
                    : "text-accent",
              )}
            />
            {/* Larger invisible hit target */}
            <circle cx={x} cy={y} r={11} className="fill-transparent" />
          </g>
        );
      })}
    </svg>
  );
}
