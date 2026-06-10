import type { Tone } from "@/universe";
import type { AvatarTone } from "../types/AvatarTone";

export const avatarTone = (tone?: Tone): AvatarTone =>
  tone === "amber"
    ? "amber"
    : tone === "slate"
      ? "slate"
      : tone === "olive"
        ? "olive"
        : "quiet";
