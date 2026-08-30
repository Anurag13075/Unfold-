"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex p-1 bg-white/[.045] rounded-btn border border-border shadow-[inset_0_1px_0_rgba(255,255,255,.04)]",
        className
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 text-body-s font-medium rounded-[6px] transition-colors duration-150",
            value === opt.value
              ? "bg-pulse-500 text-ink-950"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
