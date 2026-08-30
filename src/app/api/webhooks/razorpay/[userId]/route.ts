import { createServiceClient } from "@/lib/supabase";
import { getUserById, ensureUserExists } from "@/lib/users";
import { decrypt } from "@/lib/encryption";
import { analyzeTransaction } from "@/lib/agent";
import {
  sendEmailOutreach,
  sendSmsOutreach,
  sendWhatsappOutreach,
  sendTelegramOutreach,
} from "@/lib/outreach";
import {
  getMerchantEmailKey,
  getMerchantSmsConfig,
  getMerchantWhatsappConfig,
  getMerchantTelegramConfig,
} from "@/lib/outreach-config";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const user = await getUserById(userId);
  if (!user || !user.razorpay_webhook_secret_enc) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let secret: string;
  try {
    secret = decrypt(user.razorpay_webhook_secret_enc);
  } catch (err) {
    console.error("Failed to decrypt webhook secret:", err);
    return NextResponse.json({ error: "Failed to decrypt secret" }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
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

  await ensureUserExists(userId);

  const txnId = `txn_${payload.id}`;
  const now = new Date().toISOString();

  const txn = {
    id: txnId,
    user_id: userId,
    razorpay_payment_id: payload.id,
    amount: Math.round(payload.amount / 100),
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

    // Auto-dispatch real outreach — using ONLY this merchant's own saved
    // credentials. If they haven't configured a given channel yet, we
    // deliberately skip sending rather than falling back to any global/
    // owner credentials, so one merchant's customers are never contacted
    // through another merchant's Twilio/Resend/Telegram account.
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const recoveryUrl = `${protocol}://${host}/recover/${txnId}`;
    const channel = decision.drafted_message.channel;
    const customerEmail = payload.email || null;
    const customerContact = payload.contact || null;

    if (channel === "email" && customerEmail) {
      const resendKey = getMerchantEmailKey(user);
      if (resendKey) {
        await sendEmailOutreach({
          to: customerEmail,
          subject: `Payment Recovery Notice for ₹${txn.amount}`,
          merchantName: txn.merchant_name,
          amount: txn.amount,
          recoveryUrl,
          customApiKey: resendKey,
        });
      }
    } else if (channel === "sms" && customerContact) {
      const smsConfig = getMerchantSmsConfig(user);
      if (smsConfig) {
        await sendSmsOutreach({
          to: customerContact,
          body: decision.drafted_message.body,
          recoveryUrl,
          customSid: smsConfig.sid,
          customToken: smsConfig.token,
          customFrom: smsConfig.from,
        });
      }
    } else if (channel === "whatsapp" && customerContact) {
      const waConfig = getMerchantWhatsappConfig(user);
      if (waConfig) {
        await sendWhatsappOutreach({
          to: customerContact,
          body: decision.drafted_message.body,
          recoveryUrl,
          customSid: waConfig.sid,
          customToken: waConfig.token,
          customFrom: waConfig.from,
        });
      }
    }

    const telegramConfig = getMerchantTelegramConfig(user);
    if (telegramConfig) {
      await sendTelegramOutreach({
        text: `Decline captured: ₹${txn.amount} via ${txn.method} (${txn.issuer}). AI decision: ${decision.decision}.`,
        recoveryUrl,
        customBotToken: telegramConfig.botToken,
        customChatId: telegramConfig.chatId,
      });
    }
  }

  return NextResponse.json({ status: "ok" });
}
