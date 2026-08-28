"use client";

import { Card } from "@/components/ui/card";
import { PulseLedgerPreview } from "./pulse-ledger-preview";
import { RouteClusterCard } from "@/components/routes/route-cluster-card";
import { ScrollReveal } from "./scroll-reveal";
import type { RouteCluster } from "@/types";

const demoCluster: RouteCluster = {
  id: "landing-cluster",
  issuer: "HDFC",
  method: "UPI Intent",
  error_code: "GATEWAY_ERROR",
  severity: "critical",
  headline: "HDFC declining 34% above baseline",
  summary: "Clustering job flags corridors statistically above their own 7-day baseline.",
  recommended_action: "Route to backup acquirer via Smart Router.",
  failure_rate: 0.34,
  baseline_rate: 0.08,
  status: "active",
  sparkline: [0.08, 0.12, 0.18, 0.24, 0.31, 0.34],
  history: [],
  created_at: new Date().toISOString(),
  resolved_at: null,
};

export function CapabilitiesBento() {
  const smallCards = [
    {
      title: "Agent decision trace",
      body: "Every recovery shows a typed decision with confidence score and plain-English reasoning — visible to ops, not a black box.",
    },
    {
      title: "Encrypted key storage",
      body: "Razorpay and notification-provider keys are AES-256-GCM encrypted at rest. Masked after entry, decrypted only server-side at point of use.",
    },
    {
      title: "Multi-channel recovery",
      body: "WhatsApp, SMS, and email drafts — channel-accurate bubble mocks, not generic templates.",
      extra: <ChannelBubbles />,
    },
    {
      title: "Real-time webhooks",
      body: "Listens for payment.failed and payment.captured from your connected Razorpay test-mode account. Real decline codes, real gateway signals.",
    },
  ];

  return (
    <section className="border-t border-border py-20 md:py-32">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3">Capabilities</p>
          <h2 className="font-display text-display-l text-text-primary mb-12">
            Built like a product, not a demo screen
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ScrollReveal className="md:col-span-2 md:row-span-2" delay={0}>
            <Card className="h-full flex flex-col">
              <p className="text-body-s uppercase tracking-wide text-text-secondary mb-2">Pulse Ledger</p>
              <p className="text-body-m text-text-secondary mb-4">
                Live recovery feed with waveform states per transaction.
              </p>
              <div className="flex-1 scale-[0.92] origin-top">
                <PulseLedgerPreview compact />
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-2 md:row-span-2" delay={70}>
            <Card className="h-full flex flex-col">
              <p className="text-body-s uppercase tracking-wide text-text-secondary mb-2">
                Route Intelligence
              </p>
              <p className="text-body-m text-text-secondary mb-4">
                Clusters failures by issuer, method, and error code — flags corridors bleeding above baseline.
              </p>
              <RouteClusterCard cluster={demoCluster} compact />
            </Card>
          </ScrollReveal>

          {smallCards.map((card, i) => (
            <ScrollReveal key={card.title} delay={(i + 2) * 70}>
              <Card className="h-full">
                <h3 className="text-body-l text-text-primary mb-2">{card.title}</h3>
                <p className="text-body-m text-text-secondary">{card.body}</p>
                {card.extra}
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChannelBubbles() {
  return (
    <div className="mt-4 flex gap-2">
      <div className="px-2 py-1 rounded-chip bg-[#005C4B] text-[10px] text-white">WA</div>
      <div className="px-2 py-1 rounded-chip bg-surface-600 text-[10px] text-text-secondary">SMS</div>
      <div className="px-2 py-1 rounded-chip bg-surface-700 text-[10px] text-text-tertiary border border-border">
        Email
      </div>
    </div>
  );
}
