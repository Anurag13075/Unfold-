"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatusChip } from "@/components/ui/status-chip";
import { Waveform } from "@/components/waveform/waveform";
import { RouteClusterCard } from "@/components/routes/route-cluster-card";
import { TransactionDrawer } from "@/components/transactions/transaction-drawer";
import { formatCurrency } from "@/lib/utils";
import type { Transaction, TransactionFilter } from "@/types";

interface DashboardClientProps {
  transactions: Transaction[];
  clusters: ReturnType<typeof import("@/lib/data").getRouteClusters>;
  stats: ReturnType<typeof import("@/lib/data").getDashboardStats>;
}

export function DashboardClient({ transactions, clusters, stats }: DashboardClientProps) {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filtered =
    filter === "all" ? transactions : transactions.filter((t) => t.status === filter);

  const filterOptions: { value: TransactionFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "declined", label: "Declined" },
    { value: "recovering", label: "Recovering" },
    { value: "recovered", label: "Recovered" },
  ];

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-20 h-16 bg-ink-950 border-b border-border px-6 flex items-center justify-between">
        <h1 className="font-display text-display-m text-text-primary">Dashboard</h1>
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

      <div className="p-6">
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

            <div className="bg-surface-800 border border-border rounded-card">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-display-m text-text-primary">Pulse Ledger</h2>
                <SegmentedControl options={filterOptions} value={filter} onChange={setFilter} />
              </div>

              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-display text-display-m text-text-primary">No failures yet — good sign</p>
                  <p className="mt-2 text-body-m text-text-secondary">
                    Declines and recoveries will appear here in real time.
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
                      className="w-full flex items-center gap-4 px-5 h-14 hover:bg-surface-700 transition-colors duration-150 text-left"
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
                className="text-body-m text-ember-500 hover:text-ember-700 transition-colors"
              >
                View all →
              </Link>
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
    </>
  );
}
