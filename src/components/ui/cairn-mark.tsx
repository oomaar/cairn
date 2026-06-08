import { cn } from "@/lib/cn";

/**
 * Cairn mark — four stacked stones (a trail-marker cairn). Fills with
 * `currentColor`, so set the color with a text-* utility on the mark or an
 * ancestor (e.g. the active world accent in the spine).
 */
interface CairnMarkProps {
  size?: number;
  className?: string;
}

export function CairnMark({ size = 26, className }: CairnMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0 text-accent", className)}
      aria-hidden="true"
    >
      <ellipse cx="16" cy="25.5" rx="9.5" ry="3.6" fill="currentColor" opacity="0.92" />
      <ellipse cx="16" cy="18" rx="7.2" ry="3.3" fill="currentColor" opacity="0.78" />
      <ellipse cx="16.4" cy="11.4" rx="5" ry="2.8" fill="currentColor" opacity="0.62" />
      <ellipse cx="15.6" cy="6" rx="3.1" ry="2.2" fill="currentColor" opacity="0.48" />
    </svg>
  );
}
