"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { RouteClusterCard } from "@/components/routes/route-cluster-card";
import { SmartRouterRuleEngine } from "@/components/routes/smart-router-rule-engine";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { buildMerchantBrief } from "@/lib/recovery-intelligence";
import { formatCurrencyCompact } from "@/lib/utils";
import { Lightning, Target, WarningCircle } from "@phosphor-icons/react";
import type { RouteCluster, Transaction } from "@/types";

interface RoutesClientProps {
  clusters: RouteCluster[];
  transactions: Transaction[];
}

export function RoutesClient({ clusters, transactions }: RoutesClientProps) {
  const [issuerFilter, setIssuerFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const brief = buildMerchantBrief(transactions, clusters);

  const issuers = ["all", ...Array.from(new Set(clusters.map((c) => c.issuer)))];
  const severities = ["all", "critical", "high", "medium", "low"];

  const filtered = clusters.filter((c) => {
    if (issuerFilter !== "all" && c.issuer !== issuerFilter) return false;
    if (severityFilter !== "all" && c.severity !== severityFilter) return false;
    return true;
  });

  return (
    <>
      <header className="app-header sticky top-0 z-20 min-h-16 px-5 py-4 sm:px-6 flex items-center">
        <div>
          <p className="text-body-s uppercase tracking-wide text-text-tertiary">Smart router control plane</p>
          <h1 className="font-display text-display-m text-text-primary">Route Intelligence</h1>
        </div>
      </header>

      <div className="p-5 sm:p-6 max-w-container">
        <div className="app-surface rounded-card p-5 mb-8 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flatline-500/70 to-transparent" />
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-ember-500">
                <WarningCircle size={18} weight="fill" />
                <p className="text-body-s uppercase tracking-wide">Incident commander brief</p>
              </div>
              <h2 className="mt-2 font-display text-display-m text-text-primary">
                {brief.headline}
              </h2>
              <p className="mt-2 text-body-m text-text-secondary">{brief.operatorNote}</p>
              <div className="mt-4 rounded-card border border-border bg-ink-950/45 p-4">
                <p className="font-mono text-mono-s uppercase tracking-wide text-text-tertiary">
                  Recommended next move
                </p>
                <p className="mt-2 text-body-m text-text-primary">{brief.priorityAction}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 min-w-full lg:min-w-[360px]">
              <BriefMetric
                icon={<Lightning size={18} weight="fill" />}
                label="At-risk GMV"
                value={formatCurrencyCompact(brief.atRiskGmv)}
                tone="ember"
              />
              <BriefMetric
                icon={<Target size={18} weight="fill" />}
                label="Recoverable"
                value={`${brief.recoverableCount}`}
                tone="pulse"
              />
              <BriefMetric
                icon={<WarningCircle size={18} weight="fill" />}
                label="Critical"
                value={`${brief.critical}`}
                tone="flatline"
              />
            </div>
          </div>
        </div>

        <SmartRouterRuleEngine />
        <div className="flex flex-wrap gap-4 mb-6">
          <SegmentedControl
            options={issuers.map((i) => ({ value: i, label: i === "all" ? "All issuers" : i }))}
            value={issuerFilter}
            onChange={setIssuerFilter}
          />
          <SegmentedControl
            options={severities.map((s) => ({
              value: s,
              label: s === "all" ? "All severity" : s.charAt(0).toUpperCase() + s.slice(1),
            }))}
            value={severityFilter}
            onChange={setSeverityFilter}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((cluster) => (
            <RouteClusterCard key={cluster.id} cluster={cluster} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-body-m text-text-secondary text-center py-12">
            No clusters match your filters.
          </p>
        )}
      </div>
    </>
  );
}

function BriefMetric({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "ember" | "pulse" | "flatline";
}) {
  const toneClass =
    tone === "ember" ? "text-ember-500" : tone === "pulse" ? "text-pulse-500" : "text-flatline-500";

  return (
    <div className="rounded-card border border-border bg-ink-950/45 p-3">
      <div className={toneClass}>{icon}</div>
      <p className="mt-3 font-mono text-mono-s uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className={`mt-1 font-display text-display-m tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}
