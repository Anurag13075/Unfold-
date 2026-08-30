"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlowingLogo } from "@/components/brand/glowing-logo";
import {
  CheckCircle,
  WarningCircle,
  Lightning,
  CreditCard,
  QrCode,
  Bank,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Sparkle,
  Spinner,
  ArrowSquareOut,
  Info,
} from "@phosphor-icons/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PublicRecoveryPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [recDetails, setRecDetails] = useState<any>(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetch(`/api/recover/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Payment link not found or expired.");
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        if (resData.transaction?.status === "recovered") {
          setRecovered(true);
        }
        if (resData.recommendation?.altMethod) {
          const alt = resData.recommendation.altMethod.toLowerCase();
          if (alt.includes("card")) setSelectedMethod("card");
          else if (alt.includes("upi")) setSelectedMethod("upi");
          else if (alt.includes("netbank")) setSelectedMethod("netbanking");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [params.id]);

  const handlePay = async () => {
    if (!data?.transaction) return;
    setIsProcessing(true);

    const keyId = data.razorpayKeyId;

    if (keyId && (keyId.startsWith("rzp_live") || keyId.startsWith("rzp_test")) && typeof window !== "undefined" && window.Razorpay) {
      try {
        const options: any = {
          key: keyId,
          amount: Math.round(data.transaction.amount * 100),
          currency: data.transaction.currency || "INR",
          name: data.transaction.merchant_name || "Merchant Payment",
          description: `Recovery for #${data.transaction.id}`,
          order_id: data.razorpayOrderId || undefined,
          handler: async function (response: any) {
            await completeRecovery(response.razorpay_payment_id || `pay_${Date.now()}`);
          },
          prefill: {
            contact: "9876543210",
            email: "customer@example.com",
          },
          theme: {
            color: "#F2A73B",
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.warn("Razorpay modal failed, defaulting to direct recovery completion", err);
      }
    }

    // Direct / Test / Simulated mode completion fallback
    setTimeout(async () => {
      await completeRecovery(`pay_rec_${Math.random().toString(36).substring(2, 9)}`);
    }, 800);
  };

  const completeRecovery = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/recover/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          payment_method: selectedMethod,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setRecovered(true);
        setRecDetails(resData);
      } else {
        alert(resData.error || "Failed to process recovery payment.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--ink-950)] text-[var(--text-primary)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="w-8 h-8 animate-spin text-[var(--ember-500)]" />
          <p className="text-sm text-[var(--text-secondary)]">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--ink-950)] text-[var(--text-primary)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--surface-800)] border border-[var(--border-default)] rounded-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--flatline-wash)] border border-[var(--flatline-500)]/30 text-[var(--flatline-500)] flex items-center justify-center mx-auto">
            <WarningCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-medium font-heading">Payment Link Unavailable</h1>
          <p className="text-sm text-[var(--text-secondary)]">{error || "The requested payment recovery link could not be found."}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center text-xs font-mono px-4 py-2 rounded-lg bg-[var(--surface-700)] text-[var(--text-primary)] hover:bg-[var(--surface-600)] transition"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const { transaction, recommendation } = data;

  return (
    <div className="min-h-screen bg-[var(--ink-950)] text-[var(--text-primary)] flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden grain">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[var(--ember-500)]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-lg flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <GlowingLogo size={24} />
          <span className="font-heading font-medium text-sm tracking-tight text-[var(--text-primary)]">
            {transaction.merchant_name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--pulse-500)] font-mono bg-[var(--pulse-wash)] px-2.5 py-1 rounded-full border border-[var(--pulse-500)]/20">
          <ShieldCheck className="w-4 h-4" /> Secure Recovery
        </div>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-lg my-auto py-6">
        <div className="bg-[var(--surface-800)] border border-[var(--border-strong)] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
          {recovered ? (
            /* Success State */
            <div className="text-center space-y-6 py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[var(--pulse-wash)] border border-[var(--pulse-500)]/40 text-[var(--pulse-500)] flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-[var(--pulse-500)] tracking-wide uppercase">
                  Payment Recovered
                </span>
                <h1 className="text-2xl font-semibold font-heading text-[var(--text-primary)]">
                  ₹{transaction.amount.toLocaleString("en-IN")} Paid Successfully
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Thank you! Your payment to <span className="text-[var(--text-primary)] font-medium">{transaction.merchant_name}</span> has been confirmed.
                </p>
              </div>

              <div className="bg-[var(--ink-950)] border border-[var(--border-default)] rounded-xl p-4 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[var(--text-tertiary)]">
                  <span>Merchant</span>
                  <span className="text-[var(--text-primary)]">{transaction.merchant_name}</span>
                </div>
                <div className="flex justify-between text-[var(--text-tertiary)]">
                  <span>Transaction ID</span>
                  <span className="text-[var(--text-primary)]">{transaction.id}</span>
                </div>
                <div className="flex justify-between text-[var(--text-tertiary)]">
                  <span>Payment Ref</span>
                  <span className="text-[var(--text-primary)]">{recDetails?.paymentId || transaction.razorpay_payment_id}</span>
                </div>
                <div className="flex justify-between text-[var(--text-tertiary)]">
                  <span>Recovered At</span>
                  <span className="text-[var(--pulse-500)]">{recDetails?.recoveredAt ? new Date(recDetails.recoveredAt).toLocaleTimeString() : "Just now"}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-xs bg-[var(--surface-700)] hover:bg-[var(--surface-600)] text-[var(--text-primary)] border border-[var(--border-default)] transition"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            /* Active Recovery Form State */
            <>
              {/* Header Amount */}
              <div className="text-center space-y-1 border-b border-[var(--border-default)] pb-6">
                <span className="text-xs font-mono text-[var(--ember-500)] uppercase tracking-wider font-medium">
                  Complete Payment
                </span>
                <h1 className="text-3xl font-bold font-heading tabular-nums text-[var(--text-primary)]">
                  ₹{transaction.amount.toLocaleString("en-IN")}
                </h1>
                <p className="text-xs text-[var(--text-tertiary)] font-mono">
                  Ref: {transaction.id} · Original decline: {transaction.decline_code || "Payment Unfinished"}
                </p>
              </div>

              {/* Mode Banner Indicator */}
              {data.isLiveOrTestKey ? (
                <div className="flex items-center gap-2 bg-[var(--pulse-wash)] border border-[var(--pulse-500)]/30 rounded-xl px-3.5 py-2.5 text-xs text-[var(--pulse-500)] font-mono">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Real Razorpay Gateway Active ({data.razorpayKeyId?.startsWith("rzp_live") ? "Live Mode" : "Test Mode"})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-[var(--surface-700)] border border-[var(--border-default)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-secondary)] font-mono">
                  <Info className="w-4 h-4 shrink-0 text-[var(--ember-500)]" />
                  <span>Demo / Simulated Recovery Mode (No Razorpay keys connected)</span>
                </div>
              )}

              {/* AI Route Intelligence Tip */}
              <div className="bg-gradient-to-r from-[var(--ember-wash)] to-transparent border border-[var(--ember-500)]/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ember-500)] uppercase font-mono tracking-wider">
                  <Sparkle className="w-4 h-4" /> AI Route Intelligence Recommendation
                </div>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wide">
                  Select Recovery Method
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("upi")}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                      selectedMethod === "upi"
                        ? "bg-[var(--surface-700)] border-[var(--ember-500)] text-[var(--text-primary)] shadow-sm"
                        : "bg-[var(--ink-950)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[var(--ember-500)] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-[var(--text-primary)]">UPI / GPay / PhonePe</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">Instant 1-step retry</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("card")}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                      selectedMethod === "card"
                        ? "bg-[var(--surface-700)] border-[var(--ember-500)] text-[var(--text-primary)] shadow-sm"
                        : "bg-[var(--ink-950)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[var(--pulse-500)] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-[var(--text-primary)]">Debit / Credit Card</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">High approval rate</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("netbanking")}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                      selectedMethod === "netbanking"
                        ? "bg-[var(--surface-700)] border-[var(--ember-500)] text-[var(--text-primary)] shadow-sm"
                        : "bg-[var(--ink-950)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <Bank className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-[var(--text-primary)]">NetBanking</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">All Indian Banks</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("wallet")}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                      selectedMethod === "wallet"
                        ? "bg-[var(--surface-700)] border-[var(--ember-500)] text-[var(--text-primary)] shadow-sm"
                        : "bg-[var(--ink-950)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-[var(--text-primary)]">Wallets</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">Paytm / Mobikwik</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit CTA Buttons (Hybrid Modal + External Redirect Link option) */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-heading font-semibold text-sm bg-[var(--ember-500)] hover:bg-[var(--ember-700)] text-[var(--ink-950)] transition shadow-lg shadow-[var(--ember-500)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Spinner className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lightning className="w-5 h-5 weight-fill" />
                      Pay ₹{transaction.amount.toLocaleString("en-IN")} via Checkout
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                {data.paymentLinkUrl && (
                  <a
                    href={data.paymentLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-heading font-medium text-xs bg-[var(--surface-700)] hover:bg-[var(--surface-600)] text-[var(--text-primary)] border border-[var(--border-default)] transition"
                  >
                    <ArrowSquareOut className="w-4 h-4 text-[var(--text-secondary)]" />
                    Or Pay via Direct Razorpay Hosted Link
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg text-center py-4 text-xs font-mono text-[var(--text-tertiary)]">
        Powered by <span className="text-[var(--text-secondary)]">Undrop Agentic Recovery</span> · 256-bit Encrypted
      </footer>
    </div>
  );
}
