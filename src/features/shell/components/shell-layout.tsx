"use client";

import type { ReactNode } from "react";
import { SessionProvider, useSession, type RoleKey } from "@/features/session";
import { NavigationProvider, useNavigation } from "@/features/navigation";
import {
  CommandPalette,
  CommandPaletteProvider,
  useCommandPalette,
} from "@/features/command-palette";
import { ExpeditionDraftsProvider } from "@/features/plan";
import { Spine } from "./spine";

/** Reads the app contexts and renders the constant spine alongside the routed
 *  world canvas ({children}). */
function ShellChrome({ children }: { children: ReactNode }) {
  const { role, setRole } = useSession();
  const nav = useNavigation();
  const { openPalette } = useCommandPalette();

  return (
    <div className="flex flex-1 overflow-hidden bg-spine">
      <Spine
        world={nav.world}
        role={role}
        onWorldChange={nav.setWorld}
        onRoleChange={setRole}
        onOpenCommand={openPalette}
      />
      <main className="ml-20.5 flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}

/**
 * The persistent application shell. Establishes the session, navigation and
 * command-palette contexts once, then frames every route with the spine and
 * the always-mounted command palette. Rendered from the shell route-group
 * layout, so it survives navigation between worlds and modules.
 */
export function ShellLayout({
  children,
  initialRole,
}: {
  children: ReactNode;
  initialRole?: RoleKey;
}) {
  return (
    <SessionProvider initialRole={initialRole}>
      <NavigationProvider>
        <ExpeditionDraftsProvider>
          <CommandPaletteProvider>
            <ShellChrome>{children}</ShellChrome>
            <CommandPalette />
          </CommandPaletteProvider>
        </ExpeditionDraftsProvider>
      </NavigationProvider>
    </SessionProvider>
  );
}
