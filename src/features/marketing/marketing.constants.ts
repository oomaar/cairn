import type { WorldKey } from "@/features/theme";
import type { Tone } from "@/universe";

/**
 * Public-theme accents per world. The public site stays on warm paper, so we
 * use each world's spine accent as a highlight (icon, rule) rather than its
 * full dark canvas palette. Kept as literal strings so Tailwind emits them.
 */
export const WORLD_ACCENT: Record<WorldKey, { text: string; chip: string }> = {
  plan: {
    text: "text-[var(--spine-plan)]",
    chip: "bg-[color-mix(in_srgb,var(--spine-plan)_14%,transparent)]",
  },
  operate: {
    text: "text-[var(--spine-operate)]",
    chip: "bg-[color-mix(in_srgb,var(--spine-operate)_14%,transparent)]",
  },
  record: {
    text: "text-[var(--spine-record)]",
    chip: "bg-[color-mix(in_srgb,var(--spine-record)_16%,transparent)]",
  },
};

/** Status tone → dot color class, for the live-operation readout. */
export const TONE_DOT: Record<Tone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  danger: "bg-danger",
  slate: "bg-slate",
  amber: "bg-amber",
  olive: "bg-olive",
  idle: "bg-fg-4",
  quiet: "bg-fg-4",
};
