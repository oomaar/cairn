import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** Avatar — initials chip. Tone keys to the accent families. */
const avatarVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-border font-bold leading-none shrink-0",
  {
    variants: {
      tone: {
        amber: "bg-amber-tint text-amber-bright",
        olive: "bg-olive-tint text-olive-bright",
        slate: "bg-slate-tint text-slate-bright",
        quiet: "bg-raised text-fg-2",
      },
      size: {
        sm: "size-7 text-2xs",
        md: "size-8 text-xs",
        lg: "size-10 text-sm",
      },
    },
    defaultVariants: {
      tone: "quiet",
      size: "md",
    },
  },
);

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  initials: string;
  className?: string;
}

export function Avatar({ initials, tone, size, className }: AvatarProps) {
  return (
    <span className={cn(avatarVariants({ tone, size }), className)}>{initials}</span>
  );
}
