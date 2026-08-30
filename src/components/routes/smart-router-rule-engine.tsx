"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Lightning, ShieldCheck, ArrowsMerge, CheckCircle, DownloadSimple, Copy, Code, Spinner } from "@phosphor-icons/react";

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
      corridor: "HDFC / UPI Intent",
      triggerCondition: "Failure rate > 20% over 10 min window",
      fallbackAction: "Reroute to ICICI Secondary Gateway",
      active: true,
      bypassedCount: 142,
    },
    {
      id: "rule_2",
      corridor: "ICICI / Card 3DS",
      triggerCondition: "Authentication Timeout > 15%",
      fallbackAction: "Enable Step-Up Authentication Fallback",
      active: true,
      bypassedCount: 89,
    },
    {
      id: "rule_3",
      corridor: "SBI / Netbanking",
      triggerCondition: "Technical Decline > 10%",
      fallbackAction: "Auto-retry with 60s backoff",
      active: false,
      bypassedCount: 34,
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [jsonConfig, setJsonConfig] = useState<string>("");
  const [copied, setCopied] = useState(false);

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

  const handleExportConfig = async () => {
    setExportLoading(true);
    try {
      const res = await fetch("/api/routes/export", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.jsonFormatted) {
        setJsonConfig(data.jsonFormatted);
        setShowExportModal(true);
      } else {
        alert("Failed to export router rules.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setExportLoading(false);
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(jsonConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-surface rounded-card p-5 mb-8 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse-500/60 to-transparent" />
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

        <div className="flex items-center gap-2">
          {toastMessage && (
            <div className="px-3 py-1.5 rounded bg-pulse-500/20 border border-pulse-500/40 text-pulse-500 font-mono text-mono-s flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}

          <button
            onClick={handleExportConfig}
            disabled={exportLoading}
            className="px-3 py-2 rounded-btn bg-surface-700 hover:bg-surface-600 text-text-primary font-mono text-mono-s border border-border transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {exportLoading ? (
              <Spinner className="w-4 h-4 animate-spin" />
            ) : (
              <DownloadSimple className="w-4 h-4 text-ember-500" />
            )}
            <span>Export Smart Router Rules</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rules.map((rule) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-4 rounded-card border transition-all ${
              rule.active
                ? "bg-pulse-wash border-pulse-500/30 shadow-sm"
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
          </motion.div>
        ))}
      </div>

      {/* JSON Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-800 border border-border-strong rounded-card max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-ember-500" />
                <h3 className="font-display text-display-m text-text-primary">
                  Razorpay Smart Router Config Payload
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-text-tertiary hover:text-text-primary font-mono text-mono-s"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-body-s text-text-secondary">
              This formatted JSON rule payload matches Razorpay Smart Router specifications. Copy and import this payload into your Razorpay Smart Router configuration or sync directly.
            </p>

            <div className="relative">
              <pre className="bg-ink-950 p-4 rounded-lg font-mono text-mono-s text-text-primary max-h-80 overflow-y-auto border border-border select-all">
                {jsonConfig}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCopyConfig}
                className="px-4 py-2 rounded-btn bg-ember-500 hover:bg-ember-700 text-ink-950 font-mono text-mono-s font-bold transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied Payload!" : "Copy Payload JSON"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
