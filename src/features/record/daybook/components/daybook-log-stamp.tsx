import { cn } from "@/lib/cn";
import type { LogKind } from "@/universe";
import { KIND_CONFIG } from "../data/KIND_CONFIG";
import { EXPEDITION_COLORS } from "../data/EXPEDITION_COLORS";

interface DaybookLogStampProps {
  kind: LogKind;
  colorIndex: number;
}

export function DaybookLogStamp({ kind, colorIndex }: DaybookLogStampProps) {
  const config = KIND_CONFIG[kind];
  const color = EXPEDITION_COLORS[colorIndex % EXPEDITION_COLORS.length]!;
  return (
    <span
      className={cn(
        "flex-none rounded-sm border-2 px-1.75 py-0.5 font-mono text-3xs font-bold uppercase tracking-[0.08em] opacity-85",
        color.border,
        color.text,
        config.rotate,
      )}
    >
      {config.stamp}
    </span>
  );
}
