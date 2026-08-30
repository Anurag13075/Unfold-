import { auth } from "@/lib/auth";
import { getTransaction, getRecoveryMessage } from "@/lib/data";
import { sendEmailOutreach, sendSmsOutreach, sendWhatsappOutreach, sendTelegramOutreach, sendWebhookOutreach } from "@/lib/outreach";
import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      channel = "email",
      transactionId = "txn_demo_1",
      recipient,
      customKeys = {},
    } = body;

    let transaction = await getTransaction(transactionId, session?.user?.id);

    // Fallback if transaction is test/simulated or doesn't exist
    if (!transaction) {
      transaction = {
        id: transactionId,
        razorpay_payment_id: "pay_test_123",
        amount: 4999,
        currency: "INR",
        method: "UPI",
        issuer: "HDFC",
        status: "declined",
        decline_code: "BAD_REQUEST_ERROR",
        decline_reason: "Payment declined by issuing bank",
        merchant_name: "Acme Store",
        created_at: new Date().toISOString(),
        recovered_at: null,
      };
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const recoveryUrl = `${protocol}://${host}/recover/${transaction.id}`;

    let result: any = null;

    if (channel === "email") {
      const emailTo = recipient || customKeys.emailTo || "customer@example.com";
      result = await sendEmailOutreach({
        to: emailTo,
        subject: `[Payment Recovery] Action required for ₹${transaction.amount}`,
        merchantName: transaction.merchant_name,
        amount: transaction.amount,
        recoveryUrl,
        customApiKey: customKeys.resendApiKey,
      });
    } else if (channel === "sms") {
      const phoneTo = recipient || customKeys.phoneTo || "+919876543210";
      result = await sendSmsOutreach({
        to: phoneTo,
        body: `Your payment of ₹${transaction.amount} to ${transaction.merchant_name} failed. Tap to recover in 1 click.`,
        recoveryUrl,
        customSid: customKeys.twilioSid,
        customToken: customKeys.twilioToken,
        customFrom: customKeys.twilioFrom,
      });
    } else if (channel === "whatsapp") {
      const phoneTo = recipient || customKeys.phoneTo || "+919876543210";
      result = await sendWhatsappOutreach({
        to: phoneTo,
        body: `Your payment of ₹${transaction.amount} to ${transaction.merchant_name} failed. Tap to recover in 1 click.`,
        recoveryUrl,
        customSid: customKeys.twilioSid,
        customToken: customKeys.twilioToken,
        customFrom: customKeys.twilioWhatsappFrom,
      });
    } else if (channel === "telegram") {
      result = await sendTelegramOutreach({
        text: `Transaction ${transaction.id} (₹${transaction.amount}) to ${transaction.merchant_name} failed due to ${transaction.decline_code || "bank decline"}.`,
        recoveryUrl,
        customBotToken: customKeys.telegramBotToken,
        customChatId: customKeys.telegramChatId,
      });
    } else if (channel === "webhook") {
      const targetWebhook = recipient || customKeys.webhookUrl || "https://example.com/webhook";
      result = await sendWebhookOutreach({
        webhookUrl: targetWebhook,
        payload: {
          event: "recovery.triggered",
          transaction,
          recoveryUrl,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Save recovery message trace in Supabase if database present
    const supabase = createServiceClient();
    if (supabase && transaction.id) {
      try {
        await supabase.from("recovery_messages").insert({
          transaction_id: transaction.id,
          channel: channel === "whatsapp" ? "whatsapp" : channel === "sms" ? "sms" : "email",
          body: `[Outreach Dispatched via ${result?.provider || channel}] Recovery Link: ${recoveryUrl}`,
          created_at: new Date().toISOString(),
        });
      } catch (traceErr) {
        // Logging the outreach trace is best-effort — a failure here
        // must never fail the actual dispatch response to the user.
        console.error("Failed to save recovery_messages trace:", traceErr);
      }
    }

    return NextResponse.json({
      success: true,
      result,
      recoveryUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to send outreach" }, { status: 500 });
  }
}
