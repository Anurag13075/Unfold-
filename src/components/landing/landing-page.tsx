"use client";

import { LandingThemeProvider } from "./theme-provider";
import { LandingNav } from "./landing-nav";
import { HeroSection } from "./hero-section";
import { ProblemSection } from "./problem-section";
import { HowItWorksSection } from "./how-it-works-section";
import { CapabilitiesBento } from "./capabilities-bento";
import { RouteIntelligenceSpotlight } from "./route-intelligence-spotlight";
import { ProofBand } from "./proof-band";
import { FAQSection } from "./faq-section";
import { FinalCTA } from "./final-cta";
import { LandingFooter } from "./landing-footer";

export function LandingPageContent() {
  return (
    <LandingThemeProvider>
      <LandingNav />
      <main className="relative z-[2]">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <CapabilitiesBento />
        <RouteIntelligenceSpotlight />
        <ProofBand />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </LandingThemeProvider>
  );
}
