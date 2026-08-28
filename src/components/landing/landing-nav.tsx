"use client";

import Link from "next/link";
import { Moon, Sun } from "@phosphor-icons/react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { useLandingTheme } from "./theme-provider";

export function LandingNav() {
  const { theme, toggleTheme } = useLandingTheme();

  return (
    <header className="sticky top-0 z-30 bg-ink-950/90 border-b border-border">
      <div className="max-w-container mx-auto px-4 md:px-8 h-16 flex items-center justify-between relative z-10">
        <Link href="/" className="text-text-primary">
          <Wordmark className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-btn text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200 focus-ring"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={20} weight="thin" /> : <Moon size={20} weight="thin" />}
          </button>
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
