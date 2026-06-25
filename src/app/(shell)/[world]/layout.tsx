import { notFound } from "next/navigation";
import { WORLD_BY_KEY, type WorldKey } from "@/features/theme";
import { WorldFrame } from "@/features/shell";
import { RecordMasthead } from "@/features/record";

/** Validates the world segment and frames its routed modules in the world's
 *  own visual language. */
export default async function WorldLayout({
  children,
  params,
}: LayoutProps<"/[world]">) {
  const { world: worldParam } = await params;
  const world = WORLD_BY_KEY[worldParam as WorldKey];
  if (!world) notFound();

  return (
    <WorldFrame
      world={world}
      headerSlot={world.key === "record" ? <RecordMasthead /> : undefined}
    >
      {children}
    </WorldFrame>
  );
}
