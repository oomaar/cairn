import { cn } from "@/lib/cn";
import type { LogKind } from "@/universe";
import { KIND_CONFIG } from "../data/KIND_CONFIG";

interface DaybookLogStampProps {
  kind: LogKind;
}

export function DaybookLogStamp({ kind }: DaybookLogStampProps) {
  const config = KIND_CONFIG[kind];
  return (
    <span
      className={cn(
        "flex-none rounded border px-1.5 py-0.5 font-mono text-2xs uppercase tracking-wider",
        config.classes,
        config.rotate,
      )}
    >
      {config.stamp}
    </span>
  );
}
