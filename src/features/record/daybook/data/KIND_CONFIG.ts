import type { LogKind } from "@/universe";

interface KindConfig {
  stamp: string;
  classes: string;
  rotate: string;
}

export const KIND_CONFIG: Record<LogKind, KindConfig> = {
  movement: {
    stamp: "MOVING",
    classes: "border-border text-fg-3",
    rotate: "-rotate-2",
  },
  checkin: {
    stamp: "CLEARED",
    classes: "border-ok/40 text-ok",
    rotate: "rotate-3",
  },
  incident: {
    stamp: "ACTION",
    classes: "border-danger/40 text-danger",
    rotate: "-rotate-3",
  },
  weather: {
    stamp: "STANDING",
    classes: "border-warn/40 text-warn",
    rotate: "rotate-2",
  },
  comms: {
    stamp: "LOGGED",
    classes: "border-border text-fg-3",
    rotate: "-rotate-2",
  },
  note: {
    stamp: "LOGGED",
    classes: "border-border text-fg-3",
    rotate: "rotate-3",
  },
};
