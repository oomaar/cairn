"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** A locally-filed expedition draft (the universe is immutable, so newly
 *  created expeditions live here for the session). */
export interface ExpeditionDraft {
  id: string;
  name: string;
  region: string;
  country: string;
  grade: string;
  distanceKm: number;
  gainM: number;
  dayTotal: number;
  leaderId: string | null;
  gearCount: number;
}

interface DraftsValue {
  drafts: ExpeditionDraft[];
  addDraft: (draft: Omit<ExpeditionDraft, "id">) => ExpeditionDraft;
}

const DraftsContext = createContext<DraftsValue | null>(null);

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Holds expeditions created this session, so the builder can file one and have
 *  it appear in the Expeditions index. */
export function ExpeditionDraftsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [drafts, setDrafts] = useState<ExpeditionDraft[]>([]);

  const value = useMemo<DraftsValue>(
    () => ({
      drafts,
      addDraft: (draft) => {
        const created: ExpeditionDraft = {
          ...draft,
          id: `draft-${drafts.length + 1}-${slug(draft.name) || "expedition"}`,
        };
        setDrafts((prev) => [...prev, created]);
        return created;
      },
    }),
    [drafts],
  );

  return <DraftsContext value={value}>{children}</DraftsContext>;
}

export function useExpeditionDrafts(): DraftsValue {
  const ctx = useContext(DraftsContext);
  if (!ctx) {
    throw new Error(
      "useExpeditionDrafts must be used within an ExpeditionDraftsProvider",
    );
  }
  return ctx;
}
