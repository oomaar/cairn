import type { LiveParticipant } from "../types/live-expedition.types";

export function createMockParticipant(
  index: number,
  name: string,
  initials: string,
  role: "field-leader" | "assistant-lead" | "participant",
): LiveParticipant {
  const paces = ["on pace", "+5%", "-10%", "+3%", "sweep"];
  const positions = ["lead", "12m back", "mid-group", "20m back", "rear"];
  const paceIdx = index % paces.length;
  const posIdx = index % positions.length;

  return {
    id: `participant-${index}`,
    name,
    initials,
    role,
    tone: index === 0 ? "accent" : ["sage", "stone", "clay"][index % 3]!,
    heartRate: 90 + Math.floor(Math.random() * 40),
    pace: paces[paceIdx]!,
    relativePosition: positions[posIdx]!,
    battery: 70 + Math.floor(Math.random() * 25),
    flag: index === 3 ? "ankle" : undefined,
  };
}
