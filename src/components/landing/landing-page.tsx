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
      <div className="relative min-h-screen bg-[var(--ink-950)] text-[var(--text-primary)] overflow-x-hidden transition-colors duration-300">
        {/* Full landing page background image container */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-85 dark:opacity-90 transition-opacity duration-500"
          style={{
            backgroundImage: "url('/landing-bg.png')",
          }}
        />
        {/* Theme-aware background overlay to ensure legibility and clean contrast in both light and dark mode */}
        <div className="fixed inset-0 z-0 bg-[var(--ink-950)]/30 dark:bg-[var(--ink-950)]/50 pointer-events-none transition-colors duration-300" />

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
