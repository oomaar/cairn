"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";
import { cn } from "@/lib/cn";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
}

export function Dropdown({
  value,
  options,
  onChange,
  disabled = false,
  className,
  menuClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-border bg-inset px-2 py-1.5 text-sm text-fg-1 outline-none transition-colors hover:border-accent-line focus-visible:border-accent-line disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <span className="truncate capitalize">
          {selectedOption?.label || "Select..."}
        </span>
        <Icon
          name="chevD"
          size={14}
          className={cn(
            "flex-none text-fg-3 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full z-10 mt-1 w-full rounded-md border border-border bg-surface shadow-lg",
            menuClassName,
          )}
        >
          <ul className="max-h-56 overflow-y-auto">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm transition-colors capitalize hover:bg-raised",
                    value === option.value && "bg-raised text-accent-bright",
                  )}
                >
                  {value === option.value && (
                    <Icon name="check" size={14} className="flex-none" />
                  )}
                  <span className="flex-1 truncate">{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
