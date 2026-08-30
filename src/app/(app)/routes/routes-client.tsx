"use client";

import { useState } from "react";
import { RouteClusterCard } from "@/components/routes/route-cluster-card";
import { SmartRouterRuleEngine } from "@/components/routes/smart-router-rule-engine";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { RouteCluster } from "@/types";

interface RoutesClientProps {
  clusters: RouteCluster[];
}

export function RoutesClient({ clusters }: RoutesClientProps) {
  const [issuerFilter, setIssuerFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

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
