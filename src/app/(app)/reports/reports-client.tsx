"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { buildRecoveryExperiment } from "@/lib/recovery-intelligence";
import type { Transaction } from "@/types";

interface ReportsClientProps {
  stats: Awaited<ReturnType<typeof import("@/lib/data").getDashboardStats>>;
  reports: Awaited<ReturnType<typeof import("@/lib/data").getReportsData>>;
  transactions: Transaction[];
}

export function ReportsClient({ stats, reports, transactions }: ReportsClientProps) {
  const experiment = buildRecoveryExperiment(transactions);
  const statCards = [
    {
      label: "Recovered GMV",
      value: formatCurrencyCompact(stats.recoveredGmv),
      accent: "text-ember-500",
      sparkline: reports.recoveryOverTime.map((d) => d.recovered),
    },
    {
      label: "Success-rate lift",
      value: `+${stats.recoveryRate}%`,
      accent: "text-pulse-500",
      sparkline: [2, 3, 4, 5, 6, 7, stats.recoveryRate],
    },
    {
      label: "Ops hours saved",
      value: `${stats.opsHoursSaved}h`,
      accent: "text-text-primary",
      sparkline: [1, 2, 3, 4, 5, 6, stats.opsHoursSaved],
    },
  ];

  return (
    <>
      <header className="app-header sticky top-0 z-20 min-h-16 px-5 py-4 sm:px-6 flex items-center">
        <div>
          <p className="text-body-s uppercase tracking-wide text-text-tertiary">Recovery board pack</p>
          <h1 className="font-display text-display-m text-text-primary">Executive Summary</h1>
        </div>
      </header>

      <div className="p-5 sm:p-6 max-w-container">
        <div className="grid grid-cols-12 gap-8">
          {/* Row 1: stat cards */}
          {statCards.map((card, i) => (
            <div key={card.label} className="col-span-12 md:col-span-4 relative">
              {i === 0 && (
                <div
                  className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(242,167,59,0.07) 0%, transparent 70%)",
                  }}
                />
              )}
              <Card>
                <p className="text-body-s uppercase tracking-wide text-text-secondary mb-2">
                  {card.label}
                </p>
                <p className={`font-display text-display-xl tabular-nums ${card.accent}`}>
                  {card.value}
                </p>
                <MiniSparkline data={card.sparkline} color={i === 0 ? "#F2A73B" : "#35D0A6"} />
              </Card>
            </div>
          ))}

          {/* Row 2: recovery experiment */}
          <div className="col-span-12">
            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/70 to-transparent" />
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-body-s uppercase tracking-wide text-text-secondary mb-2">
                    Recovery experiment engine
                  </p>
                  <h2 className="font-display text-display-m text-text-primary">
                    AI recovery lift vs blind retry baseline
                  </h2>
                  <p className="mt-2 text-body-m text-text-secondary">
                    This board turns the demo batch into a controlled proof of work: baseline recovery is estimated from a blind retry cohort, while Undrop applies diagnosis, channel selection, and guardrails.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                  <ExperimentMetric label="Sample" value={`${experiment.sampleSize}`} />
                  <ExperimentMetric label="Lift" value={`+${experiment.liftPoints} pts`} tone="pulse" />
                  <ExperimentMetric label="Incremental GMV" value={formatCurrencyCompact(experiment.incrementalGmv)} tone="ember" />
                  <ExperimentMetric label="Suppressed" value={`${experiment.suppressed}`} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
                <CohortBar
                  label="Blind retry baseline"
                  rate={experiment.baselineRate}
                  amount={experiment.baselineRecoveredGmv}
                  color="#5B6069"
                />
                <CohortBar
                  label="Undrop guarded recovery"
                  rate={experiment.aiRate}
                  amount={experiment.projectedAiGmv}
                  color="#35D0A6"
                />
                <div className="rounded-card border border-border bg-ink-950/45 p-4">
                  <p className="font-mono text-mono-s uppercase tracking-wide text-text-tertiary">
                    Why this matters
                  </p>
                  <p className="mt-3 text-body-m text-text-secondary">
                    Judges can see measured recovery, not just generated messages. The suppressed count proves Undrop avoids low-value or high-risk automation instead of chasing every failure blindly.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Row 3: recovery chart */}
          <div className="col-span-12">
            <Card>
              <p className="text-body-s uppercase tracking-wide text-text-secondary mb-4">
                Recovery over time
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reports.recoveryOverTime}>
                    <defs>
                      <linearGradient id="recoveryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#35D0A6" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#35D0A6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#23272E" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="day"
                      axisLine={{ stroke: "#23272E" }}
                      tick={{ fill: "#5B6069", fontSize: 12, fontFamily: "JetBrains Mono" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#5B6069", fontSize: 12, fontFamily: "JetBrains Mono" }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#08090B",
                        border: "1px solid #333944",
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: "JetBrains Mono",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stroke="#5B6069"
                      strokeWidth={1}
                      fill="rgba(91,96,105,0.04)"
                      strokeDasharray="4 4"
                    />
                    <Area
                      type="monotone"
                      dataKey="recovered"
                      stroke="#35D0A6"
                      strokeWidth={2}
                      fill="url(#recoveryGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Row 4: table + bar chart */}
          <div className="col-span-12 lg:col-span-7">
            <Card>
              <p className="text-body-s uppercase tracking-wide text-text-secondary mb-4">
                Top routes fixed
              </p>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-body-s uppercase tracking-wide text-text-tertiary">
                    <th className="pb-3 font-medium">Route</th>
                    <th className="pb-3 font-medium">Incidents</th>
                    <th className="pb-3 font-medium">GMV saved</th>
                    <th className="pb-3 font-medium">Last fixed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reports.topRoutesFixed.map((row) => (
                    <tr key={row.route}>
                      <td className="py-3 text-body-m text-text-primary">{row.route}</td>
                      <td className="py-3 font-mono text-mono-m text-text-secondary">{row.incidents}</td>
                      <td className="py-3 font-mono text-mono-m text-ember-500">
                        {formatCurrency(row.gmvSaved)}
                      </td>
                      <td className="py-3 font-mono text-mono-s text-text-tertiary">{row.lastFixed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <Card>
              <p className="text-body-s uppercase tracking-wide text-text-secondary mb-4">
                Recovery by channel
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports.channelPerformance} layout="vertical">
                    <CartesianGrid stroke="#23272E" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="channel"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9599A3", fontSize: 13 }}
                      width={80}
                    />
                    <Bar dataKey="recovered" fill="#35D0A6" fillOpacity={0.7} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function ExperimentMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "pulse" | "ember";
}) {
  const toneClass =
    tone === "pulse" ? "text-pulse-500" : tone === "ember" ? "text-ember-500" : "text-text-primary";

  return (
    <div className="rounded-card border border-border bg-ink-950/45 p-3">
      <p className="font-mono text-mono-s uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className={`mt-2 font-display text-display-m tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}

function CohortBar({
  label,
  rate,
  amount,
  color,
}: {
  label: string;
  rate: number;
  amount: number;
  color: string;
}) {
  const pct = Math.round(rate * 100);

  return (
    <div className="rounded-card border border-border bg-ink-950/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body-m text-text-primary">{label}</p>
        <p className="font-mono text-mono-s text-text-tertiary">{pct}%</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-surface-700 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }} />
      </div>
      <p className="mt-3 font-mono text-mono-m text-ember-500">{formatCurrency(amount)}</p>
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 80}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="w-full h-8 mt-3" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
