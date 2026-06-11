import { contourRing } from "../../route-planning/utils/route.utils";

interface SheetThumbProps {
  seed: number;
}

export function SheetThumb({ seed }: SheetThumbProps) {
  return (
    <svg
      viewBox="0 0 210 96"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect width={210} height={96} className="fill-inset" />
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={contourRing(105, 48, 16 + i * 14, seed + i * 0.5, 0.7, 0.18)}
          fill="none"
          strokeWidth={i % 2 ? 1 : 0.7}
          className={
            i % 2 ? "stroke-(--plan-contour-index)" : "stroke-(--plan-contour)"
          }
        />
      ))}
      <path
        d="M10 82 C 60 56, 120 72, 200 36"
        fill="none"
        strokeWidth={1.6}
        strokeDasharray="3 3"
        className="stroke-accent"
      />
    </svg>
  );
}
