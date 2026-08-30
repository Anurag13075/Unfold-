"use client";

import { LandingThemeProvider } from "./theme-provider";
import { LandingNav } from "./landing-nav";
import { HeroSection } from "./hero-section";
import { ProblemSection } from "./problem-section";
import { HowItWorksSection } from "./how-it-works-section";
import { AutonomousRecoveryLifecycle } from "./autonomous-recovery-lifecycle";
import { CapabilitiesBento } from "./capabilities-bento";
import { RouteIntelligenceSpotlight } from "./route-intelligence-spotlight";
import { ProofBand } from "./proof-band";
import { FAQSection } from "./faq-section";
import { FinalCTA } from "./final-cta";
import { LandingFooter } from "./landing-footer";

export function LandingPageContent() {
  return (
    <LandingThemeProvider>
      <div className="relative min-h-screen bg-[var(--ink-950)] text-[var(--text-primary)] overflow-x-hidden">
        <div className="relative z-10 flex flex-col min-h-screen">
          <LandingNav />
          <main className="flex-1 relative">
            <HeroSection />
            <ProblemSection />
            <HowItWorksSection />
            <AutonomousRecoveryLifecycle />
            <CapabilitiesBento />
            <RouteIntelligenceSpotlight />
            <ProofBand />
            <FAQSection />
            <FinalCTA />
          </main>
          <LandingFooter />
        </div>
      </div>
    </LandingThemeProvider>
  );
}
