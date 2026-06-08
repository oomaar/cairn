import { notFound } from "next/navigation";
import { WORLD_BY_KEY, WORLDS, type WorldKey } from "@/features/theme";
import { ModulePlaceholder } from "@/features/shell";

/** Pre-render every world/module route as static content. */
export function generateStaticParams() {
  return WORLDS.flatMap((world) =>
    world.modules.map((m) => ({ world: world.key, module: m.key })),
  );
}

/** A module workspace. Placeholder for now — validates the world+module and
 *  renders the world-scoped placeholder body. */
export default async function ModulePage({
  params,
}: PageProps<"/[world]/[module]">) {
  const { world: worldParam, module: moduleParam } = await params;
  const world = WORLD_BY_KEY[worldParam as WorldKey];
  const mod = world?.modules.find((m) => m.key === moduleParam);
  if (!world || !mod) notFound();

  return <ModulePlaceholder world={world} moduleLabel={mod.label} />;
}
