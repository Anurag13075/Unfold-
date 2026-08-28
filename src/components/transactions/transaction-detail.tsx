"use client";

import { formatCurrency, timeAgo } from "@/lib/utils";
import { StatusChip } from "@/components/ui/status-chip";
import { Waveform } from "@/components/waveform/waveform";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
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
    return <p className="text-text-secondary">Loading...</p>;
  }

  if (!data?.transaction) {
    return <p className="text-text-secondary">Transaction not found.</p>;
  }

  const { transaction, actions, message } = data;

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

      {message && (
        <div>
          <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3">
            Recovery message
          </p>
          <MessageBubble channel={message.channel} body={message.body} />
        </div>
      )}
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
