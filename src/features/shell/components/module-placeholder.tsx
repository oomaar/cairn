import { Icon, Text, type IconName } from "@/components/ui";
import type { World } from "@/features/theme";

interface ModulePlaceholderProps {
  world: World;
  moduleLabel: string;
}

/**
 * Placeholder body for a not-yet-built module route. Renders the world's
 * identity and the module it stands in for, so every route resolves to
 * something coherent while the real workspaces are built out.
 */
export function ModulePlaceholder({
  world,
  moduleLabel,
}: ModulePlaceholderProps) {
  return (
    <div className="grid flex-1 place-items-center overflow-hidden">
      <div className="flex max-w-md flex-col items-center gap-3 px-8 text-center">
        <span className="grid size-14 place-items-center rounded-2xl border border-border bg-surface text-accent-bright">
          <Icon name={world.icon as IconName} size={26} />
        </span>
        <Text variant="h1">{moduleLabel}</Text>
        <Text variant="body" tone="secondary">
          {world.label} · {world.description}.
        </Text>
        <Text variant="eyebrow" as="span" className="mt-2">
          {moduleLabel} · workspace coming online
        </Text>
      </div>
    </div>
  );
}
