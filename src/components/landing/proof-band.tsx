"use client";

import { StatCard } from "./stat-card";
import { ScrollReveal } from "./scroll-reveal";

const stats = [
  {
    label: "Recovery rate (simulated)",
    endValue: 73,
    suffix: "%",
    accent: "text-pulse-700",
    note: "Against real Razorpay decline-code distributions in test mode",
  },
  {
    label: "Decline codes modeled",
    endValue: 6,
    suffix: "",
    accent: "text-ember-700",
    note: "NPCI-aligned business vs. technical split (~80/20)",
  },
  {
    label: "Cluster detection window",
    endValue: 12,
    suffix: " min",
    accent: "text-text-primary",
    note: "Rolling window for issuer/method anomaly detection",
  },
  {
    label: "Agent decisions logged",
    endValue: 100,
    suffix: "%",
    accent: "text-pulse-700",
    note: "Every recovery attempt produces a typed, auditable trace",
  },
];

export function ProofBand() {
  return (
    <section className="border-t border-border py-20 md:py-32">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3 text-center">
            Proof points
          </p>
          <h2 className="font-display text-display-m text-text-primary mb-12 text-center max-w-2xl mx-auto">
            Honest metrics from simulated runs on real decline distributions — not fabricated customer logos
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 70}>
              <StatCard {...stat} countUp endValue={stat.endValue} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
