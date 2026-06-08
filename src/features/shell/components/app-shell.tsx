"use client";

import { WORLD_BY_KEY } from "@/features/theme";
import { SessionProvider, useSession } from "@/features/session";
import { NavigationProvider, useNavigation } from "@/features/navigation";
import {
  CommandPalette,
  CommandPaletteProvider,
  useCommandPalette,
} from "@/features/command-palette";
import { getExpedition } from "@/universe";
import { Spine } from "./spine";
import { WorldCanvas } from "./world-canvas";

/**
 * The shell frame — the persistent layout. Reads navigation and session from
 * context and composes the constant spine with the active world's canvas.
 */
function ShellFrame() {
  const { role, setRole } = useSession();
  const nav = useNavigation();
  const { openPalette } = useCommandPalette();
  const expedition = getExpedition(nav.focusedExpeditionId);

  return (
    <div className="flex flex-1 overflow-hidden bg-spine">
      <Spine
        world={nav.world}
        role={role}
        onWorldChange={nav.setWorld}
        onRoleChange={setRole}
        onOpenCommand={openPalette}
      />
      <WorldCanvas
        world={WORLD_BY_KEY[nav.world]}
        module={nav.module}
        onModuleChange={nav.setModule}
        expedition={expedition?.name ?? "—"}
      />
    </div>
  );
}

/**
 * AppShell — the application root. Establishes the session, navigation and
 * command-palette contexts for the whole app, then renders the shell frame
 * with the always-mounted command palette overlay.
 */
export function AppShell() {
  return (
    <SessionProvider>
      <NavigationProvider>
        <CommandPaletteProvider>
          <ShellFrame />
          <CommandPalette />
        </CommandPaletteProvider>
      </NavigationProvider>
    </SessionProvider>
  );
}
