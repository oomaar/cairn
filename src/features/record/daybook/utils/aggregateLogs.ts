import { listExpeditions, getLogbook, getPerson } from "@/universe";
import type { EnrichedLogEntry } from "../types/daybook.types";

export function aggregateLogs(allowedIds?: string[]): EnrichedLogEntry[] {
  const expeditions = listExpeditions().filter(
    (e) =>
      (e.status === "in-field" || e.status === "complete") &&
      (!allowedIds || allowedIds.includes(e.id)),
  );

  const entries: EnrichedLogEntry[] = [];

  expeditions.forEach((expedition, index) => {
    const logs = getLogbook(expedition.id);
    logs.forEach((entry) => {
      const author = entry.authorId ? getPerson(entry.authorId) : undefined;
      const authorShortName = author
        ? (() => {
            const parts = author.name.split(" ");
            return parts.length > 1
              ? `${parts[0]![0]}. ${parts.slice(1).join(" ")}`
              : author.name;
          })()
        : null;
      entries.push({
        ...entry,
        expeditionName: expedition.name,
        colorIndex: index % 4,
        authorShortName,
      });
    });
  });

  return entries.sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.time.localeCompare(b.time);
  });
}
