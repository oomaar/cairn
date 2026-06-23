"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useNavigation } from "@/features/navigation";
import type { World } from "@/features/theme";
import { getExpedition } from "@/universe";

interface WorldFrameProps {
  world: World;
  children: ReactNode;
}

/**
 * The canvas chrome for a world. Wrapping in `world.scopeClass` re-points the
 * shared tokens, so everything inside renders in this world's palette. Owns the
 * module tab bar (real route links) and the expedition context strip; the
 * routed module page renders into the body.
 */
export function WorldFrame({ world, children }: WorldFrameProps) {
  const nav = useNavigation();
  const expedition = getExpedition(nav.focusedExpeditionId);

  return (
    <div
      className={cn(
        world.scopeClass,
        "flex min-w-0 flex-1 flex-col overflow-hidden bg-app text-fg-1",
      )}
    >
      {/* Module tabs + expedition context */}
      <div className="flex h-12 flex-none items-stretch border-b border-border font-mono">
        <div
          className="flex"
          role="tablist"
          aria-label={`${world.label} modules`}
        >
          {world.modules.map((m) => {
            const on = m.key === nav.module;
            return (
              <Link
                key={m.key}
                href={`/${world.key}/${m.key}`}
                role="tab"
                aria-selected={on}
                className={cn(
                  "flex items-center border-b-2 px-4.5 text-2xs font-semibold uppercase tracking-[0.06em] transition-colors duration-150 ease-standard",
                  on
                    ? "border-b-accent text-fg-1"
                    : "border-b-transparent text-fg-3 hover:text-fg-2",
                )}
              >
                {m.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-1 items-center" />
        <div className="flex items-center gap-2.5 border-l border-border px-4 text-fg-2">
          <Icon name="pin" size={14} className="text-accent-bright" />
          <span className="text-sm">{expedition?.name ?? "—"}</span>
        </div>
      </div>

      {/* Routed module content */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-app">
        {children}
      </div>
    </div>
  );
}
