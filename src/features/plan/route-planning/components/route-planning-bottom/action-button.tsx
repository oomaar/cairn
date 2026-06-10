import { cn } from "@/lib/cn";

interface ActionButtonProps {
  onClick: () => void;
  tone: "commit" | "ghost";
  children: string;
}

export function ActionButton({ onClick, tone, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mt-2 w-full rounded-md border py-1.5 text-center font-mono text-2xs uppercase tracking-[0.06em] transition-colors",
        tone === "commit"
          ? "border-(--plan-sage) bg-olive-tint text-(--plan-sage) hover:bg-olive-tint/70"
          : "border-border-strong text-fg-2 hover:bg-raised",
      )}
    >
      {children}
    </button>
  );
}
