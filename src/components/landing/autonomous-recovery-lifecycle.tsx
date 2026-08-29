"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";
import {
  Lightning,
  Robot,
  Path,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  TerminalWindow,
  WhatsappLogo,
  ChatCircleText,
  EnvelopeSimple,
  ArrowsLeftRight,
  Sparkle,
  Clock,
  Graph,
} from "@phosphor-icons/react";

interface StepDetail {
  id: string;
  stepNum: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  tag: string;
  metric: { value: string; label: string };
  codeSnippet: string;
}

const stepsData: StepDetail[] = [
  {
    id: "interception",
    stepNum: "01",
    title: "Instant Interception",
    subtitle: "Sub-second Razorpay Event Listener",
    description:
      "Ingests `payment.failed` webhooks in real time. Classifies issuer failure modes, error codes, and customer risk profiles in under 85 milliseconds.",
    icon: Lightning,
    tag: "Sub-100ms Ingestion",
    metric: { value: "< 85ms", label: "Event Ingestion Latency" },
    codeSnippet: `// Step 01: Event Processing
const webhookPayload = await req.json();
const failureEvent = await undrop.intercept({
  event: "payment.failed",
  gateway: "Razorpay",
  declineCode: "BAD_REQUEST_PAYMENT_TIMED_OUT",
  issuer: "HDFC_BANK",
  method: "UPI_INTENT",
  amount: 499900 // INR ₹4,999.00
});

// Real-time classification: Technical Timeout
const classification = failureEvent.classify();
console.log(classification);
// { type: "RETRYABLE_TIMEOUT", priority: "HIGH" }`,
  },
  {
    id: "ai-agent",
    stepNum: "02",
    title: "Agentic AI Recovery",
    subtitle: "Context-Aware Grok Recovery Engine",
    description:
      "Grok AI analyzes failure patterns, customer context, and preferred messaging channels. Automatically generates personalized payment retry links.",
    icon: Robot,
    tag: "Grok AI Orchestrated",
    metric: { value: "34.2%", label: "Average Recovery Rate" },
    codeSnippet: `// Step 02: Grok AI Recovery Agent
const recoveryPlan = await undrop.agent.evaluate({
  transactionId: "pay_N8x2K9vL1z",
  customerHistory: { previousRecoveries: 2, trustScore: 0.94 },
  preferredChannel: "WHATSAPP"
});

await recoveryPlan.dispatchMessage({
  template: "smart_recovery_link",
  channel: "WHATSAPP",
  discountPrompt: false,
  oneClickUPI: true
});`,
  },
  {
    id: "route-sync",
    stepNum: "03",
    title: "Route Intelligence & Sync",
    subtitle: "Proactive Failover & Ledger Reconciliation",
    description:
      "Clusters declining gateways, triggers dynamic route failovers to prevent systemic revenue drop, and reconciles recovered GMV directly into your ledger.",
    icon: Path,
    tag: "Dynamic Route Failover",
    metric: { value: "₹1.4M+", label: "Recovered GMV / Mo" },
    codeSnippet: `// Step 03: Dynamic Route Failover & Sync
const routeHealth = await undrop.routes.checkHealth("HDFC_UPI");
if (routeHealth.failureRate > 0.25) {
  await undrop.routes.reroute({
    from: "HDFC_PRIMARY",
    to: "ICICI_BACKUP_GATEWAY",
    reason: "Ember Route Cluster Spike"
  });
}

// Reconcile ledger state automatically
await undrop.ledger.reconcile("pay_N8x2K9vL1z", "RECOVERED");`,
  },
];

