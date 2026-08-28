import { createServiceClient } from "@/lib/supabase";
import { ensureUserExists } from "@/lib/users";
import { analyzeTransaction } from "@/lib/agent";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (secret) {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  const payload = body.payload?.payment?.entity;

  if (!payload) {
    return NextResponse.json({ status: "ignored" });
  }

  const userId = body.account_id ?? "demo-user-1";
  await ensureUserExists(userId);

  const txnId = `txn_${payload.id}`;
  const now = new Date().toISOString();

  const txn = {
    id: txnId,
    user_id: userId,
    razorpay_payment_id: payload.id,
    amount: payload.amount / 100,
    currency: payload.currency || "INR",
    method: payload.method ?? "unknown",
    issuer: payload.bank ?? payload.vpa?.split("@")[1] ?? "Unknown",
    status: event === "payment.captured" ? "recovered" : "declined",
    decline_code: payload.error_code ?? null,
    decline_reason: payload.error_description ?? payload.error_reason ?? null,
    merchant_name: payload.notes?.merchant ?? "Merchant",
    created_at: now,
    recovered_at: event === "payment.captured" ? now : null,
  };

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { error: txnErr } = await supabase.from("transactions").upsert(txn);
  if (txnErr) {
    console.error("Error inserting transaction:", txnErr);
    return NextResponse.json({ error: "Failed to save transaction" }, { status: 500 });
  }

  if (event === "payment.failed") {
    const decision = await analyzeTransaction({
      transactionId: txnId,
      declineCode: payload.error_code ?? "UNKNOWN",
      declineReason: payload.error_description ?? "Payment failed",
      amount: txn.amount,
      method: txn.method,
      issuer: txn.issuer,
    });

    const actionId = crypto.randomUUID();
    const action = {
      id: actionId,
      transaction_id: txnId,
      decision: decision.decision,
      delay_seconds: decision.delay_seconds ?? null,
      alt_method: decision.alt_method ?? null,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      created_at: now,
    };

    const messageId = crypto.randomUUID();
    const message = {
      id: messageId,
      transaction_id: txnId,
      channel: decision.drafted_message.channel,
      body: decision.drafted_message.body,
      created_at: now,
    };

    await supabase.from("agent_actions").insert(action);
    await supabase.from("recovery_messages").insert(message);
  }

  return NextResponse.json({ status: "ok" });
}
