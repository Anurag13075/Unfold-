"use client";

import { useEffect, useRef, useState } from "react";
import { Waveform } from "@/components/waveform/waveform";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Failure detected",
    body: "A Razorpay webhook arrives — payment.failed with a real decline code. Undrop ingests it instantly and classifies business vs. technical decline.",
    status: "declined" as const,
    animate: false,
  },
  {
    title: "Agent intervenes",
    body: "The recovery agent analyzes issuer, method, amount, and history. It produces a typed decision — retry now, retry delayed, suggest alt method, or escalate — with plain-English reasoning.",
    status: "recovering" as const,
    animate: false,
  },
  {
    title: "Revenue recovered",
    body: "The transaction resolves. A channel-accurate recovery message goes out. The waveform peaks. GMV lands back in your ledger — and the failure becomes a data point for route intelligence.",
    status: "recovered" as const,
    animate: true,
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const sectionHeight = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(scrolled / sectionHeight, 0.999);
      const step = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
      setActiveStep(step);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, reducedMotion]);

  if (isMobile || reducedMotion) {
    return (
      <section id="how-it-works" className="border-t border-border bg-ink-900 py-20 md:py-32">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3">How it works</p>
          <h2 className="font-display text-display-l text-text-primary mb-16">
            From flatline to recovered beat
          </h2>
          <div className="space-y-16">
            {steps.map((step, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-surface-800 border border-border rounded-card p-8 flex items-center justify-center min-h-[160px]">
                  <Waveform status={step.status} width={280} height={80} animate={step.animate} />
                </div>
                <div>
                  <p className="text-body-s uppercase tracking-wide text-text-secondary mb-2">
                    Step {i + 1}
                  </p>
                  <h3 className="font-display text-display-m text-text-primary mb-3">{step.title}</h3>
                  <p className="text-body-l text-text-secondary">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="how-it-works" ref={sectionRef} className="relative border-t border-border bg-ink-900" style={{ height: "210vh" }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-container mx-auto px-4 md:px-8 w-full">
          <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3">How it works</p>
          <h2 className="font-display text-display-l text-text-primary mb-12">
            From flatline to recovered beat
          </h2>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="bg-surface-800 border border-border rounded-card p-10 flex items-center justify-center min-h-[280px]">
              <Waveform
                key={activeStep}
                status={steps[activeStep].status}
                width={360}
                height={100}
                animate={steps[activeStep].animate}
              />
            </div>
            <div className="space-y-10">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    "transition-opacity duration-200",
                    activeStep === i ? "opacity-100" : "opacity-40"
                  )}
                >
                  <p
                    className={cn(
                      "text-body-s uppercase tracking-wide mb-2 transition-colors duration-200",
                      activeStep === i ? "text-text-secondary" : "text-text-tertiary"
                    )}
                  >
                    Step {i + 1}
                  </p>
                  <h3
                    className={cn(
                      "font-display text-display-m mb-2 transition-colors duration-200",
                      activeStep === i ? "text-text-primary" : "text-text-tertiary"
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "text-body-l transition-colors duration-200",
                      activeStep === i ? "text-text-secondary" : "text-text-tertiary"
                    )}
                  >
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
