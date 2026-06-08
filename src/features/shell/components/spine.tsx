import { CairnMark, Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { WorldKey } from "@/features/theme";
import type { RoleKey } from "@/features/session";
import { SPINE_ACCENT } from "../spine-accent";
import { WorldNav } from "./world-nav";
import { RoleSwitcher } from "./role-switcher";

interface SpineProps {
  world: WorldKey;
  role: RoleKey;
  onWorldChange: (world: WorldKey) => void;
  onRoleChange: (role: RoleKey) => void;
  onOpenCommand: () => void;
}

/**
 * The spine — the constant neutral rail that frames every world. It carries
 * identity, the world switch, and the role/identity controls. It sits outside
 * any `.world-*` scope, so it stays neutral while the canvas re-skins.
 */
export function Spine({
  world,
  role,
  onWorldChange,
  onRoleChange,
  onOpenCommand,
}: SpineProps) {
  return (
    <aside className="z-30 flex w-20.5 flex-none flex-col items-center border-r border-spine-edge bg-spine py-3.5">
      <div className={cn("mb-4.5", SPINE_ACCENT[world].text)} title="Cairn">
        <CairnMark size={30} className="text-current" />
      </div>
      <button
        type="button"
        onClick={onOpenCommand}
        title="Command palette (⌘K)"
        aria-label="Open command palette"
        className="mb-3 grid size-9 place-items-center rounded-lg border border-spine-edge text-spine-ink-2 transition-colors hover:text-spine-ink"
      >
        <Icon name="search" size={18} />
      </button>
      <WorldNav active={world} onSelect={onWorldChange} />
      <RoleSwitcher active={role} world={world} onSelect={onRoleChange} />
    </aside>
  );
}
