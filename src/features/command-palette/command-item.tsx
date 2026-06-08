import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Command } from "./command.types";

interface CommandItemProps {
  command: Command;
  active: boolean;
  onRun: (command: Command) => void;
  onHover: () => void;
}

/** A single selectable row in the palette. Scrolls itself into view when it
 *  becomes the active (keyboard-highlighted) item. */
export function CommandItem({
  command,
  active,
  onRun,
  onHover,
}: CommandItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <button
      ref={ref}
      type="button"
      role="option"
      id={command.id}
      aria-selected={active}
      onClick={() => onRun(command)}
      onMouseMove={onHover}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
        active ? "bg-raised" : "hover:bg-raised/60",
      )}
    >
      {command.icon && (
        <span
          className={cn(
            "grid size-7 flex-none place-items-center rounded-md border border-border",
            active ? "text-accent-bright" : "text-fg-3",
          )}
        >
          <Icon name={command.icon} size={15} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-fg-1">
          {command.label}
        </span>
        {command.hint && (
          <span className="block truncate text-2xs text-fg-3">
            {command.hint}
          </span>
        )}
      </span>
      {active && (
        <Icon name="arrowR" size={14} className="flex-none text-fg-4" />
      )}
    </button>
  );
}
