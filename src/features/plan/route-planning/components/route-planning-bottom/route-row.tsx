import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";

interface RouteRowProps {
  badge: string;
  title: string;
  subtitle: string;
  distanceKm: number;
  gainM: number;
  gainTone?: boolean;
  selected: boolean;
  onSelect?: () => void;
}
export function RouteRow({
  badge,
  title,
  subtitle,
  distanceKm,
  gainM,
  gainTone,
  selected,
  onSelect,
}: RouteRowProps) {
  const Wrapper = onSelect ? "button" : "div";
  return (
    <Wrapper
      {...(onSelect ? { type: "button" as const, onClick: onSelect } : {})}
      className={cn(
        "flex w-full items-center gap-2.5 py-2 text-left",
        onSelect && "transition-opacity hover:opacity-80",
      )}
      aria-pressed={onSelect ? selected : undefined}
    >
      <span
        className={cn(
          "grid size-5 flex-none place-items-center rounded-full border font-mono text-3xs",
          selected
            ? "border-accent text-accent-bright"
            : "border-border-strong text-fg-3",
        )}
      >
        {badge}
      </span>
      <span className="min-w-0 flex-1">
        <Text
          as="span"
          variant="caption"
          className={cn(
            "block truncate font-semibold",
            selected ? "text-fg-1" : "text-fg-2",
          )}
        >
          {title}
        </Text>
        <Text
          as="span"
          variant="caption"
          tone="tertiary"
          className="block truncate text-3xs"
        >
          {subtitle}
        </Text>
      </span>
      <span className="flex-none text-right font-mono text-2xs leading-tight">
        <span className="block text-fg-2">{distanceKm} km</span>
        <span
          className={cn("block", gainTone ? "text-(--plan-sage)" : "text-fg-3")}
        >
          ▲{gainM.toLocaleString()}
        </span>
      </span>
    </Wrapper>
  );
}
