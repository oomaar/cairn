"use client";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { deriveFlags } from "../utils/deriveFlags";
import { TONE_CLASSES } from "../data/TONE_CLASSES";

export function CommandAnnunciator() {
  const flags = deriveFlags();

  return (
    <div className="rounded-lg border border-border p-4">
      <Text
        variant="caption"
        tone="tertiary"
        className="mb-3 block font-mono tracking-widest text-2xs uppercase"
      >
        Annunciator
      </Text>
      <div className="grid grid-cols-2 gap-2">
        {flags.map((flag) => {
          const classes = TONE_CLASSES[flag.active ? flag.tone : "idle"];
          return (
            <div
              key={flag.label}
              className={cn(
                "rounded border px-2 py-2.5 text-center transition-all",
                flag.active
                  ? `${classes.border} ${classes.bg}`
                  : "border-border bg-transparent opacity-40",
              )}
            >
              <Text
                className={cn(
                  "block font-mono text-2xs font-bold tracking-wider",
                  flag.active ? classes.text : "text-fg-4",
                )}
              >
                {flag.label}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
