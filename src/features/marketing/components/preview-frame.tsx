import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { World } from "@/features/theme";

interface PreviewFrameProps {
  world: World;
  /** Mono titlebar label, e.g. "PLAN · ROUTE PLANNING". */
  title: string;
  /** Optional right-aligned status node in the titlebar. */
  status?: ReactNode;
  children: ReactNode;
}

/**
 * Frames an operational preview as an inset "device": applies the world's
 * palette scope so the panel renders in the real app's colors, with a mono
 * titlebar. Sits on the light public page like a screenshot of the product.
 */
export function PreviewFrame({
  world,
  title,
  status,
  children,
}: PreviewFrameProps) {
  return (
    <div
      className={cn(
        world.scopeClass,
        "overflow-hidden rounded-xl border border-border bg-surface shadow-lg",
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-border bg-raised px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
        </span>
        <span className="font-mono text-3xs uppercase tracking-widest text-fg-3">
          {title}
        </span>
        {status && <span className="ml-auto">{status}</span>}
      </div>
      <div className="bg-app p-4">{children}</div>
    </div>
  );
}
