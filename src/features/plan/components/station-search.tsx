"use client";

import { useState } from "react";
import { Icon, Text } from "@/components/ui";
import type { PlanStation } from "../route.types";

interface StationSearchProps {
  stations: PlanStation[];
  onPick: (id: string) => void;
}

/** Find a checkpoint by name and jump-zoom to it. */
export function StationSearch({ stations, onPick }: StationSearchProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = q
    ? stations.filter((s) => s.name.toLowerCase().includes(q))
    : [];

  return (
    <div className="border-b border-border px-3 py-3">
      <div className="flex items-center gap-2 rounded-md border border-border bg-inset px-2.5">
        <Icon name="search" size={14} className="text-fg-3" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find station…"
          aria-label="Find station"
          className="h-8 flex-1 bg-transparent text-sm text-fg-1 outline-none placeholder:text-fg-4"
        />
      </div>
      {q && (
        <ul className="mt-1.5 flex flex-col gap-0.5">
          {matches.length === 0 ? (
            <li className="px-2 py-1.5">
              <Text variant="caption" as="span" tone="tertiary">
                No match
              </Text>
            </li>
          ) : (
            matches.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(s.id);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-raised"
                >
                  <Text
                    variant="caption"
                    as="span"
                    className="flex-1 truncate text-fg-2"
                  >
                    {s.name}
                  </Text>
                  <Text
                    variant="caption"
                    as="span"
                    tone="tertiary"
                    className="font-mono"
                  >
                    {s.km} km
                  </Text>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
