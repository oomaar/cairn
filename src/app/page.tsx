import { redirect } from "next/navigation";
import { DEFAULT_WORLD, WORLD_BY_KEY } from "@/features/theme";

/** Entry point — send people into the default world's default workspace. */
export default function RootPage() {
  const world = WORLD_BY_KEY[DEFAULT_WORLD];
  redirect(`/${world.key}/${world.defaultModule}`);
}
