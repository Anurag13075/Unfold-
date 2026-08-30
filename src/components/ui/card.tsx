import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className, interactive }: CardProps) {
  return (
    <div
      className={cn(
        "app-surface rounded-card p-5",
        interactive &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-700 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
