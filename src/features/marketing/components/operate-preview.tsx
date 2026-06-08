import { Avatar, Icon, Text } from "@/components/ui";
import { WORLD_BY_KEY } from "@/features/theme";
import { getRoster, getWeather } from "@/universe";
import { PreviewFrame } from "./preview-frame";

const LiveStatus = () => (
  <span className="flex items-center gap-1.5 font-mono text-3xs uppercase tracking-widest text-ok">
    <span className="size-1.5 rounded-full bg-ok animate-pulse-live" />
    Live
  </span>
);

/** Operate preview — live command view: weather on the pass + party telemetry. */
export function OperatePreview() {
  const weather = getWeather("tdp")[0];
  const roster = getRoster("tdp")
    .filter((entry) => entry.assignment.telemetry)
    .slice(0, 4);

  return (
    <PreviewFrame
      world={WORLD_BY_KEY.operate}
      title="Operate · Command"
      status={<LiveStatus />}
    >
      {weather && (
        <div className="flex items-start gap-2.5 rounded-md border border-danger-line bg-danger-tint p-2.5">
          <Icon name="wind" size={16} className="mt-px text-danger-bright" />
          <div className="min-w-0">
            <Text
              variant="caption"
              as="p"
              className="font-semibold text-danger-bright"
            >
              {weather.title} · {weather.place}
            </Text>
            <Text variant="caption" as="p" tone="secondary">
              {weather.detail}
            </Text>
          </div>
        </div>
      )}

      <ul className="mt-3 flex flex-col gap-px">
        {roster.map(({ assignment, person }) => {
          const t = assignment.telemetry!;
          return (
            <li
              key={assignment.id}
              className="flex items-center gap-2.5 py-1.5"
            >
              <Avatar
                initials={person.initials}
                size="sm"
                tone={
                  person.tone === "amber"
                    ? "amber"
                    : person.tone === "slate"
                      ? "slate"
                      : "olive"
                }
              />
              <Text
                variant="caption"
                as="span"
                className="flex-1 truncate text-fg-1"
              >
                {person.name}
              </Text>
              <Text
                variant="caption"
                as="span"
                className={`font-mono ${t.flag ? "text-warn" : "text-fg-3"}`}
              >
                {t.pace}
              </Text>
              <Text
                variant="caption"
                as="span"
                tone="tertiary"
                className="w-12 text-right font-mono"
              >
                {t.heartRate} bpm
              </Text>
              <Text
                variant="caption"
                as="span"
                tone="tertiary"
                className="w-9 text-right font-mono"
              >
                {t.battery}%
              </Text>
            </li>
          );
        })}
      </ul>
    </PreviewFrame>
  );
}
