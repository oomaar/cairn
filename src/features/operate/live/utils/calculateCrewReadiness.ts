import type { LiveParticipant } from "../types/live-expedition.types";

export function calculateCrewReadiness(
  participants: LiveParticipant[],
): number {
  if (participants.length === 0) return 100;

  // Consider participants "ready" if healthy-ish HR (< 140) and on good pace
  const readyCount = participants.filter((p) => {
    const notExhausted = p.heartRate < 140;
    const onPace = p.pace === "on pace" || p.pace.startsWith("+");
    return notExhausted && onPace;
  }).length;

  return (readyCount / participants.length) * 100;
}