export function AutonomousRecoveryLifecycle() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const activeStep = stepsData[activeStepIndex];

  return (
    <section className="relative border-t border-border bg-ink-900 py-20 md:py-32 overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ember-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-container mx-auto px-4 md:px-8 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ember-500/10 border border-ember-500/30 text-xs font-mono text-ember-600 dark:text-ember-400 font-semibold mb-4">
                <Sparkle className="w-3.5 h-3.5 text-ember-500" />
                <span>Autonomous Recovery Engine</span>
              </div>
              <h2 className="font-display text-display-l text-text-primary mb-3">
                Autonomous Recovery Lifecycle
              </h2>
              <p className="text-body-l text-text-secondary max-w-2xl">
                End-to-End Revenue Recovery Engine — from sub-second failure detection to AI-powered channel outreach and dynamic route failovers.
              </p>
            </div>

            {/* Step Selector Badges */}
            <div className="flex items-center gap-2 bg-surface-800/90 p-1.5 rounded-card border border-border backdrop-blur">
              {stepsData.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-chip text-body-s font-semibold transition-all duration-200 flex items-center gap-2",
                    activeStepIndex === idx
                      ? "bg-surface-700 text-text-primary border border-surface-500/60 shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-700/50"
                  )}
                >
                  <span className={cn(
                    "text-[11px] font-mono font-bold",
                    activeStepIndex === idx ? "text-ember-500 dark:text-ember-400" : "text-text-secondary"
                  )}>
                    {step.stepNum}
                  </span>
                  <span>{step.title.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Main 3-Step Vercel-Style Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: 3 Step Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {stepsData.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStepIndex === idx;

              return (
                <ScrollReveal key={step.id} delay={idx * 80}>
                  <div
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setIsAutoPlaying(false);
                    }}
                    className={cn(
                      "group relative cursor-pointer rounded-card p-6 transition-all duration-300 border",
                      isActive
                        ? "bg-surface-800/90 border-ember-500/40 shadow-lg shadow-ember-500/5 ring-1 ring-ember-500/30"
                        : "bg-surface-900/40 border-border hover:bg-surface-800/40 hover:border-surface-600"
                    )}
                  >
                    {/* Active Accent Pill */}
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute left-0 top-6 bottom-6 w-1 bg-ember-500 rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center border transition-colors duration-200",
                            isActive
                              ? "bg-ember-500/10 border-ember-500/30 text-ember-400"
                              : "bg-surface-800 border-border text-text-tertiary group-hover:text-text-secondary"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-ember-500 dark:text-ember-400 font-bold">
                              {step.stepNum}
                            </span>
                            <span className="text-xs uppercase tracking-wider text-text-secondary dark:text-text-tertiary font-mono font-semibold">
                              {step.tag}
                            </span>
                          </div>
                          <h3
                            className={cn(
                              "font-display text-display-s transition-colors duration-200",
                              isActive ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
                            )}
                          >
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <ArrowRight
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isActive
                            ? "text-ember-400 translate-x-1"
                            : "text-text-tertiary opacity-0 group-hover:opacity-100"
                        )}
                      />
                    </div>

                    <p className="text-body-m text-text-secondary pl-13">
                      {step.description}
                    </p>

                    {/* Step Metric Highlight */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                      <span className="text-text-secondary font-medium">{step.metric.label}</span>
                      <span className="font-mono font-bold text-pulse-600 dark:text-pulse-400">
                        {step.metric.value}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Right Column: Code & Interactive Preview Card */}
          <div className="lg:col-span-7 flex flex-col">
            <ScrollReveal className="h-full">
              <div className="h-full bg-surface-950 border border-border/90 rounded-card p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="h-4 w-px bg-border/80" />
                    <span className="font-mono text-xs text-text-tertiary flex items-center gap-1.5">
                      <TerminalWindow className="w-4 h-4 text-ember-400" />
                      undrop-engine://{activeStep.id}.ts
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pulse-500/15 border border-pulse-500/40 text-[11px] font-mono text-pulse-600 dark:text-pulse-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-pulse-500 animate-pulse" />
                      LIVE STREAM
                    </span>
                  </div>
                </div>

                {/* Card Content Area with Framer Motion Switch */}
                <div className="my-6 min-h-[340px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="space-y-6"
                    >
                      {/* Interactive Visual Graphic per Step */}
                      {activeStep.id === "interception" && (
                        <StepInterceptionGraphic />
                      )}
                      {activeStep.id === "ai-agent" && (
                        <StepAIAgentGraphic />
                      )}
                      {activeStep.id === "route-sync" && (
                        <StepRouteSyncGraphic />
                      )}

                      {/* Code Block Snippet */}
                      <div className="rounded-card bg-ink-950 border border-border/80 p-4 font-mono text-xs overflow-x-auto text-text-secondary leading-relaxed relative">
                        <div className="absolute top-3 right-3 text-[10px] text-text-tertiary uppercase tracking-wider font-mono">
                          TypeScript
                        </div>
                        <pre className="text-text-secondary">
                          <code>{activeStep.codeSnippet}</code>
                        </pre>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Info / Status Bar */}
                <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between text-xs text-text-tertiary gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-pulse-400" />
                    <span>Razorpay Webhook Verified — AES-256 Signature Validated</span>
                  </div>
                  <div className="font-mono text-[11px] text-text-secondary">
                    Step {activeStepIndex + 1} of 3
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* Step 01 Graphic: Razorpay Ingestion & Error Interception */}
function StepInterceptionGraphic() {
  return (
    <div className="bg-surface-900/90 border border-border rounded-card p-5 space-y-4 shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-ember-500/10 border border-ember-500/20 text-ember-400">
            <Lightning className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-text-primary">Razorpay Ingestion Pipeline</span>
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-800 text-ember-400 border border-border">
          Status: 402 Decline Intercepted
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-ink-950 p-3 rounded-lg border border-border">
          <span className="text-[10px] uppercase text-text-tertiary block mb-1">Gateway Event</span>
          <span className="font-mono text-xs text-text-primary block font-medium">payment.failed</span>
        </div>
        <div className="bg-ink-950 p-3 rounded-lg border border-border">
          <span className="text-[10px] uppercase text-text-tertiary block mb-1">Decline Code</span>
          <span className="font-mono text-xs text-flatline-400 block font-medium">PAYMENT_TIMED_OUT</span>
        </div>
        <div className="bg-ink-950 p-3 rounded-lg border border-border">
          <span className="text-[10px] uppercase text-text-tertiary block mb-1">Issuer Corridor</span>
          <span className="font-mono text-xs text-text-primary block font-medium">HDFC / UPI Intent</span>
        </div>
      </div>
    </div>
  );
}

