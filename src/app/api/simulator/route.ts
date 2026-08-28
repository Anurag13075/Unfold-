import { demoStore } from "@/lib/supabase";
import { DECLINE_CODES, ISSUERS, METHODS } from "@/lib/seed-data";
import { analyzeTransaction, summarizeCluster } from "@/lib/agent";
import { NextResponse } from "next/server";
import crypto from "crypto";

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: Request) {
  const { userId = "demo-user-1", count = 1, injectCluster = false } = await req.json();

  const generated = [];

  for (let i = 0; i < count; i++) {
    const isCluster = injectCluster || (Math.random() < 0.15 && i > 0);
    const decline = isCluster
      ? DECLINE_CODES.find((d) => d.code === "GATEWAY_ERROR")!
      : randomFrom(DECLINE_CODES);
    const issuer = isCluster ? "HDFC" : randomFrom(ISSUERS);
    const method = isCluster ? "UPI Intent" : randomFrom(METHODS);
    const txnId = `txn_sim_${crypto.randomUUID().slice(0, 8)}`;
    const amount = Math.floor(Math.random() * 12000) + 500;

    const txn = {
      id: txnId,
      user_id: userId,
      razorpay_payment_id: `pay_sim_${crypto.randomUUID().slice(0, 8)}`,
      amount,
      currency: "INR",
      method,
      issuer,
      status: "declined" as const,
      decline_code: decline.code,
      decline_reason: decline.reason,
      merchant_name: randomFrom(["Urban Threads", "FreshCart", "CloudDesk"]),
      created_at: new Date().toISOString(),
      recovered_at: null,
    };

    demoStore.transactions.set(txnId, txn);

    const decision = await analyzeTransaction({
      transactionId: txnId,
      declineCode: decline.code,
      declineReason: decline.reason,
      amount,
      method,
      issuer,
    });

    demoStore.agentActions.push({
      id: crypto.randomUUID(),
      transaction_id: txnId,
      decision: decision.decision,
      delay_seconds: decision.delay_seconds ?? null,
      alt_method: decision.alt_method ?? null,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      created_at: new Date().toISOString(),
    });

    demoStore.recoveryMessages.push({
      id: crypto.randomUUID(),
      transaction_id: txnId,
      channel: decision.drafted_message.channel,
      body: decision.drafted_message.body,
      created_at: new Date().toISOString(),
    });

    generated.push(txnId);

    // Auto-recover some after delay simulation
    if (Math.random() > 0.4) {
      setTimeout(() => {
        const t = demoStore.transactions.get(txnId);
        if (t) {
          t.status = "recovered";
          t.recovered_at = new Date().toISOString();
          demoStore.transactions.set(txnId, t);
        }
      }, 3000 + Math.random() * 5000);
    }
  }

  if (injectCluster) {
    const summary = await summarizeCluster({
      issuer: "HDFC",
      method: "UPI Intent",
      errorCode: "GATEWAY_ERROR",
      failureRate: 0.34,
      baselineRate: 0.08,
      count: count,
    });

    demoStore.routeClusters.unshift({
      id: `cluster_${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId,
      issuer: "HDFC",
      method: "UPI Intent",
      error_code: "GATEWAY_ERROR",
      severity: "critical",
      headline: summary.headline,
      summary: summary.summary,
      recommended_action: summary.recommended_action,
      failure_rate: 0.34,
      baseline_rate: 0.08,
      status: "active",
      sparkline: [0.08, 0.09, 0.12, 0.18, 0.24, 0.31, 0.34],
      history: [],
      created_at: new Date().toISOString(),
      resolved_at: null,
    });
  }

  return NextResponse.json({ generated, count: generated.length });
}
