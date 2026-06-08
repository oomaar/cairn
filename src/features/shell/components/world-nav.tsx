import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import { WORLDS, type WorldKey } from "@/features/theme";
import { SPINE_ACCENT } from "../spine-accent";

interface WorldNavProps {
  active: WorldKey;
  onSelect: (world: WorldKey) => void;
}

/** The world switch: one button per world, stacked in the spine. */
export function WorldNav({ active, onSelect }: WorldNavProps) {
  return (
    <nav
      className="flex w-full flex-col items-center gap-2"
      aria-label="Worlds"
    >
      {WORLDS.map((world) => {
        const on = world.key === active;
        const accent = SPINE_ACCENT[world.key];
        return (
          <button
            key={world.key}
            type="button"
            onClick={() => onSelect(world.key)}
            aria-current={on ? "page" : undefined}
            title={`${world.label} — ${world.description}`}
            className={cn(
              "relative flex w-16.5 flex-col items-center gap-1.5 rounded-xl border border-transparent py-2.75 transition-colors duration-150 ease-standard",
              on
                ? cn(accent.text, accent.border, accent.fill)
                : "text-spine-ink-2 hover:text-spine-ink",
            )}
          >
            {on && (
              <span
                className={cn(
                  "absolute -left-px top-3.5 bottom-3.5 w-0.5 rounded-sm",
                  accent.bar,
                )}
              />
            )}
            <Icon name={world.icon as IconName} size={21} />
            <span className="text-3xs font-bold uppercase tracking-[0.06em]">
              {world.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
