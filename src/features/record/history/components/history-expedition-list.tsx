"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Expedition } from "@/universe";
import { ExpeditionListRow } from "./expedition-list-row";
import { FILTERS, type Filter } from "../data/FILTERS";

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
    <div className="flex min-h-0 flex-col border-r-2 border-fg-2">
      {/* Search */}
      <div className="flex-none border-b border-border px-5 py-2.5 sm:px-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expeditions…"
          className="w-full bg-transparent font-mono text-2xs text-fg-1 placeholder:text-fg-4 focus:outline-none"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-none gap-0 border-b border-border">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "flex-1 py-2 font-mono text-3xs uppercase tracking-[0.08em] transition-colors",
              filter === key
                ? "border-b-2 border-(--record-margin) text-fg-1"
                : "text-fg-4 hover:text-fg-2",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
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

      {/* Footer count */}
      <div className="flex-none border-t border-border px-5 py-2 sm:px-6">
        <span className="font-mono text-2xs text-fg-4">
          {visible.length} of {expeditions.length} expeditions
        </span>
      </div>
    </div>
  );
}
