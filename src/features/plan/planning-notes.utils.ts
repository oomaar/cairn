import { getLeader, getRoster, type Person, type Tone } from "@/universe";
import { createRng } from "@/universe/rng";
import type { PlanStation } from "./route.types";
import type { NoteTone, PlanningNote } from "./planning-notes.types";

/** Sheet-level note templates. `{cp}` is replaced with a checkpoint name when
 *  the note is anchored; templates without `{cp}` stay route-wide. */
const ANCHORED_TEMPLATES = [
  "Confirmed the {cp} approach is clear of the rockfall reported last season.",
  "Hold the {cp} ETA loose — afternoon katabatic winds routinely shut the window.",
  "Flagged {cp} for a weather alternate; the exposed line is marginal above 50 kt.",
  "Water source confirmed 0.4 km past {cp}. No need to carry the full load over.",
  "{cp} is the committal point — past here the bail-out adds a full day.",
] as const;

const SHEET_TEMPLATES = [
  "Cache the resupply two days out; double-check the fuel count before we commit the line.",
  "Crew briefing done. Everyone has the bail-out plan for the exposed section.",
  "Kept the high camp within a single push — the early sequence is tight but it holds the schedule.",
  "Permit window is firm. Build a contingency day in before we file this sheet.",
  "Comms check the relay at the col — last expedition lost the link on the descent.",
] as const;

/** Ages in display order, newest first — keeps the seeded log reading like a
 *  real planning history without any wall-clock dependency. */
const AGE_LABELS = [
  "3h ago",
  "yesterday",
  "2d ago",
  "4d ago",
  "1w ago",
] as const;

const avatarToneOf = (tone: Tone): NoteTone =>
  tone === "amber" || tone === "slate" || tone === "olive" ? tone : "quiet";

function authorsFor(expeditionId: string): Person[] {
  const leader = getLeader(expeditionId);
  const crew = getRoster(expeditionId).map((r) => r.person);
  const seen = new Set<string>();
  const all = [leader, ...crew].filter((p): p is Person => Boolean(p));
  return all.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
}

/**
 * Build the seeded planning log for a route. Deterministic from the expedition
 * id, so the same sheet always opens with the same planning history. Anchors a
 * few notes to real checkpoints (preferring the hazard) so the log threads back
 * into the chart.
 */
export function buildPlanningNotes(
  expeditionId: string,
  stations: PlanStation[],
): PlanningNote[] {
  const rng = createRng(`planning-notes:${expeditionId}`);
  const authors = authorsFor(expeditionId);
  if (authors.length === 0) return [];

  const hazard = stations.find((s) => s.hazard);
  const anchorPool = stations.filter((s) => s.type !== "trailhead");
  const count = rng.int(3, 4);

  const anchored = rng.shuffle(ANCHORED_TEMPLATES);
  const sheet = rng.shuffle(SHEET_TEMPLATES);

  return Array.from({ length: count }).map((_, i) => {
    const author = authors[i % authors.length];
    const pin =
      i === 0 ? hazard : rng.chance(0.5) ? rng.pick(anchorPool) : null;
    const template = pin
      ? anchored[i % anchored.length]
      : sheet[i % sheet.length];
    const cpName = pin?.name ?? "";
    return {
      id: `note-seed-${expeditionId}-${i}`,
      body: template.replace("{cp}", cpName),
      authorName: author.name,
      authorInitials: author.initials,
      authorTone: avatarToneOf(author.tone),
      timeLabel: AGE_LABELS[Math.min(i, AGE_LABELS.length - 1)],
      order: count - i,
      checkpointId: pin?.id ?? null,
    };
  });
}

/** A freshly-filed note authored by the current user, sorted to the top. */
export function makeNote(
  author: { name: string; initials: string; tone: Tone } | undefined,
  body: string,
  checkpointId: string | null,
  topOrder: number,
  seq: number,
): PlanningNote {
  return {
    id: `note-${seq}-${checkpointId ?? "sheet"}`,
    body,
    authorName: author?.name ?? "You",
    authorInitials: author?.initials ?? "··",
    authorTone: author ? avatarToneOf(author.tone) : "quiet",
    timeLabel: "just now",
    order: topOrder + 1,
    checkpointId,
  };
}

const firstName = (name: string) => name.split(" ")[0];
export { firstName };
