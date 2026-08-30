"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Warning, ArrowRight, Sparkle } from "@phosphor-icons/react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatusChip } from "@/components/ui/status-chip";
import { Waveform } from "@/components/waveform/waveform";
import { RouteClusterCard } from "@/components/routes/route-cluster-card";
import { TransactionDrawer } from "@/components/transactions/transaction-drawer";
import { SimulatorControls } from "@/components/dashboard/simulator-controls";
import { CopilotWidget } from "@/components/dashboard/copilot-widget";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { Transaction, TransactionFilter } from "@/types";

interface DashboardClientProps {
  userId: string;
  hasWebhookSecret: boolean;
  transactions: Transaction[];
  clusters: Awaited<ReturnType<typeof import("@/lib/data").getRouteClusters>>;
  stats: Awaited<ReturnType<typeof import("@/lib/data").getDashboardStats>>;
}

export function DashboardClient({
  userId,
  hasWebhookSecret,
  transactions,
  clusters,
  stats,
}: DashboardClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async (scenario: { count: number; injectCluster: boolean }) => {
    setIsSimulating(true);
    try {
      await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const filtered =
    filter === "all" ? transactions : transactions.filter((t) => t.status === filter);

  const filterOptions: { value: TransactionFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "declined", label: "Declined" },
    { value: "recovering", label: "Recovering" },
    { value: "recovered", label: "Recovered" },
    { value: "escalated", label: "Escalated" },
  ];

  return (
    <>
      {/* Sticky header */}
      <header className="app-header sticky top-0 z-20 min-h-16 px-5 py-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-body-s uppercase tracking-wide text-text-tertiary">Live recovery cockpit</p>
          <h1 className="font-display text-display-m text-text-primary">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-mono-l text-ember-500 tabular-nums">
            {formatCurrency(stats.tickerAmount)}
          </span>
          <span className="px-2 py-0.5 rounded-chip bg-pulse-wash font-mono text-mono-s text-pulse-700">
            {stats.tickerDelta}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-pulse-500 animate-pulse" />
        </div>
      </header>

      <div className="p-5 sm:p-6">
        {/* Onboarding Banner Nudge */}
        {!hasWebhookSecret && (
          <div className="mb-6 app-surface rounded-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 mt-0.5 sm:mt-0">
                <Warning className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-display-m text-text-primary">
                  Connect Razorpay to Start Recovering Payments
                </h3>
                <p className="text-body-m text-text-secondary mt-1">
                  To receive and process live payment failures, complete these setup steps in order:
                </p>
                <ol className="list-decimal list-inside text-body-s text-text-tertiary mt-1.5 space-y-0.5">
                  <li>Navigate to Settings and save your <strong>Razorpay Webhook Secret</strong> first.</li>
                  <li>Copy your unique per-merchant <strong>Webhook URL</strong> from Settings and add it to your Razorpay Dashboard.</li>
                </ol>
              </div>
            </div>

            <Link
              href="/settings"
              className="px-4 py-2 bg-ember-500 hover:bg-ember-700 text-ink-950 font-medium text-body-m rounded-btn transition-colors shrink-0 flex items-center gap-2"
            >
              <span>Go to Settings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <SimulatorControls onSimulate={handleSimulate} isLoading={isSimulating} />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6">
          {/* Pulse Ledger */}
          <div className="relative">
            {/* Ambient glow — only place besides reports */}
            <div
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(53,208,166,0.07) 0%, transparent 70%)",
              }}
            />

            <div className="app-surface rounded-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-body-s uppercase tracking-wide text-text-tertiary">Revenue stream</p>
                  <h2 className="font-display text-display-m text-text-primary">Pulse Ledger</h2>
                </div>
                <SegmentedControl options={filterOptions} value={filter} onChange={setFilter} />
              </div>

              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-display text-display-m text-text-primary">
                    {!hasWebhookSecret ? "Razorpay Not Connected Yet" : "No failures yet — good sign"}
                  </p>
                  <p className="mt-2 text-body-m text-text-secondary max-w-md mx-auto">
                    {!hasWebhookSecret
                      ? "Connect your Razorpay account in Settings to start tracking and recovering failed payments."
                      : "Declines and recoveries will appear here in real time."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border max-h-[calc(100vh-220px)] overflow-y-auto">
                  {filtered.map((txn, i) => (
                    <motion.button
                      key={txn.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setSelectedTxn(txn)}
                      className="w-full flex items-center gap-4 px-5 h-16 hover:bg-white/[.055] transition-colors duration-150 text-left"
                    >
                      <Waveform
                        status={txn.status}
                        width={120}
                        height={32}
                        animate={txn.status === "recovered"}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-body-m text-text-primary truncate">{txn.merchant_name}</p>
                        <p className="text-body-m text-text-tertiary truncate">
                          {txn.method} · {txn.issuer}
                        </p>
                      </div>
                      <div className="text-right shrink-0 w-40">
                        <p className="font-mono text-mono-l text-ember-500 tabular-nums">
                          {formatCurrency(txn.amount)}
                        </p>
                        <StatusChip status={txn.status} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Route Intelligence rail */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-display-m text-text-primary">Route Intelligence</h2>
              <Link
                href="/routes"
                className="inline-flex items-center gap-1 text-body-m text-pulse-500 hover:text-text-primary transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="app-surface rounded-card p-4">
              <div className="flex items-center gap-2 text-pulse-500">
                <Sparkle size={16} weight="fill" />
                <p className="text-body-s uppercase tracking-wide">Autopilot readout</p>
              </div>
              <p className="mt-3 text-body-m text-text-secondary">
                Undrop is monitoring issuer drift and ranking recoverable failures before customer outreach.
              </p>
            </div>
            {clusters.slice(0, 3).map((cluster) => (
              <RouteClusterCard key={cluster.id} cluster={cluster} compact />
            ))}
          </div>
        </div>
      </div>

      <TransactionDrawer
        transaction={selectedTxn}
        open={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />
      <CopilotWidget />
    </>
  );
}
