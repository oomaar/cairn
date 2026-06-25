import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { WORLD_BY_KEY, WORLDS, type WorldKey } from "@/features/theme";
import { ModulePlaceholder } from "@/features/shell";
import {
  PlanBuilder,
  PlanExpeditions,
  RoutePlanningWorkspace,
} from "@/features/plan";
import {
  LiveOperations,
  CommandCenter,
  RiskCenter,
  EquipmentTracking,
  WeatherAlertsCenter,
  CommunicationsCenter,
} from "@/features/operate";
import { DaybookWorkspace, HistoryWorkspace, BriefingsWorkspace, IncidentsWorkspace, MetricsWorkspace } from "@/features/record";

/** Pre-render every world/module route as static content. */
export function generateStaticParams() {
  return WORLDS.flatMap((world) =>
    world.modules.map((m) => ({ world: world.key, module: m.key })),
  );
}

/** Built workspaces, keyed by `${world}/${module}`. Anything not listed falls
 *  back to the placeholder while it's still being built out. */
const WORKSPACES: Record<string, () => ReactNode> = {
  "plan/route": () => <RoutePlanningWorkspace />,
  "plan/expeditions": () => <PlanExpeditions />,
  "plan/builder": () => <PlanBuilder />,
  "operate/live": () => <LiveOperations />,
  "operate/command": () => <CommandCenter />,
  "operate/weather": () => <WeatherAlertsCenter />,
  "operate/risk": () => <RiskCenter />,
  "operate/equipment": () => <EquipmentTracking />,
  "operate/comms": () => <CommunicationsCenter />,
  "record/daybook": () => <DaybookWorkspace />,
  "record/history": () => <HistoryWorkspace />,
  "record/briefings": () => <BriefingsWorkspace />,
  "record/incidents": () => <IncidentsWorkspace />,
  "record/metrics": () => <MetricsWorkspace />,
};

/** A module workspace. Validates the world+module, then renders the real
 *  workspace if one exists, else the world-scoped placeholder. */
export default async function ModulePage({
  params,
}: PageProps<"/[world]/[module]">) {
  const { world: worldParam, module: moduleParam } = await params;
  const world = WORLD_BY_KEY[worldParam as WorldKey];
  const mod = world?.modules.find((m) => m.key === moduleParam);
  if (!world || !mod) notFound();

  const workspace = WORKSPACES[`${world.key}/${mod.key}`];
  return workspace ? (
    workspace()
  ) : (
    <ModulePlaceholder world={world} moduleLabel={mod.label} />
  );
}
