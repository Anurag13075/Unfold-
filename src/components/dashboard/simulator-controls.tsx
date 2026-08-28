"use client";

import { useState } from "react";
import { Play, Lightning, Warning, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface SimulatorControlsProps {
  onSimulate: (scenario: { count: number; injectCluster: boolean; issuer?: string; declineCode?: string }) => Promise<void>;
  isLoading: boolean;
}

export function SimulatorControls({ onSimulate, isLoading }: SimulatorControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const presets = [
    {
      id: "hdfc-upi-cluster",
      label: "HDFC UPI Outage (Anomaly Cluster)",
      description: "Injects 5 HDFC UPI Intent GATEWAY_ERROR failures & triggers Route Intelligence alert.",
      injectCluster: true,
      count: 5,
      badge: "Route Cluster",
    },
    {
      id: "icici-auth-fail",
      label: "ICICI 3DS Auth Failure",
      description: "Injects card authentication decline and triggers instant alternate method recovery agent.",
      injectCluster: false,
      count: 1,
      badge: "Alt Method Agent",
    },
    {
      id: "high-value-escalation",
      label: "High-Value Transaction Decline (₹45,000)",
      description: "Simulates large cart decline triggering AI decision agent delay & email escalation.",
      injectCluster: false,
      count: 1,
      badge: "Agent Escalation",
    },
  ];

  const handleRun = async (preset: typeof presets[0]) => {
    setActiveScenario(preset.id);
    await onSimulate({ count: preset.count, injectCluster: preset.injectCluster });
    setActiveScenario(null);
  };

  return (
    <div className="bg-surface-800 border border-border rounded-card p-4 mb-6 shadow-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-ember-500/10 border border-ember-500/30 flex items-center justify-center text-ember-500">
            <Lightning className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-display-m text-text-primary">Live Autonomous Agent Simulator</h3>
              <span className="px-2 py-0.5 rounded-chip bg-pulse-wash text-pulse-700 font-mono text-mono-s">
                Interactive Standout
              </span>
            </div>
            <p className="text-body-m text-text-secondary">
              Simulate live Razorpay decline events and watch AI decision logic & Route Intelligence respond in real time.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-surface-700 hover:bg-surface-600 border border-border rounded-btn text-body-m font-medium text-text-primary transition-colors flex items-center gap-2"
        >
          <Play className="w-4 h-4 text-ember-500" />
          {isOpen ? "Hide Scenarios" : "Run Live Scenario"}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
              {presets.map((preset) => {
                const isRunning = activeScenario === preset.id && isLoading;
                return (
                  <div
                    key={preset.id}
                    className="p-4 bg-ink-950/60 border border-border hover:border-ember-500/40 rounded-card flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-mono-s text-ember-500 bg-ember-500/10 px-2 py-0.5 rounded border border-ember-500/20">
                          {preset.badge}
                        </span>
                      </div>
                      <h4 className="font-display text-display-s text-text-primary group-hover:text-ember-500 transition-colors">
                        {preset.label}
                      </h4>
                      <p className="text-body-m text-text-tertiary mt-1.5 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRun(preset)}
                      disabled={isLoading}
                      className="mt-4 w-full py-2 px-3 bg-surface-700 hover:bg-ember-500 hover:text-ink-950 text-text-primary font-mono text-mono-s rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isRunning ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Simulating...</span>
                        </>
                      ) : (
                        <>
                          <span>Trigger Event</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
