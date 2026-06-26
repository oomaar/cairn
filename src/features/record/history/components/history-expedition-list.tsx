"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Expedition } from "@/universe";
import { ExpeditionListRow } from "./expedition-list-row";
import { type Filter, FILTERS } from "../data/FILTERS";

interface HistoryExpeditionListProps {
  expeditions: Expedition[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function HistoryExpeditionList({
  expeditions,
  selectedId,
  onSelect,
}: HistoryExpeditionListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = expeditions.filter((e) => {
    const matchesFilter = filter === "all" || e.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.region.toLowerCase().includes(q) ||
      e.country.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-full flex-col border-r-2 border-fg-1">
      {/* Header area — minimal */}
      <div className="flex-none border-b border-fg-2 px-6 py-4">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3 mb-3">
          Expeditions on record
        </div>

        {/* Search — minimal */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-full bg-transparent font-mono text-sm text-fg-1 placeholder:text-fg-4 focus:outline-none mb-3"
        />

        {/* Filter tabs — subtle */}
        <div className="flex gap-2">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "font-mono text-[9.5px] uppercase tracking-[0.06em] transition-colors py-1 px-2",
                filter === key
                  ? "text-fg-1 bg-fg-1/5"
                  : "text-fg-4 hover:text-fg-3",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List — clean and scannable */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="font-mono text-[10.5px] text-fg-4">No results.</p>
          </div>
        ) : (
          visible.map((expedition) => (
            <ExpeditionListRow
              key={expedition.id}
              expedition={expedition}
              isSelected={selectedId === expedition.id}
              onSelect={() => onSelect(expedition.id)}
            />
          ))
        )}
      </div>

      {/* Footer count — subtle */}
      <div className="flex-none border-t border-border px-6 py-2">
        <span className="font-mono text-[9.5px] text-fg-4">
          {visible.length} of {expeditions.length}
        </span>
      </div>
    </div>
  );
}
