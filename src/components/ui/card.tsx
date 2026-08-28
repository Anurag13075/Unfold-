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
        "bg-surface-800 border border-border rounded-card p-5",
        interactive &&
          "transition-colors duration-150 hover:bg-surface-700 hover:border-border-strong cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
