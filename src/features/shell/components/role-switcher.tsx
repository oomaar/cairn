import { Avatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { WorldKey } from "@/features/theme";
import { ROLES, type RoleKey } from "../roles";
import { SPINE_ACCENT } from "../spine-accent";

interface RoleSwitcherProps {
  active: RoleKey;
  world: WorldKey;
  onSelect: (role: RoleKey) => void;
}

/** Role view-as control plus the current identity avatar, anchored to the
 *  bottom of the spine. Active role is marked in the active world's accent. */
export function RoleSwitcher({ active, world, onSelect }: RoleSwitcherProps) {
  const accent = SPINE_ACCENT[world];
  const activeRole = ROLES.find((role) => role.key === active) ?? ROLES[0];

  return (
    <div className="mt-auto flex w-full flex-col items-center gap-2.5">
      <span className="font-mono text-3xs uppercase tracking-[0.12em] text-spine-ink-3">
        Role
      </span>
      <div className="flex flex-col gap-1" role="group" aria-label="View as role">
        {ROLES.map((role) => {
          const on = role.key === active;
          return (
            <button
              key={role.key}
              type="button"
              onClick={() => onSelect(role.key)}
              aria-pressed={on}
              title={role.label}
              className={cn(
                "size-7.5 rounded-lg border font-mono text-sm font-bold transition-colors duration-150 ease-standard",
                on
                  ? cn(accent.text, accent.border, accent.fill)
                  : "border-spine-edge text-spine-ink-3 hover:text-spine-ink-2",
              )}
            >
              {role.glyph}
            </button>
          );
        })}
      </div>
      <span className="my-0.5 h-px w-8 bg-spine-edge" />
      <Avatar initials={activeRole.initials} size="md" tone="quiet" />
    </div>
  );
}
