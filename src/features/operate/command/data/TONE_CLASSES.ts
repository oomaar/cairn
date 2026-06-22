export const TONE_CLASSES: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  danger: {
    border: "border-danger",
    bg: "bg-danger/10",
    text: "text-danger",
  },
  warn: {
    border: "border-warn",
    bg: "bg-warn/10",
    text: "text-warn",
  },
  ok: {
    border: "border-accent-line",
    bg: "bg-accent/10",
    text: "text-accent",
  },
  idle: {
    border: "border-border",
    bg: "bg-transparent",
    text: "text-fg-4",
  },
};
