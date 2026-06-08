import type { IconName } from "@/components/ui";

/** A single runnable entry in the command palette. */
export interface Command {
  id: string;
  label: string;
  /** Section the command is shown under. */
  group: string;
  /** Secondary line (context, status). */
  hint?: string;
  icon?: IconName;
  /** Extra terms folded into search matching. */
  keywords?: string;
  /** What the command does when selected. */
  perform: () => void;
}
