"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OscilloscopeHero } from "@/components/illustrations/oscilloscope";
import { ScrollReveal } from "./scroll-reveal";

export function FinalCTA() {
  return (
    <section className="border-t border-border py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-display-l text-text-primary max-w-lg">
                Stop treating failures as lost revenue. Start reading them as signals.
              </h2>
              <p className="mt-4 text-body-l text-text-secondary max-w-md">
                Connect your Razorpay test account and see declines resolve in your Pulse Ledger
                within minutes.
              </p>
              <Link href="/sign-up" className="inline-block mt-8">
                <Button>Start recovering revenue</Button>
              </Link>
            </div>
            <div className="relative h-48 md:h-64 overflow-hidden rounded-card">
              <OscilloscopeHero className="absolute inset-0 w-full h-full object-cover opacity-80" quiet />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
