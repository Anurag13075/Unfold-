"use client";

import { useState } from "react";
import { Cpu, Lightning, ShieldCheck, ArrowsMerge, CheckCircle } from "@phosphor-icons/react";

interface SmartRoutingRule {
  id: string;
  corridor: string;
  triggerCondition: string;
  fallbackAction: string;
  active: boolean;
  bypassedCount: number;
}

export function SmartRouterRuleEngine() {
  const [rules, setRules] = useState<SmartRoutingRule[]>([
    {
      id: "rule_1",
      corridor: "HDFC · UPI Intent",
      triggerCondition: "Failure rate > 20% over 10 min window",
      fallbackAction: "Reroute to ICICI Secondary Gateway",
      active: true,
      bypassedCount: 142,
    },
    {
      id: "rule_2",
      corridor: "ICICI · Card 3DS",
      triggerCondition: "Authentication Timeout > 15%",
      fallbackAction: "Enable Step-Up Authentication Fallback",
      active: true,
      bypassedCount: 89,
    },
    {
      id: "rule_3",
      corridor: "SBI · Netbanking",
      triggerCondition: "Technical Decline > 10%",
      fallbackAction: "Auto-retry with 60s backoff",
      active: false,
      bypassedCount: 34,
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.id === id) {
          const nextState = !rule.active;
          setToastMessage(
            `Smart Router rule for "${rule.corridor}" is now ${nextState ? "ACTIVE" : "PAUSED"}`
          );
          setTimeout(() => setToastMessage(null), 3000);
          return { ...rule, active: nextState };
        }
        return rule;
      })
    );
  };

  return (
    <div className="bg-surface-800 border border-border rounded-card p-5 mb-8 shadow-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-pulse-500/10 border border-pulse-500/30 flex items-center justify-center text-pulse-500">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-display-m text-text-primary">Autonomous Smart Router Engine</h2>
              <span className="px-2 py-0.5 rounded-chip bg-pulse-wash text-pulse-700 font-mono text-mono-s">
                Live Dynamic Bypass
              </span>
            </div>
            <p className="text-body-m text-text-secondary">
              Real-time corridor health rules automatically divert transactions away from degraded issuer routes.
            </p>
          </div>
        </div>

        {toastMessage && (
          <div className="px-3 py-1.5 rounded bg-pulse-500/20 border border-pulse-500/40 text-pulse-500 font-mono text-mono-s flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 rounded-card border transition-all ${
              rule.active
                ? "bg-surface-700/60 border-pulse-500/30 shadow-sm"
                : "bg-ink-950/40 border-border opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ArrowsMerge className={`w-4 h-4 ${rule.active ? "text-pulse-500" : "text-text-tertiary"}`} />
                <span className="font-mono text-mono-s text-text-primary font-bold">{rule.corridor}</span>
              </div>
              <button
                onClick={() => toggleRule(rule.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rule.active ? "bg-pulse-500" : "bg-surface-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-ink-950 shadow ring-0 transition duration-200 ease-in-out ${
                    rule.active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <p className="text-mono-s text-text-tertiary mb-1">
              <strong className="text-text-secondary">If:</strong> {rule.triggerCondition}
            </p>
            <p className="text-mono-s text-pulse-500 mb-3 font-medium">
              <strong className="text-text-secondary">Action:</strong> {rule.fallbackAction}
            </p>

            <div className="pt-3 border-t border-border/50 flex items-center justify-between text-mono-s text-text-tertiary">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-pulse-500" />
                Active Protection
              </span>
              <span className="font-mono text-text-primary">{rule.bypassedCount} txns bypassed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
