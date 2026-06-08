"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, Text } from "@/components/ui";
import { CommandItem } from "./command-item";
import { useCommandPalette } from "./palette-context";
import { useCommands } from "./use-commands";
import type { Command } from "./command.types";

/**
 * The palette dialog. Mounted fresh each time the palette opens, so its query
 * and selection start clean without reset effects.
 */
function PaletteDialog({ onClose }: { onClose: () => void }) {
  const commands = useCommands();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  const run = (command?: Command) => {
    if (!command) return;
    command.perform();
    onClose();
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    setActive(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // Group for display while tracking each command's flat index for navigation.
  const groups: {
    name: string;
    items: { command: Command; index: number }[];
  }[] = [];
  results.forEach((command, index) => {
    const group = groups.find((g) => g.name === command.group);
    const entry = { command, index };
    if (group) group.items.push(entry);
    else groups.push({ name: command.group, items: [entry] });
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <button
        type="button"
        aria-label="Close command palette"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-4 mt-[14vh] w-full max-w-xl overflow-hidden rounded-xl border border-border bg-elev shadow-lg">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Icon name="search" size={18} className="text-fg-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search worlds, expeditions, actions…"
            aria-label="Command"
            aria-activedescendant={results[active]?.id}
            className="h-12 flex-1 bg-transparent text-md text-fg-1 outline-none placeholder:text-fg-4"
          />
          <kbd className="font-mono text-2xs text-fg-4">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Text variant="body-sm" tone="tertiary">
                No matches for “{query}”.
              </Text>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.name} className="px-2 pb-1">
                <div className="px-2 pt-2 pb-1">
                  <Text variant="eyebrow" as="span">
                    {group.name}
                  </Text>
                </div>
                {group.items.map(({ command, index }) => (
                  <CommandItem
                    key={command.id}
                    command={command}
                    active={index === active}
                    onRun={run}
                    onHover={() => setActive(index)}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-2xs text-fg-4">
          <span className="flex items-center gap-1.5">
            <kbd className="font-mono">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="font-mono">↵</kbd> select
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <kbd className="font-mono">⌘K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * The command palette — a keyboard-first overlay (⌘K) to jump across worlds,
 * workspaces and expeditions, switch role, and run capability-gated actions.
 * Always mounted at the shell root; renders the dialog only when open.
 */
export function CommandPalette() {
  const { open, closePalette } = useCommandPalette();
  if (!open) return null;
  return <PaletteDialog onClose={closePalette} />;
}
