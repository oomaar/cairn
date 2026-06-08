import type { WorldKey } from "@/features/theme";

/**
 * The spine lives outside the per-world `.world-*` scope, so it can't use the
 * scoped `accent` token. Instead it points at the fixed `--spine-{world}`
 * vars via these literal utility strings (kept literal so Tailwind's scanner
 * emits them). One set per world: text, border, faint fill, and the active bar.
 */
interface SpineAccentClasses {
  readonly text: string;
  readonly border: string;
  readonly fill: string;
  readonly bar: string;
}

export const SPINE_ACCENT: Record<WorldKey, SpineAccentClasses> = {
  plan: {
    text: "text-[var(--spine-plan)]",
    border: "border-[var(--spine-plan)]",
    fill: "bg-[color-mix(in_srgb,var(--spine-plan)_14%,transparent)]",
    bar: "bg-[var(--spine-plan)]",
  },
  operate: {
    text: "text-[var(--spine-operate)]",
    border: "border-[var(--spine-operate)]",
    fill: "bg-[color-mix(in_srgb,var(--spine-operate)_14%,transparent)]",
    bar: "bg-[var(--spine-operate)]",
  },
  record: {
    text: "text-[var(--spine-record)]",
    border: "border-[var(--spine-record)]",
    fill: "bg-[color-mix(in_srgb,var(--spine-record)_14%,transparent)]",
    bar: "bg-[var(--spine-record)]",
  },
};
