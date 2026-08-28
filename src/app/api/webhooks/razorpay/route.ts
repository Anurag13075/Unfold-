import { demoStore } from "@/lib/supabase";
import { analyzeTransaction } from "@/lib/agent";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const event = body.event;
  const payload = body.payload?.payment?.entity;

  if (!payload) {
    return NextResponse.json({ status: "ignored" });
  }

  const userId = body.account_id ?? "demo-user-1";
  const txnId = `txn_${payload.id}`;

  const txn = {
    id: txnId,
    user_id: userId,
    razorpay_payment_id: payload.id,
    amount: payload.amount / 100,
    currency: payload.currency,
    method: payload.method ?? "unknown",
    issuer: payload.bank ?? payload.vpa?.split("@")[1] ?? "Unknown",
    status: event === "payment.captured" ? ("recovered" as const) : ("declined" as const),
    decline_code: payload.error_code ?? null,
    decline_reason: payload.error_description ?? payload.error_reason ?? null,
    merchant_name: payload.notes?.merchant ?? "Merchant",
    created_at: new Date().toISOString(),
    recovered_at: event === "payment.captured" ? new Date().toISOString() : null,
  };

  demoStore.transactions.set(txnId, txn);

  if (event === "payment.failed") {
    const decision = await analyzeTransaction({
      transactionId: txnId,
      declineCode: payload.error_code ?? "UNKNOWN",
      declineReason: payload.error_description ?? "Payment failed",
      amount: txn.amount,
      method: txn.method,
      issuer: txn.issuer,
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
  }

  return NextResponse.json({ status: "ok" });
}
