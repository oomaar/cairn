import { listExpeditions, getLogbook, getPerson } from "@/universe";
import type { EnrichedLogEntry } from "../types/daybook.types";

export function aggregateLogs(): EnrichedLogEntry[] {
  const expeditions = listExpeditions().filter(
    (e) => e.status === "in-field" || e.status === "complete",
  );

  const entries: EnrichedLogEntry[] = [];

  expeditions.forEach((expedition, index) => {
    const logs = getLogbook(expedition.id);
    logs.forEach((entry) => {
      const author = entry.authorId ? getPerson(entry.authorId) : undefined;
      entries.push({
        ...entry,
        expeditionName: expedition.name,
        colorIndex: index % 4,
        authorInitials: author?.initials ?? null,
      });
    });
  });

  return entries.sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.time.localeCompare(b.time);
  });
}
