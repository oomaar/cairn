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
    rotate: "rotate-1",
  },
  checkin: {
    stamp: "CLEARED",
    classes: "border-ok/40 text-ok",
    rotate: "-rotate-1",
  },
  incident: {
    stamp: "ACTION",
    classes: "border-danger/40 text-danger",
    rotate: "rotate-1",
  },
  weather: {
    stamp: "STANDING",
    classes: "border-warn/40 text-warn",
    rotate: "-rotate-1",
  },
  comms: {
    stamp: "LOGGED",
    classes: "border-border text-fg-3",
    rotate: "rotate-1",
  },
  note: {
    stamp: "LOGGED",
    classes: "border-border text-fg-3",
    rotate: "-rotate-1",
  },
};
