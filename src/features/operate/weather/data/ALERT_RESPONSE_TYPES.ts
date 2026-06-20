export const ALERT_RESPONSE_TYPES = {
  delay: {
    label: "Delay",
    icon: "clock",
    description: "Delay expedition departure or progress",
  },
  reroute: {
    label: "Reroute",
    icon: "map",
    description: "Divert to alternative route or checkpoint",
  },
  camp: {
    label: "Camp",
    icon: "tent",
    description: "Establish camp and wait for conditions",
  },
  accelerate: {
    label: "Accelerate",
    icon: "zap",
    description: "Increase pace to avoid weather window",
  },
  monitor: {
    label: "Monitor",
    icon: "eye",
    description: "Observe conditions and reassess",
  },
} as const;
