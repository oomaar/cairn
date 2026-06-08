import { Icon, Text, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { World } from "@/features/theme";

interface WorldCanvasProps {
  world: World;
  module: string;
  onModuleChange: (module: string) => void;
  /** Active expedition shown in the canvas context strip. */
  expedition: string;
}

/**
 * The world canvas. Wrapping in `world.scopeClass` re-points the shared
 * tokens, so every utility below (bg-app, bg-surface, border-border, accent,
 * …) renders in this world's palette. The canvas owns the module tab bar and
 * the expedition context strip; individual world modules render into the body.
 */
export function WorldCanvas({
  world,
  module,
  onModuleChange,
  expedition,
}: WorldCanvasProps) {
  const activeModule =
    world.modules.find((m) => m.key === module) ?? world.modules[0];

  return (
    <div
      className={cn(
        world.scopeClass,
        "flex min-w-0 flex-1 flex-col overflow-hidden bg-app text-fg-1",
      )}
    >
      {/* Module tabs + expedition context */}
      <div className="flex h-12 flex-none items-stretch border-b border-border font-mono">
        <div className="flex" role="tablist" aria-label={`${world.label} modules`}>
          {world.modules.map((m) => {
            const on = m.key === activeModule.key;
            return (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onModuleChange(m.key)}
                className={cn(
                  "border-r border-b-2 px-4.5 text-2xs font-semibold uppercase tracking-[0.06em] transition-colors duration-150 ease-standard",
                  on
                    ? "border-r-border border-b-accent bg-raised text-fg-1"
                    : "border-r-border border-b-transparent text-fg-3 hover:text-fg-2",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-1 items-center" />
        <div className="flex items-center gap-2.5 border-l border-border px-4 text-fg-2">
          <Icon name="pin" size={14} className="text-accent-bright" />
          <span className="text-sm">{expedition}</span>
        </div>
      </div>

      {/* Canvas body — world modules render here. */}
      <div className="relative grid flex-1 place-items-center overflow-hidden bg-app">
        <div className="flex max-w-md flex-col items-center gap-3 px-8 text-center">
          <span className="grid size-14 place-items-center rounded-2xl border border-border bg-surface text-accent-bright">
            <Icon name={world.icon as IconName} size={26} />
          </span>
          <Text variant="h1">{world.label}</Text>
          <Text variant="body" tone="secondary">
            {world.description}.
          </Text>
          <Text variant="eyebrow" as="span" className="mt-2">
            {activeModule.label} · workspace coming online
          </Text>
        </div>
      </div>
    </div>
  );
}
