"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Waveform } from "@/components/waveform/waveform";
import type { RouteCluster } from "@/types";
import { cn } from "@/lib/utils";

interface RouteClusterCardProps {
  cluster: RouteCluster;
  compact?: boolean;
}

export function RouteClusterCard({ cluster, compact }: RouteClusterCardProps) {
  const severityColor = {
    low: "text-text-secondary",
    medium: "text-ember-700",
    high: "text-flatline-700",
    critical: "text-flatline-500",
  };

  return (
    <Card interactive className={cn(compact && "p-4")}>
      <p className="text-body-s uppercase tracking-wide text-text-secondary mb-2">
        {cluster.issuer} / {cluster.method}
      </p>
      <h3 className="text-body-l text-text-primary mb-3">{cluster.headline}</h3>

      <div className="h-10 mb-3">
        <Sparkline data={cluster.sparkline} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className={cn("font-mono text-mono-s", severityColor[cluster.severity])}>
          {(cluster.failure_rate * 100).toFixed(0)}% fail rate / baseline {(cluster.baseline_rate * 100).toFixed(0)}%
        </span>
        <span
          className={cn(
            "font-mono text-mono-s px-2 py-0.5 rounded-chip",
            cluster.status === "active" ? "bg-flatline-wash text-flatline-500" : "bg-pulse-wash text-pulse-500"
          )}
        >
          {cluster.status}
        </span>
      </div>

      {!compact && (
        <>
          <p className="text-body-m text-text-secondary mb-4">{cluster.summary}</p>

          {cluster.history.length > 0 && (
            <div className="flex gap-2 mb-4">
              {cluster.history.map((h) => (
                <span
                  key={h.date}
                  className={cn(
                    "font-mono text-mono-s px-2 py-1 rounded-chip",
                    h.resolved ? "bg-pulse-wash text-pulse-500" : "bg-white/[.05] text-text-tertiary"
                  )}
                >
                  {h.date.slice(5)}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <Button variant="ghost" size="sm" className="w-full">
        Push to Smart Router
      </Button>
    </Card>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 0.01);
  const width = 100;
  const height = 40;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (v / max) * height * 0.9;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#E5536B"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
