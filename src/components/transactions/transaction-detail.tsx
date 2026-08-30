"use client";

import { formatCurrency, timeAgo } from "@/lib/utils";
import { StatusChip } from "@/components/ui/status-chip";
import { Waveform } from "@/components/waveform/waveform";
import { assessRecoveryPolicy } from "@/lib/recovery-intelligence";
import Link from "next/link";
import { ArrowLeft, ArrowSquareOut, PaperPlaneTilt, CheckCircle, Spinner, ShieldCheck, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { AgentAction, RecoveryMessage, Transaction } from "@/types";

interface TransactionDetailProps {
  transactionId: string;
  compact?: boolean;
  initialData?: {
    transaction: Transaction;
    actions: AgentAction[];
    message: RecoveryMessage | null;
  };
}

const decisionLabels: Record<string, string> = {
  retry_now: "Retry now",
  retry_delayed: "Retry delayed",
  suggest_alt_method: "Alt method",
  escalate_human: "Escalate",
};

export function TransactionDetail({ transactionId, compact, initialData }: TransactionDetailProps) {
  const [data, setData] = useState(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    fetch(`/api/transactions/${transactionId}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [transactionId, initialData]);

  if (loading) {
    return <p className="text-text-secondary font-mono text-mono-s">Loading details...</p>;
  }

  if (!data?.transaction) {
    return <p className="text-text-secondary">Transaction not found.</p>;
  }

  const { transaction, actions, message } = data;
  const latestAction = actions[actions.length - 1] ?? null;
  const policy = assessRecoveryPolicy(transaction, latestAction);

  return (
    <div className="space-y-6">
      {!compact && (
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-body-m text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} weight="thin" />
          Back to Pulse Ledger
        </Link>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-display-m text-text-primary">
            {transaction.merchant_name}
          </h1>
          <p className="mt-1 font-mono text-mono-s text-text-tertiary">
            {transaction.razorpay_payment_id}
          </p>
        </div>
        <StatusChip status={transaction.status} />
      </div>

      <div className="flex items-center gap-6">
        <Waveform status={transaction.status} width={160} height={40} animate={transaction.status === "recovered"} />
        <div>
          <p className="font-mono text-mono-l text-ember-500 tabular-nums">
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-body-m text-text-secondary">
            {transaction.method} · {transaction.issuer}
          </p>
        </div>
      </div>

      {transaction.decline_reason && (
        <div>
          <p className="text-body-s uppercase tracking-wide text-text-secondary mb-2">Root cause</p>
          <p className="text-body-l text-text-primary">{transaction.decline_reason}</p>
          {transaction.decline_code && (
            <p className="mt-1 font-mono text-mono-s text-text-tertiary">{transaction.decline_code}</p>
          )}
        </div>
      )}

      {actions.length > 0 && (
        <div>
          <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3">Agent trace</p>
          <div className="space-y-4 border-l border-border pl-4">
            {actions.map((action) => (
              <div key={action.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-surface-600 border border-border-strong" />
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-mono-s text-text-tertiary">
                    {timeAgo(action.created_at)}
                  </span>
                  <span className="px-2 py-0.5 rounded-chip bg-ember-wash font-mono text-mono-s text-ember-700">
                    {decisionLabels[action.decision] ?? action.decision}
                  </span>
                  <span className="font-mono text-mono-s text-text-tertiary">
                    {Math.round(action.confidence * 100)}%
                  </span>
                </div>
                <p className="text-body-m text-text-secondary">{action.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3">
          Policy Guardrails
        </p>
        <div className="rounded-card border border-border bg-surface-900 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={policy.verdict === "approved" ? "text-pulse-500" : policy.verdict === "human_review" ? "text-ember-500" : "text-flatline-500"}>
                {policy.verdict === "approved" ? (
                  <ShieldCheck size={24} weight="fill" />
                ) : policy.verdict === "human_review" ? (
                  <WarningCircle size={24} weight="fill" />
                ) : (
                  <XCircle size={24} weight="fill" />
                )}
              </div>
              <div>
                <p className="font-display text-display-m text-text-primary">
                  {policy.verdict === "approved"
                    ? "Approved for bounded recovery"
                    : policy.verdict === "human_review"
                      ? "Human review required"
                      : "Automation blocked"}
                </p>
                <p className="text-body-m text-text-secondary">
                  AI recommendation: {latestAction ? decisionLabels[latestAction.decision] : "No agent action"} · Final action: {policy.finalAction}
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto rounded-chip bg-ink-950 px-2 py-1 font-mono text-mono-s text-text-tertiary">
              Risk: {policy.riskLevel}
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {policy.checks.map((check) => (
              <div key={check.label} className="flex items-start gap-3">
                <span
                  className={
                    check.status === "passed"
                      ? "mt-0.5 text-pulse-500"
                      : check.status === "review"
                        ? "mt-0.5 text-ember-500"
                        : "mt-0.5 text-flatline-500"
                  }
                >
                  {check.status === "passed" ? (
                    <CheckCircle size={16} weight="fill" />
                  ) : check.status === "review" ? (
                    <WarningCircle size={16} weight="fill" />
                  ) : (
                    <XCircle size={16} weight="fill" />
                  )}
                </span>
                <div>
                  <p className="text-body-m text-text-primary">{check.label}</p>
                  <p className="text-body-m text-text-secondary">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div>
          <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3">
            Interactive Customer Outreach Preview
          </p>
          <PhoneMockup message={message} transaction={transaction} />
        </div>
      )}
    </div>
  );
}

function PhoneMockup({ message, transaction }: { message: RecoveryMessage; transaction: Transaction }) {
  const [dispatching, setDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const recoveryUrl = typeof window !== "undefined" ? `${window.location.origin}/recover/${transaction.id}` : `/recover/${transaction.id}`;

  const handleDispatchOutreach = async () => {
    setDispatching(true);
    setDispatchStatus(null);
    try {
      const res = await fetch("/api/recovery/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: message.channel || "email",
          transactionId: transaction.id,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setDispatchStatus(`Outreach Sent! Provider: ${resData.result?.provider}`);
      } else {
        setDispatchStatus(`Dispatch failed: ${resData.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setDispatchStatus(`Error: ${err.message}`);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="bg-ink-950 border border-border rounded-2xl p-4 max-w-sm shadow-modal space-y-4">
      <div className="w-24 h-3 bg-surface-600 rounded-full mx-auto" />
      <div className="space-y-3">
        <MessageBubble channel={message.channel} body={message.body} />

        <div className="p-3 bg-surface-900 border border-border rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-mono-s text-text-tertiary">Public Checkout Link</span>
            <Link
              href={`/recover/${transaction.id}`}
              target="_blank"
              className="inline-flex items-center gap-1 font-mono text-mono-s text-ember-500 hover:underline"
            >
              Open Link <ArrowSquareOut size={14} />
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleDispatchOutreach}
            disabled={dispatching}
            className="w-full py-2.5 px-4 bg-ember-500 hover:bg-ember-700 text-ink-950 font-mono text-mono-s font-bold rounded-btn transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {dispatching ? (
              <>
                <Spinner className="w-4 h-4 animate-spin" />
                Dispatching Message...
              </>
            ) : (
              <>
                <PaperPlaneTilt size={16} weight="bold" />
                Dispatch Real Outreach ({message.channel.toUpperCase()})
              </>
            )}
          </button>

          {dispatchStatus && (
            <p className="font-mono text-mono-s text-center text-pulse-700 bg-pulse-500/10 p-2 rounded-md">
              {dispatchStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ channel, body }: { channel: string; body: string }) {
  if (channel === "whatsapp") {
    return (
      <div className="max-w-sm">
        <div className="bg-[#005C4B] rounded-card rounded-tl-none p-4">
          <p className="text-body-m text-white">{body}</p>
          <p className="mt-1 text-[11px] text-white/60 text-right">via WhatsApp</p>
        </div>
      </div>
    );
  }
  if (channel === "sms") {
    return (
      <div className="max-w-sm bg-surface-600 border border-border rounded-card p-4">
        <p className="text-body-m text-text-primary">{body}</p>
        <p className="mt-1 text-mono-s font-mono text-text-tertiary">via SMS</p>
      </div>
    );
  }
  return (
    <div className="max-w-md bg-surface-700 border border-border rounded-card p-5">
      <p className="text-body-s uppercase tracking-wide text-text-tertiary mb-2">Email draft</p>
      <p className="text-body-m text-text-primary">{body}</p>
    </div>
  );
}
