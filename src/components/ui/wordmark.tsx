import { cn } from "@/lib/cn";
import { CairnMark } from "./cairn-mark";

/** Cairn wordmark — the mark paired with the CAIRN display lettering. */
interface WordmarkProps {
  size?: number;
  className?: string;
}

export function Wordmark({ size = 18, className }: WordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CairnMark size={size + 8} />
      <span className="font-display font-bold tracking-[0.02em] text-fg-1">
        CAIRN
      </span>
    </span>
  );
}
