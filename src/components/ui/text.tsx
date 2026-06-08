import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Text — the single typographic primitive.
 *
 * Encodes the type roles of the Cairn visual system (see travel/cairn.css):
 * a display/heading scale, body sizes, and the specialized eyebrow / figure /
 * mono roles. Typographic properties live in `variant`; color lives in `tone`
 * so the two compose without fighting over the same CSS property.
 *
 * Render as any element with `as`; sensible default tags per variant.
 */
const textVariants = cva("", {
  variants: {
    variant: {
      display:
        "font-display font-bold text-5xl leading-tight tracking-display",
      h1: "font-display font-bold text-3xl leading-snug tracking-heading",
      h2: "font-semibold text-2xl leading-snug tracking-heading",
      h3: "font-semibold text-xl leading-snug tracking-heading",
      title: "font-semibold text-lg leading-snug",
      body: "text-md leading-body",
      "body-sm": "text-sm leading-body",
      caption: "text-xs leading-body tracking-caption",
      eyebrow: "font-semibold text-xs uppercase tracking-eyebrow",
      figure:
        "font-display font-bold text-3xl leading-tight tracking-display tabular-nums",
      mono: "font-mono text-sm tabular-nums tracking-[0.01em]",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export type TextVariant = NonNullable<
  VariantProps<typeof textVariants>["variant"]
>;

export type TextTone =
  | "default"
  | "secondary"
  | "tertiary"
  | "meta"
  | "accent"
  | "ok"
  | "warn"
  | "danger"
  | "inherit";

/** Exactly one text-color class per tone — keeps color unambiguous. */
const TONE_CLASS: Record<TextTone, string> = {
  default: "text-fg-1",
  secondary: "text-fg-2",
  tertiary: "text-fg-3",
  meta: "text-fg-4",
  accent: "text-accent-bright",
  ok: "text-ok",
  warn: "text-warn",
  danger: "text-danger-bright",
  inherit: "text-inherit",
};

/** Tone each role reads as when the caller doesn't specify one. */
const DEFAULT_TONE: Record<TextVariant, TextTone> = {
  display: "default",
  h1: "default",
  h2: "default",
  h3: "default",
  title: "default",
  body: "default",
  "body-sm": "secondary",
  caption: "tertiary",
  eyebrow: "tertiary",
  figure: "default",
  mono: "default",
};

/** Default element each role renders as. */
const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  title: "h3",
  body: "p",
  "body-sm": "p",
  caption: "span",
  eyebrow: "p",
  figure: "span",
  mono: "span",
};

type TextOwnProps<E extends ElementType> = {
  as?: E;
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
  children?: ReactNode;
};

export type TextProps<E extends ElementType> = TextOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps<E>>;

export function Text<E extends ElementType = "p">({
  as,
  variant = "body",
  tone,
  className,
  ...rest
}: TextProps<E>) {
  const Component = (as ?? DEFAULT_TAG[variant]) as ElementType;
  const resolvedTone = tone ?? DEFAULT_TONE[variant];

  return (
    <Component
      className={cn(textVariants({ variant }), TONE_CLASS[resolvedTone], className)}
      {...rest}
    />
  );
}
