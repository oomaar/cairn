export const STATUS_OPTIONS = [
  {
    value: "clear",
    label: "ALL CLEAR",
    description: "On schedule, no issues",
    classes: "border-ok/50 bg-ok/10 text-ok",
    activeDot: "bg-ok",
  },
  {
    value: "minor",
    label: "MINOR FLAG",
    description: "Small issue, still moving",
    classes: "border-warn/50 bg-warn/10 text-warn",
    activeDot: "bg-warn",
  },
  {
    value: "medical",
    label: "MEDICAL",
    description: "Medical attention needed",
    classes: "border-danger/50 bg-danger/10 text-danger",
    activeDot: "bg-danger",
  },
  {
    value: "emergency",
    label: "EMERGENCY",
    description: "Immediate assistance required",
    classes: "border-danger bg-danger/20 text-danger",
    activeDot: "bg-danger animate-pulse",
  },
] as const;
