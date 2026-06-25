import type { LogEntry } from "@/universe";

export interface EnrichedLogEntry extends LogEntry {
  expeditionName: string;
  colorIndex: number;
  authorShortName: string | null;
}
