import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Button grammar (mirrors the wireframe `.btn`). `buttonVariants` is exported
 * so links can wear the same styling: `<Link className={buttonVariants()} />`.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors duration-150 ease-standard outline-none focus-visible:ring-2 focus-visible:ring-accent-line disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-accent text-fg-on-accent hover:bg-accent-bright",
        secondary: "border border-border-strong text-fg-1 hover:bg-raised",
        ghost: "text-fg-2 hover:bg-raised hover:text-fg-1",
        danger: "bg-danger text-white hover:bg-danger-bright",
      },
      size: {
        sm: "h-8 px-3 text-2xs",
        md: "h-10 px-4.5 text-sm",
        lg: "h-12 px-6 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  variant,
  size,
  className,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );
}
