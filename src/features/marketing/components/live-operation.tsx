import { Text } from "@/components/ui";
import { WORLD_BY_KEY } from "@/features/theme";
import {
  getCheckpoints,
  getExpedition,
  getRoster,
  getWeather,
  type ExpeditionRole,
  type Tone,
} from "@/universe";
import { PreviewFrame } from "./preview-frame";
import {
  LiveOperationPanel,
  type AvatarTone,
  type LiveSnapshot,
} from "./live-operation-panel";

const ROLE_LABEL: Record<ExpeditionRole, string> = {
  "field-leader": "Lead",
  "assistant-lead": "Assist",
  participant: "Member",
};

const avatarTone = (tone: Tone): AvatarTone =>
  tone === "amber"
    ? "amber"
    : tone === "slate"
      ? "slate"
      : tone === "olive"
        ? "olive"
        : "quiet";

const LiveBadge = () => (
  <span className="flex items-center gap-1.5 font-mono text-3xs uppercase tracking-widest text-ok">
    <span className="size-1.5 rounded-full bg-ok animate-pulse-live" />
    Live
  </span>
);

/**
 * Live operations showcase — the headline expedition's command view, drawn
 * from the universe and animated client-side so the public site shows a real
 * operation in motion.
 */
export function LiveOperation() {
  const expedition = getExpedition("tdp");
  if (!expedition) return null;

  const weather = getWeather("tdp")[0] ?? null;
  const checkpoints = getCheckpoints("tdp");
  const current = checkpoints.find((c) => c.status === "current");
  const next = checkpoints.find((c) => c.status === "ahead");

  const members = getRoster("tdp")
    .filter((entry) => entry.assignment.telemetry)
    .slice(0, 5)
    .map(({ assignment, person }) => {
      const t = assignment.telemetry!;
      return {
        id: assignment.id,
        name: person.name,
        initials: person.initials,
        avatarTone: avatarTone(person.tone),
        roleLabel: ROLE_LABEL[assignment.role],
        pace: t.pace,
        battery: t.battery,
        heartRate: t.heartRate,
        flag: t.flag,
      };
    });

  const snapshot: LiveSnapshot = {
    expeditionName: expedition.name,
    dayCurrent: expedition.dayCurrent,
    dayTotal: expedition.dayTotal,
    weather: weather
      ? { title: weather.title, place: weather.place, detail: weather.detail }
      : null,
    members,
    positionLabel: current ? `Holding at ${current.name}` : "On route",
    nextLabel: next ? `${next.name} · ${next.eta}` : "—",
  };

  return (
    <section className="border-b border-border bg-inset">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <Text variant="eyebrow" as="p" tone="tertiary">
          Live operations
        </Text>
        <Text as="h2" variant="h1" className="mt-3 max-w-2xl">
          Watch an expedition run.
        </Text>
        <Text variant="body" tone="secondary" className="mt-4 max-w-xl">
          This is the command view for the Torres del Paine Circuit — on the
          move right now. Vitals, weather and position update as the team moves.
        </Text>

        <div className="mt-10">
          <PreviewFrame
            world={WORLD_BY_KEY.operate}
            title="Operate · Command"
            status={<LiveBadge />}
          >
            <LiveOperationPanel snapshot={snapshot} />
          </PreviewFrame>
        </div>
      </div>
    </section>
  );
}
