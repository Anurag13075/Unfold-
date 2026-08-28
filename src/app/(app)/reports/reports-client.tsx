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

interface ReportsClientProps {
  stats: ReturnType<typeof import("@/lib/data").getDashboardStats>;
  reports: ReturnType<typeof import("@/lib/data").getReportsData>;
}

export function ReportsClient({ stats, reports }: ReportsClientProps) {
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
      <header className="sticky top-0 z-20 h-16 bg-ink-950 border-b border-border px-6 flex items-center">
        <h1 className="font-display text-display-m text-text-primary">Executive Summary</h1>
      </header>

      <div className="p-6 max-w-container">
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

          {/* Row 2: recovery chart */}
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

          {/* Row 3: table + bar chart */}
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
