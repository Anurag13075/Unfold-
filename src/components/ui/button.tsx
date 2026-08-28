"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-body text-body-s font-medium transition-all duration-[120ms] focus-ring disabled:opacity-30 disabled:pointer-events-none",
          size === "default" && "h-10 px-4 rounded-btn",
          size === "sm" && "h-8 px-3 rounded-btn text-[12px]",
          variant === "primary" &&
            "bg-ember-500 text-ink-950 hover:brightness-[1.06] active:scale-[0.98] active:duration-[80ms]",
          variant === "secondary" &&
            "bg-transparent border border-border text-text-primary hover:bg-surface-700 hover:border-border-strong",
          variant === "ghost" &&
            "bg-transparent border border-border text-text-primary hover:bg-surface-700 hover:border-border-strong",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
