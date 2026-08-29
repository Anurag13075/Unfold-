"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X, Sun, Moon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowingLogo } from "@/components/brand/glowing-logo";
import { useLandingTheme } from "./theme-provider";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "FAQ", href: "#faq" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Route Intelligence", href: "/routes" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

export function LandingNav() {
  const { theme, toggleTheme } = useLandingTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--ink-950)]/85 backdrop-blur-md border-b border-[var(--border-default)] text-[var(--text-primary)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left Side: Logo + Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <GlowingLogo size={28} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-700)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions: Log In, Sign Up, Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-700)] transition-colors"
          >
            Log In
          </Link>

          <Link
            href="/sign-up"
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-[var(--ink-950)] bg-[var(--text-primary)] hover:opacity-90 transition-all shadow-sm"
          >
            Sign Up
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-700)] transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-700)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-700)] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--border-default)] bg-[var(--ink-950)]/95 backdrop-blur-2xl overflow-hidden px-4 pt-4 pb-6 space-y-4"
          >
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Navigation
              </div>
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-700)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border-default)] grid grid-cols-2 gap-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-800)] hover:bg-[var(--surface-700)] border border-[var(--border-default)] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-md text-sm font-semibold text-[var(--ink-950)] bg-[var(--text-primary)] hover:opacity-90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
