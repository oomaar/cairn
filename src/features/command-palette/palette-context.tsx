"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PaletteValue {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
  toggle: () => void;
}

const PaletteContext = createContext<PaletteValue | null>(null);

/**
 * Owns the command palette's open state and the global ⌘K / Ctrl-K hotkey, so
 * the palette can be summoned from anywhere (keyboard or the spine trigger).
 */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo<PaletteValue>(
    () => ({
      open,
      openPalette: () => setOpen(true),
      closePalette: () => setOpen(false),
      toggle: () => setOpen((prev) => !prev),
    }),
    [open],
  );

  return <PaletteContext value={value}>{children}</PaletteContext>;
}

export function useCommandPalette(): PaletteValue {
  const ctx = useContext(PaletteContext);
  if (!ctx) {
    throw new Error(
      "useCommandPalette must be used within a CommandPaletteProvider",
    );
  }
  return ctx;
}
