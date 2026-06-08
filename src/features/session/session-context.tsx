"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getPerson, type Person } from "@/universe";
import { roleCan, type Capability } from "./capabilities";
import { persistDemoRole } from "./fake-auth";
import { DEFAULT_ROLE, ROLE_BY_KEY } from "./role.constants";
import type { Role, RoleKey } from "./role.types";

interface SessionValue {
  /** Active role key. */
  role: RoleKey;
  /** Full active role definition. */
  activeRole: Role;
  /** The person (from the universe) the active role signs you in as. */
  currentUser: Person | undefined;
  /** Switch the active role. */
  setRole: (role: RoleKey) => void;
  /** Capability check for the active role. */
  can: (capability: Capability) => boolean;
}

const SessionContext = createContext<SessionValue | null>(null);

/** Provides the active role + capabilities to the whole app. */
export function SessionProvider({
  children,
  initialRole = DEFAULT_ROLE,
}: {
  children: ReactNode;
  initialRole?: RoleKey;
}) {
  const [role, setRoleState] = useState<RoleKey>(initialRole);

  const value = useMemo<SessionValue>(() => {
    const activeRole = ROLE_BY_KEY[role];
    return {
      role,
      activeRole,
      currentUser: getPerson(activeRole.personId),
      // Switching role also persists the demo identity, so the spine switcher
      // and a reload stay in sync with the chosen vantage.
      setRole: (next) => {
        setRoleState(next);
        persistDemoRole(next);
      },
      can: (capability) => roleCan(role, capability),
    };
  }, [role]);

  return <SessionContext value={value}>{children}</SessionContext>;
}

/** Read the active session. Throws if used outside a SessionProvider. */
export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}

/** Convenience: just the active role key. */
export function useRole(): RoleKey {
  return useSession().role;
}

/** Convenience: capability check for the active role. */
export function useCan(capability: Capability): boolean {
  return useSession().can(capability);
}
