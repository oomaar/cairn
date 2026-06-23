import type { Announcement, CommMessage } from "./comms.types";
import type { Debrief } from "./debrief.types";
import type { Assignment, Expedition, Operator } from "./expedition.types";
import type { GearAllocation, GearItem } from "./gear.types";
import type { Incident } from "./incident.types";
import type { LogEntry } from "./log.types";
import type { Person } from "./person.types";
import type { Risk } from "./risk.types";
import type { Checkpoint, Route } from "./route.types";
import type { WeatherAlert } from "./weather.types";

/**
 * The complete relational universe — every table the simulated backend holds.
 * Entities reference one another by id; the query layer resolves the graph.
 */
export interface Universe {
  operator: Operator;
  people: Person[];
  expeditions: Expedition[];
  routes: Route[];
  checkpoints: Checkpoint[];
  assignments: Assignment[];
  gear: GearItem[];
  gearAllocations: GearAllocation[];
  weather: WeatherAlert[];
  risks: Risk[];
  incidents: Incident[];
  debriefs: Debrief[];
  comms: CommMessage[];
  announcements: Announcement[];
  logs: LogEntry[];
}
