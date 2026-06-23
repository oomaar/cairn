import {
  getComms,
  listAnnouncements,
  listExpeditions,
  listRisks,
} from "@/universe";
import type { AlertItem } from "../types/AlertItem";

export function buildAlerts(): AlertItem[] {
  const items: AlertItem[] = [];

  // Org-wide + expedition announcements
  for (const ann of listAnnouncements()) {
    items.push({
      id: ann.id,
      icon: "bell",
      tone: ann.tone,
      title: ann.title,
      context: ann.audience,
      time: ann.timeAgo,
      body: ann.body,
    });
  }

  // High-level risks as alerts
  for (const risk of listRisks()) {
    if (risk.level !== "high") continue;
    const sub =
      risk.expeditionId !== null ? risk.expeditionId.toUpperCase() : "ORG";
    items.push({
      id: `risk-${risk.id}`,
      icon: "alert",
      tone: risk.tone,
      title: risk.title,
      context: `${risk.category} · ${sub}`,
      time: `UPD ${risk.updatedAgo}`,
      body: risk.action,
    });
  }

  // System comms alerts from all in-field expeditions
  const expeditions = listExpeditions().filter((e) => e.status === "in-field");
  for (const exp of expeditions) {
    for (const msg of getComms(exp.id)) {
      if (msg.kind !== "alert") continue;
      items.push({
        id: msg.id,
        icon: "radio",
        tone: "warn",
        title: msg.text,
        context: exp.id.toUpperCase(),
        time: msg.time,
      });
    }
  }

  return items;
}
