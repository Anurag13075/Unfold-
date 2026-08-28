"use client";

import { CountUp } from "./count-up";
import { ProblemBackground } from "@/components/illustrations/signal-lines";
import { ScrollReveal } from "./scroll-reveal";

export function ProblemSection() {
  return (
    <section className="relative py-30 md:py-40 overflow-hidden border-t border-border">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <ProblemBackground className="w-full h-full object-cover" />
      </div>
      <div className="max-w-container mx-auto px-4 md:px-8 relative z-10 text-center">
        <ScrollReveal>
          <p className="font-display text-display-xl text-text-primary">
            <CountUp end={80} suffix="%" /> recoverable
          </p>
          <p className="mt-6 text-body-l text-text-secondary max-w-xl mx-auto">
            Per NPCI&apos;s breakdown, roughly 80% of failed digital transactions in India are
            business decline — wrong PIN, insufficient balance, limit breaches — not fraud.
            That revenue isn&apos;t gone. It&apos;s waiting for the right retry, route, or nudge.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
