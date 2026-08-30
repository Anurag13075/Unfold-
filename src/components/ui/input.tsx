"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  secret?: boolean;
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helper, secret, mono, type, ...props }, ref) => {
    const [revealed, setRevealed] = useState(false);
    const inputType = secret ? (revealed ? "text" : "password") : type;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-body-s font-medium uppercase tracking-wide text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full h-10 px-3 bg-white/[.045] border border-border rounded-btn text-text-primary placeholder:text-text-tertiary shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition-all duration-150 focus:outline-none focus:border-pulse-500 focus:bg-white/[.07]",
              mono && "font-mono text-mono-s tabular-nums",
              secret && "pr-10",
              className
            )}
            {...props}
          />
          {secret && (
            <button
              type="button"
              onClick={() => setRevealed(!revealed)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label={revealed ? "Hide" : "Reveal"}
            >
              {revealed ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {helper && <p className="text-body-m text-text-tertiary">{helper}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
