import { Icon } from "@/components/ui";

interface StepButtonProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
  icon: "plus" | "minus";
}

export function StepButton({
  label,
  onClick,
  disabled,
  icon,
}: StepButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-5 flex-none place-items-center rounded border border-border text-fg-3 transition-colors hover:text-fg-1 disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon name={icon} size={11} />
    </button>
  );
}
