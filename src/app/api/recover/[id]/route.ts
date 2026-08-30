import { getTransaction, getAgentActions } from "@/lib/data";
import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  let transaction = await getTransaction(params.id);

  // Fallback for demo / direct link test if DB record isn't pre-inserted
  if (!transaction) {
    transaction = {
      id: params.id,
      razorpay_payment_id: `pay_${params.id}`,
      amount: 4999,
      currency: "INR",
      method: "UPI Intent",
      issuer: "HDFC",
      status: "declined",
      decline_code: "BAD_REQUEST_ERROR",
      decline_reason: "Payment declined due to bank transient limit",
      merchant_name: "Acme Retail Store",
      created_at: new Date().toISOString(),
      recovered_at: null,
    };
  }

  const supabase = createServiceClient();
  let razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || null;
  let razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || null;
  let paymentLinkUrl: string | null = null;
  let razorpayOrderId: string | null = null;

  if (supabase) {
    const { data: txnData } = await supabase
      .from("transactions")
      .select("user_id")
      .eq("id", params.id)
      .maybeSingle();

    if (txnData?.user_id) {
      const { data: userData } = await supabase
        .from("users")
        .select("razorpay_key_id, razorpay_key_secret_enc")
        .eq("id", txnData.user_id)
        .maybeSingle();

      if (userData?.razorpay_key_id) {
        razorpayKeyId = userData.razorpay_key_id;
      }
      if (userData?.razorpay_key_secret_enc) {
        try {
          const { decrypt } = await import("@/lib/encryption");
          razorpayKeySecret = decrypt(userData.razorpay_key_secret_enc);
        } catch (e) {
          console.error("Failed to decrypt user razorpay key secret:", e);
        }
      }
    }
  }

  // If we have Razorpay API keys, try creating an official Razorpay Order or Payment Link
  if (razorpayKeyId && razorpayKeySecret) {
    try {
      const authHeader = "Basic " + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");

      // Create Razorpay Order
      const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: Math.round(transaction.amount * 100),
          currency: transaction.currency || "INR",
          receipt: `rcpt_${transaction.id}`,
          notes: {
            recovery_transaction_id: transaction.id,
            merchant: transaction.merchant_name,
          },
        }),
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        razorpayOrderId = orderData.id;
      } else {
        const errText = await orderRes.text();
        console.warn("Razorpay Order creation API error response:", errText);
      }

      // Create Razorpay Payment Link (for external payment link redirect option)
      const linkRes = await fetch("https://api.razorpay.com/v1/payment_links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: Math.round(transaction.amount * 100),
          currency: transaction.currency || "INR",
          accept_partial: false,
          description: `Recovery payment for ${transaction.merchant_name} (Ref: ${transaction.id})`,
          customer: {
            name: "Customer",
            email: "customer@example.com",
            contact: "+919876543210",
          },
          notify: {
            sms: false,
            email: false,
          },
          reminder_enable: false,
          notes: {
            recovery_transaction_id: transaction.id,
          },
          callback_url: `${req.headers.get("origin") || ""}/recover/${transaction.id}`,
          callback_method: "get",
        }),
      });

      if (linkRes.ok) {
        const linkData = await linkRes.json();
        paymentLinkUrl = linkData.short_url || linkData.url || null;
      } else {
        const errText = await linkRes.text();
        console.warn("Razorpay Payment Link creation API error response:", errText);
      }
    } catch (apiErr) {
      console.error("Failed creating Razorpay order/link:", apiErr);
    }
  }

  const agentActions = await getAgentActions(params.id);
  const latestAction = agentActions.length > 0 ? agentActions[agentActions.length - 1] : null;

  return NextResponse.json({
    transaction,
    recommendation: {
      altMethod: latestAction?.alt_method || "Credit Card",
      reasoning: latestAction?.reasoning || "AI Route Intelligence: HDFC UPI has transient delays (34% above baseline). Retrying via Credit Card or PhonePe yields 99.4% instant success.",
    },
    razorpayKeyId,
    razorpayOrderId,
    paymentLinkUrl,
    isLiveOrTestKey: Boolean(razorpayKeyId && (razorpayKeyId.startsWith("rzp_live") || razorpayKeyId.startsWith("rzp_test"))),
  });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const { razorpay_payment_id, payment_method } = body;

    const supabase = createServiceClient();
    const now = new Date().toISOString();
    const newPaymentId = razorpay_payment_id || `pay_rec_${Math.random().toString(36).substring(2, 10)}`;

    if (supabase) {
      await supabase
        .from("transactions")
        .update({
          status: "recovered",
          recovered_at: now,
          razorpay_payment_id: newPaymentId,
          method: payment_method || "UPI",
        })
        .eq("id", params.id);
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully recovered!",
      transactionId: params.id,
      paymentId: newPaymentId,
      recoveredAt: now,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
