"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConvergingSignals } from "@/components/illustrations/signal-lines";
import { ScrollReveal } from "./scroll-reveal";

export function RouteIntelligenceSpotlight() {
  return (
    <section className="border-t border-border bg-ink-900 py-20 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal className="relative order-2 md:order-1">
            <div
              className="absolute -inset-8 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(53,208,166,0.07) 0%, transparent 70%)",
              }}
            />
            <ConvergingSignals className="w-full max-w-md mx-auto rounded-card border border-border" />
          </ScrollReveal>

          <ScrollReveal className="order-1 md:order-2" delay={80}>
            <p className="text-body-s uppercase tracking-wide text-text-secondary mb-3">
              Route Intelligence
            </p>
            <h2 className="font-display text-display-l text-text-primary mb-4">
              See which corridor is bleeding before it costs you a quarter
            </h2>
            <p className="text-body-l text-text-secondary mb-8 max-w-lg">
              Every failure is two signals: a transaction to save, and a data point about system
              health. Undrop clusters the second one live — issuer, method, error code — and surfaces
              a recommended route fix you can push to Smart Router.
            </p>
            <Link href="/sign-up">
              <Button variant="ghost">Start with Route Intelligence</Button>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
