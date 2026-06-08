import { SYSTEM_ID } from "../constants";
import type {
  Checkpoint,
  CommMessage,
  Expedition,
  Incident,
  LogEntry,
  WeatherAlert,
} from "../types";

/** Pull a "HH:MM" clock value out of a label like "Day 3 · 14:22". */
function timeFrom(label: string, fallback: string): string {
  const match = label.match(/\d{1,2}:\d{2}/);
  return match ? match[0] : fallback;
}

function truncate(text: string, max = 96): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

interface LogSources {
  expeditions: readonly Expedition[];
  checkpoints: readonly Checkpoint[];
  incidents: readonly Incident[];
  weather: readonly WeatherAlert[];
  comms: readonly CommMessage[];
}

/**
 * Generate the daybook for every expedition that has a field record (in-field
 * or complete), woven from its movement, weather, incidents and comms. Each
 * entry links back to its source via refId, so the Record world reflects what
 * actually happened elsewhere in the universe.
 */
export function generateLogs(sources: LogSources): LogEntry[] {
  const { expeditions, checkpoints, incidents, weather, comms } = sources;
  const logs: LogEntry[] = [];

  for (const expedition of expeditions) {
    if (expedition.status !== "in-field" && expedition.status !== "complete") {
      continue;
    }

    const day = expedition.dayCurrent || expedition.dayTotal;
    let seq = 0;
    const id = () => `log-${expedition.id}-${++seq}`;

    // Movement from checkpoints reached so far.
    for (const cp of checkpoints.filter(
      (c) => c.routeId === expedition.routeId,
    )) {
      if (cp.status === "ahead") continue;
      logs.push({
        id: id(),
        expeditionId: expedition.id,
        day,
        time: cp.eta,
        kind: cp.status === "current" ? "movement" : "checkin",
        title:
          cp.status === "current"
            ? `Holding at ${cp.name}`
            : `Cleared ${cp.name}`,
        detail:
          cp.status === "current"
            ? `Party at ${cp.name} (${cp.km} km · ${cp.elevationM} m).`
            : `Checkpoint cleared at ${cp.km} km, ${cp.elevationM} m.`,
        authorId: expedition.leaderId,
        refId: cp.id,
      });
    }

    for (const wx of weather.filter((w) => w.expeditionId === expedition.id)) {
      logs.push({
        id: id(),
        expeditionId: expedition.id,
        day,
        time: "—",
        kind: "weather",
        title: wx.title,
        detail: `${wx.place} — ${wx.detail}`,
        authorId: SYSTEM_ID,
        refId: wx.id,
      });
    }

    for (const inc of incidents.filter(
      (i) => i.expeditionId === expedition.id,
    )) {
      logs.push({
        id: id(),
        expeditionId: expedition.id,
        day,
        time: timeFrom(inc.timeLabel, "—"),
        kind: "incident",
        title: inc.title,
        detail: `${inc.status} — ${inc.detail}`,
        authorId: expedition.leaderId,
        refId: inc.id,
      });
    }

    for (const comm of comms.filter((c) => c.expeditionId === expedition.id)) {
      logs.push({
        id: id(),
        expeditionId: expedition.id,
        day,
        time: comm.time,
        kind: "comms",
        title: truncate(comm.text),
        detail: comm.text,
        authorId: comm.fromPersonId,
        refId: comm.id,
      });
    }
  }

  return logs;
}
