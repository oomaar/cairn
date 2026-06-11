import type { CheckpointType } from "@/universe";

export function defaultNote(type: CheckpointType): string {
  switch (type) {
    case "pass":
      return "Exposed col — commit only inside the weather window.";
    case "crossing":
      return "Watercourse crossing — check flow before committing the party.";
    case "camp":
      return "Established camp — water and shelter on site.";
    case "viewpoint":
      return "Viewpoint — brief photo stop, no shelter.";
    case "summit":
      return "Summit — turnaround time is non-negotiable.";
    default:
      return "Open station on the plotted line.";
  }
}
