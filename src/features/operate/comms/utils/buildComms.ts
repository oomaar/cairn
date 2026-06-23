import { getComms, getPerson, listExpeditions } from "@/universe";
import type { CommsEntry } from "../types/CommsEntry";

export function buildComms(): {
  entries: CommsEntry[];
  expeditionCodes: string[];
} {
  const expeditions = listExpeditions().filter(
    (e) => e.status === "in-field" || e.status === "planning",
  );

  const entries: CommsEntry[] = [];

  for (const exp of expeditions) {
    const code = exp.id.toUpperCase();
    for (const msg of getComms(exp.id)) {
      const person = getPerson(msg.fromPersonId);
      entries.push({
        id: msg.id,
        expeditionId: exp.id,
        expeditionCode: code,
        time: msg.time,
        kind: msg.kind,
        text: msg.text,
        senderInitials: person?.initials ?? "?",
        senderName: person?.name ?? msg.fromPersonId,
        senderTone: person?.tone ?? "slate",
      });
    }
  }

  // Org-wide comms
  for (const msg of getComms(null)) {
    const person = getPerson(msg.fromPersonId);
    entries.push({
      id: msg.id,
      expeditionId: null,
      expeditionCode: "ORG",
      time: msg.time,
      kind: msg.kind,
      text: msg.text,
      senderInitials: person?.initials ?? "?",
      senderName: person?.name ?? msg.fromPersonId,
      senderTone: person?.tone ?? "slate",
    });
  }

  const sorted = entries.sort((a, b) => b.time.localeCompare(a.time));
  const expeditionCodes = [...new Set(sorted.map((e) => e.expeditionCode))];

  return { entries: sorted, expeditionCodes };
}
