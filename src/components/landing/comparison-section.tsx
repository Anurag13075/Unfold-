"use client";

import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";
import {
  XCircle,
  CheckCircle,
  ArrowRight,
  Sparkle,
  WarningCircle,
  TrendUp,
  Clock,
  ShieldCheck,
  ArrowsClockwise,
} from "@phosphor-icons/react";

const withoutUndropPoints = [
  {
    title: "Silent Revenue Leakage",
    desc: "Failed transactions drop off into black-hole logs without automated recovery attempt.",
  },
  {
    title: "Manual Support Churn",
    desc: "Customers wait hours for support responses, leading to abandoned carts and bad reviews.",
  },
  {
    title: "Unnoticed Gateway Blindspots",
    desc: "Degraded bank corridors (e.g., HDFC/UPI spikes) cause repeat declines before ops notices.",
  },
];

const withUndropPoints = [
  {
    title: "Instant Sub-Second Recovery",
    desc: "Automated Grok AI agent intercepts webhooks and dispatches personalized 1-click links in under 85ms.",
  },
  {
    title: "Multi-Channel Intelligent Outreach",
    desc: "Contextual WhatsApp, SMS, and Email outreach delivered directly on preferred customer channels.",
  },
  {
    title: "Proactive Route Failover",
    desc: "Dynamic cluster analysis flags failing corridors and automatically reroutes traffic to optimal acquirers.",
  },
];

export function ComparisonSection() {
  return (
    <section className="border-t border-border bg-ink-950 py-20 md:py-32 relative overflow-hidden">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-flatline-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-pulse-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-container mx-auto px-4 md:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-800 border border-border text-xs font-mono text-text-secondary font-semibold mb-4">
              <Sparkle className="w-3.5 h-3.5 text-ember-500" />
              <span>Impact Comparison</span>
            </div>
            <h2 className="font-display text-display-l text-text-primary mb-4">
              The Cost of Inaction vs. Autonomous Recovery
            </h2>
            <p className="text-body-l text-text-secondary">
              See how replacing manual payment retries with Undrop transforms lost revenue into predictable gross merchandise value (GMV).
            </p>
          </div>
        </ScrollReveal>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Without Undrop */}
          <ScrollReveal delay={50} className="h-full">
            <div className="h-full bg-surface-900/60 border border-flatline-500/20 rounded-card p-6 md:p-8 flex flex-col justify-between relative group hover:border-flatline-500/40 transition-colors duration-300">
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-flatline-500/10 border border-flatline-500/20 flex items-center justify-center text-flatline-500">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-flatline-500 font-mono font-bold">
                        Legacy Approach
                      </span>
                      <h3 className="font-display text-display-m text-text-primary">
                        Without Undrop
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-flatline-500/10 text-flatline-500 border border-flatline-500/20 font-semibold">
                    ~0% Recovered
                  </span>
                </div>

                {/* Metric Summary Banner */}
                <div className="bg-ink-950/80 border border-flatline-500/20 rounded-lg p-5 mb-8">
                  <div className="text-xs text-text-tertiary uppercase tracking-wider font-mono mb-1">
                    Estimated Monthly Revenue Loss
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-bold text-flatline-500">
                      ₹4,50,000+
                    </span>
                    <span className="text-xs text-flatline-400/80 font-mono flex items-center gap-1">
                      <WarningCircle className="w-3.5 h-3.5" />
                      15-20% Payment Failure Rate
                    </span>
                  </div>
                </div>

                {/* Point List */}
                <div className="space-y-6 mb-8">
                  {withoutUndropPoints.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="p-1 rounded bg-flatline-500/10 text-flatline-500 mt-0.5 shrink-0">
                        <XCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-body-m font-semibold text-text-primary mb-1">
                          {item.title}
                        </h4>
                        <p className="text-body-s text-text-secondary">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-text-tertiary">
                <Clock className="w-4 h-4 text-flatline-500/80" />
                <span>Average Manual Resolution: 24 - 48 Hours</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: With Undrop */}
          <ScrollReveal delay={120} className="h-full">
            <div className="h-full bg-surface-800/90 border border-pulse-500/40 rounded-card p-6 md:p-8 flex flex-col justify-between relative group hover:border-pulse-500/60 transition-colors duration-300 shadow-xl shadow-pulse-500/5">
              {/* Highlight Pill Badge */}
              <div className="absolute -top-3.5 right-6 bg-pulse-500 text-ink-950 px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 shadow-md">
                <Sparkle className="w-3 h-3 fill-current" />
                RECOMMENDED
              </div>

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pulse-500/10 border border-pulse-500/30 flex items-center justify-center text-pulse-400">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-pulse-400 font-mono font-bold">
                        Autonomous AI Engine
                      </span>
                      <h3 className="font-display text-display-m text-text-primary">
                        With Undrop
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-pulse-500/10 text-pulse-400 border border-pulse-500/30 font-semibold">
                    34.2% Avg Recovery Rate
                  </span>
                </div>

                {/* Metric Summary Banner */}
                <div className="bg-ink-950/80 border border-pulse-500/30 rounded-lg p-5 mb-8">
                  <div className="text-xs text-text-tertiary uppercase tracking-wider font-mono mb-1">
                    Monthly Recovered GMV
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-bold text-pulse-400">
                      +₹1,53,900
                    </span>
                    <span className="text-xs text-pulse-400/90 font-mono flex items-center gap-1 font-medium">
                      <TrendUp className="w-3.5 h-3.5" />
                      Direct Ledger Retention
                    </span>
                  </div>
                </div>

                {/* Point List */}
                <div className="space-y-6 mb-8">
                  {withUndropPoints.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="p-1 rounded bg-pulse-500/10 text-pulse-400 mt-0.5 shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-body-m font-semibold text-text-primary mb-1">
                          {item.title}
                        </h4>
                        <p className="text-body-s text-text-secondary">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-text-tertiary">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pulse-400" />
                  <span>Real-time Webhook Ingestion (&lt;85ms)</span>
                </div>
                <div className="flex items-center gap-1 text-ember-400 font-mono font-semibold">
                  <span>Zero Manual Effort</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
