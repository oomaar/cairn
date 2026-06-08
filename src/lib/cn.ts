import { clsx, type ClassValue } from "clsx";

/**
 * Conditionally join Tailwind class names. Thin wrapper over clsx so every
 * component has one consistent entry point for composing classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
