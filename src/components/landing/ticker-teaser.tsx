"use client";

import { useEffect, useState } from "react";
import { formatCurrencyCompact } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TickerTeaserProps {
  targetAmount?: number;
  delta?: string;
  className?: string;
}

export function TickerTeaser({
  targetAmount = 284700,
  delta = "+12.4%",
  className,
}: TickerTeaserProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(targetAmount);
      return;
    }

    const duration = 2600;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * targetAmount));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [targetAmount]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-4 py-2 bg-surface-800 border border-border rounded-btn",
        className
      )}
    >
      <span className="text-body-s uppercase tracking-wide text-text-secondary">
        Recovered today
      </span>
      <span className="font-mono text-mono-l text-ember-500 tabular-nums">
        {formatCurrencyCompact(display)}
      </span>
      <span className="px-2 py-0.5 rounded-chip bg-pulse-wash font-mono text-mono-s text-pulse-700">
        {delta}
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-pulse-500 animate-pulse" />
    </div>
  );
}
