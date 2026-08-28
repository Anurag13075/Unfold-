"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OscilloscopeHero } from "@/components/illustrations/oscilloscope";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");

  const completeOnboarding = async () => {
    await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_key_id: razorpayKeyId,
        razorpay_key_secret: razorpaySecret,
      }),
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[55%_45%] bg-ink-950 grain">
      <div className="hidden md:flex flex-col justify-end relative p-12 bg-ink-950 overflow-hidden">
        <OscilloscopeHero className="absolute inset-0 w-full h-full object-cover opacity-60" quiet />
        <p className="relative z-10 text-body-l text-text-secondary max-w-sm">
          Connect once. Undrop handles the rest.
        </p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          <Wordmark className="h-6 w-auto text-text-primary mb-8" />

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-200",
                  i <= step ? "bg-pulse-500" : "bg-border"
                )}
              />
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-6 animate-[fadeIn_200ms_ease-out]">
              <div>
                <h1 className="font-display text-display-l text-text-primary mb-2">
                  Connect Razorpay & Webhook
                </h1>
                <p className="text-body-m text-text-secondary">
                  Enter your Razorpay test mode keys and add the Webhook URL to your Razorpay dashboard to process live payment failures.
                </p>
              </div>

              <div className="bg-surface-800 border border-pulse-500/30 rounded-card p-4">
                <p className="text-mono-s text-text-tertiary mb-1 font-mono uppercase">Your Webhook URL</p>
                <div className="flex items-center justify-between gap-2 bg-ink-950 p-2.5 rounded border border-border">
                  <code className="font-mono text-mono-s text-pulse-500 truncate select-all">
                    https://unfold-zeta-one.vercel.app/api/webhooks/razorpay
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText("https://unfold-zeta-one.vercel.app/api/webhooks/razorpay")}
                    className="px-2.5 py-1 bg-surface-700 hover:bg-surface-600 rounded text-mono-s font-mono text-text-primary transition-colors shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-mono-s text-text-tertiary mt-2">
                  Add this in Razorpay Dashboard ➔ Settings ➔ Webhooks. Select <strong className="text-text-secondary">payment.failed</strong> & <strong className="text-text-secondary">payment.captured</strong>.
                </p>
              </div>

              <Input
                label="Razorpay Key ID"
                mono
                placeholder="rzp_test_..."
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
              />
              <Input
                label="Razorpay Key Secret"
                mono
                secret
                placeholder="••••••••"
                value={razorpaySecret}
                onChange={(e) => setRazorpaySecret(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => setStep(1)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-display-l text-text-primary mb-2">
                  Notification channels
                </h1>
                <p className="text-body-m text-text-secondary">
                  Optional — add API keys for recovery messages. Skip any you don&apos;t use.
                </p>
              </div>
              <Input label="WhatsApp API Key" mono secret placeholder="Optional" />
              <Input label="SMS API Key" mono secret placeholder="Optional" />
              <Input label="Email API Key" mono secret placeholder="Optional" />
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setStep(2)}>
                  Skip all
                </Button>
                <Button className="flex-1" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-display-l text-text-primary mb-2">
                  You&apos;re set
                </h1>
                <p className="text-body-m text-text-secondary">
                  Your dashboard will show live declines, agent decisions, and route intelligence
                  as they happen.
                </p>
              </div>
              <div className="bg-surface-800 border border-border rounded-card p-4 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <p className="font-display text-display-m text-text-primary">Pulse Ledger</p>
                  <p className="text-body-m text-text-tertiary mt-1">Live recovery feed</p>
                </div>
              </div>
              <Button className="w-full" onClick={completeOnboarding}>
                Go to dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
