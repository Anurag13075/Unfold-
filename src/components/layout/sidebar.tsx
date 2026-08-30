"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  CaretLeft,
  Gear,
  Pulse,
  SignOut,
  TreeStructure,
} from "@phosphor-icons/react";
import { Wordmark, Logomark } from "@/components/brand/wordmark";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Pulse },
  { href: "/routes", label: "Route Intelligence", icon: TreeStructure },
  { href: "/reports", label: "Reports", icon: ChartBar },
  { href: "/settings", label: "Settings", icon: Gear },
];

interface SidebarProps {
  workspaceName?: string;
  userName?: string;
  userImage?: string | null;
}

export function Sidebar({ workspaceName = "My Workspace", userName, userImage }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-border bg-ink-950/70 backdrop-blur-2xl transition-all duration-300",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link href="/dashboard" className="text-text-primary">
            {collapsed ? (
              <Logomark className="w-8 h-8" />
            ) : (
              <Wordmark className="h-6 w-auto" />
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="grid h-8 w-8 place-items-center rounded-btn border border-border text-text-tertiary transition hover:border-border-strong hover:bg-white/[.06] hover:text-text-primary"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <CaretLeft size={15} className={cn("transition", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 h-10 px-3 rounded-btn text-body-m transition-colors duration-150",
                  active
                    ? "bg-pulse-500 text-ink-950 shadow-[0_0_28px_rgba(184,255,102,.18)]"
                    : "text-text-secondary hover:bg-white/[.06] hover:text-text-primary"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-ink-950/70 rounded-r" />
                )}
                <Icon size={20} weight="thin" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          {!collapsed && (
            <p className="px-3 mb-2 text-body-s uppercase tracking-wide text-text-tertiary truncate">
              {workspaceName}
            </p>
          )}
          <div className="flex items-center gap-3 px-3 py-2 rounded-card border border-border bg-white/[.035]">
            <div className="w-8 h-8 rounded-btn bg-white/[.07] flex items-center justify-center overflow-hidden shrink-0">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-body-s text-text-secondary">
                  {userName?.[0]?.toUpperCase() ?? "U"}
                </span>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-body-m text-text-primary truncate">{userName ?? "User"}</p>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-text-tertiary hover:text-flatline-500 transition-colors"
              aria-label="Sign out"
            >
              <SignOut size={18} weight="thin" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-ink-950/85 backdrop-blur-2xl">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1",
                  active ? "text-pulse-500" : "text-text-tertiary"
                )}
              >
                <Icon size={20} weight="thin" />
                <span className="text-[10px]">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
