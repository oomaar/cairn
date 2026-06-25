import type { LogKind } from "@/universe";

interface KindConfig {
  stamp: string;
  classes: string;
}

export const KIND_CONFIG: Record<LogKind, KindConfig> = {
  movement: { stamp: "MOVING", classes: "border-border text-fg-3" },
  checkin: { stamp: "CLEARED", classes: "border-ok/40 text-ok" },
  incident: { stamp: "ACTION", classes: "border-danger/40 text-danger" },
  weather: { stamp: "STANDING", classes: "border-warn/40 text-warn" },
  comms: { stamp: "LOGGED", classes: "border-border text-fg-3" },
  note: { stamp: "LOGGED", classes: "border-border text-fg-3" },
};
