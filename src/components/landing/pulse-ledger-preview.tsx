"use client";

import { Waveform } from "@/components/waveform/waveform";
import { StatusChip } from "@/components/ui/status-chip";
import { formatCurrency } from "@/lib/utils";

const previewTransactions = [
  { merchant: "Urban Threads", method: "UPI Intent", issuer: "HDFC", amount: 2499, status: "recovered" as const },
  { merchant: "FreshCart Grocery", method: "Card", issuer: "ICICI", amount: 1847, status: "recovering" as const },
  { merchant: "CloudDesk SaaS", method: "UPI Intent", issuer: "HDFC", amount: 8999, status: "declined" as const },
  { merchant: "FitPulse Gym", method: "Netbanking", issuer: "SBI", amount: 3200, status: "recovered" as const },
  { merchant: "BookNest", method: "UPI Collect", issuer: "Axis", amount: 599, status: "declined" as const },
];

export function PulseLedgerPreview({ compact }: { compact?: boolean }) {
  const rows = compact ? previewTransactions.slice(0, 3) : previewTransactions;

  return (
    <div className="bg-surface-800 border border-border rounded-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <span className={compact ? "font-display text-display-m text-text-primary" : "font-display text-display-m text-text-primary"}>
          Pulse Ledger
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pulse-500 animate-pulse" />
          <span className="font-mono text-mono-s text-pulse-700">Live</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {rows.map((txn, i) => (
          <div key={i} className="flex items-center gap-4 px-5 h-14 hover:bg-surface-700/50 transition-colors">
            <Waveform status={txn.status} width={compact ? 80 : 100} height={compact ? 24 : 28} />
            <div className="flex-1 min-w-0">
              <p className="text-body-m text-text-primary truncate">{txn.merchant}</p>
              <p className="text-body-m text-text-tertiary truncate">
                {txn.method} · {txn.issuer}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-mono ${compact ? "text-mono-m" : "text-mono-m"} text-ember-500 tabular-nums`}>
                {formatCurrency(txn.amount)}
              </p>
              <StatusChip status={txn.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
