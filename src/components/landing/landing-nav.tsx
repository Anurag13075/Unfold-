"use client";

import { useState } from "react";
import Link from "next/link";
import { CaretDown, List, X, Sun, Moon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { VercelTriangle } from "@/components/brand/vercel-triangle";
import { useLandingTheme } from "./theme-provider";

interface NavDropdownItem {
  title: string;
  description: string;
  href: string;
}

const productItems: NavDropdownItem[] = [
  { title: "Route Intelligence", description: "AI-driven real-time pathing & optimization", href: "#intelligence" },
  { title: "Pulse Ledger", description: "Immutable transactional event log & audit trail", href: "#how-it-works" },
  { title: "Capabilities Bento", description: "Complete toolset for high-scale operations", href: "#capabilities" },
];

const resourceItems: NavDropdownItem[] = [
  { title: "Documentation", description: "API references, guides, and SDKs", href: "#faq" },
  { title: "Case Studies", description: "How industry leaders scale with Undrop", href: "#proof" },
  { title: "FAQ", description: "Frequently asked questions & support", href: "#faq" },
];

export function LandingNav() {
  const { theme, toggleTheme } = useLandingTheme();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/10 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left Side: Vercel Triangle Logo + Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <VercelTriangle size={24} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("products")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                aria-expanded={activeMenu === "products"}
              >
                Products
                <CaretDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === "products" ? "rotate-180 text-white" : "text-neutral-400"
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeMenu === "products" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-80 p-2 rounded-xl bg-neutral-950/95 border border-white/10 backdrop-blur-xl shadow-2xl z-50"
                  >
                    <div className="flex flex-col gap-1">
                      {productItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="group p-2.5 rounded-lg hover:bg-white/10 transition-colors block"
                        >
                          <div className="text-sm font-medium text-white group-hover:text-white">
                            {item.title}
                          </div>
                          <div className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("resources")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                aria-expanded={activeMenu === "resources"}
              >
                Resources
                <CaretDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === "resources" ? "rotate-180 text-white" : "text-neutral-400"
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeMenu === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-72 p-2 rounded-xl bg-neutral-950/95 border border-white/10 backdrop-blur-xl shadow-2xl z-50"
                  >
                    <div className="flex flex-col gap-1">
                      {resourceItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="group p-2.5 rounded-lg hover:bg-white/10 transition-colors block"
                        >
                          <div className="text-sm font-medium text-white group-hover:text-white">
                            {item.title}
                          </div>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enterprise Link */}
            <Link
              href="#capabilities"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Enterprise
            </Link>

            {/* Pricing Link */}
            <Link
              href="#faq"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right Side Actions: Get a Demo, Log In, Sign Up, Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#demo"
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-500 transition-all shadow-sm"
          >
            Get a Demo
          </Link>

          <Link
            href="/sign-in"
            className="px-3 py-1.5 rounded-md text-xs font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Log In
          </Link>

          <Link
            href="/sign-up"
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-black bg-white hover:bg-neutral-200 transition-colors shadow-sm font-semibold"
          >
            Sign Up
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
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
            className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-2xl overflow-hidden px-4 pt-4 pb-6 space-y-4"
          >
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Products
              </div>
              {productItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="space-y-1 border-t border-white/10 pt-3">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Navigation
              </div>
              <Link
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Enterprise
              </Link>
              <Link
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Pricing
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-md text-sm font-medium text-neutral-200 bg-neutral-900 border border-neutral-700"
              >
                Get a Demo
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-md text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800/50"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-md text-sm font-medium text-black bg-white hover:bg-neutral-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