{/* Step 02 Graphic: Grok AI Agentic Dispatch */}
function StepAIAgentGraphic() {
  return (
    <div className="bg-surface-900/90 border border-border rounded-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-pulse-500/10 border border-pulse-500/20 text-pulse-400">
            <Robot className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-text-primary">Grok AI Agent Decisioning</span>
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-pulse-500/10 text-pulse-400 border border-pulse-500/30">
          Confidence: 98.4%
        </span>
      </div>

      <div className="bg-ink-950 p-3.5 rounded-lg border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#005C4B] text-white flex items-center justify-center">
            <WhatsappLogo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-text-primary">WhatsApp One-Click Recovery</div>
            <div className="text-[11px] text-text-tertiary">&quot;Hi Rahul, your transaction of ₹4,999 timed out. Tap to retry securely.&quot;</div>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded bg-surface-800 text-[11px] font-mono text-pulse-400 border border-border">
          Dispatched
        </div>
      </div>
    </div>
  );
}

{/* Step 03 Graphic: Route Intelligence & Ledger Sync */}
function StepRouteSyncGraphic() {
  return (
    <div className="bg-surface-900/90 border border-border rounded-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-ember-500/10 border border-ember-500/20 text-ember-400">
            <Path className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-text-primary">Route Failover & Pulse Sync</span>
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-800 text-pulse-400 border border-border">
          Ledger: Reconciled
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 bg-ink-950 p-3.5 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-flatline-500/10 text-flatline-400 border border-flatline-500/20 text-xs font-mono">
            HDFC Primary (Degraded)
          </span>
          <ArrowsLeftRight className="w-4 h-4 text-text-tertiary" />
          <span className="px-2 py-1 rounded bg-pulse-500/10 text-pulse-400 border border-pulse-500/20 text-xs font-mono">
            ICICI Backup (Optimal)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-pulse-400 font-mono font-medium">
          <CheckCircle className="w-4 h-4" />
          Rerouted
        </div>
      </div>
    </div>
  );
}
