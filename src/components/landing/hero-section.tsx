"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { OscilloscopeHero } from "@/components/illustrations/oscilloscope";
import { TickerTeaser } from "./ticker-teaser";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const onScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = vh;
      const progress = Math.min(scrolled / maxScroll, 1);
      setParallaxY(progress * vh * 0.4);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[90vh]">
      <div className="max-w-container mx-auto px-4 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32 relative z-10">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <h1 className="font-display text-display-xl text-text-primary max-w-2xl">
              Most failed payments aren&apos;t lost. They&apos;re recoverable.
            </h1>
            <p className="mt-6 text-body-l text-text-secondary max-w-lg">
              Undrop reads the pattern across failures in real time, tells you which route
              is bleeding money right now, and closes the loop by recovering each transaction.
            </p>
            <div className="mt-8">
              <TickerTeaser />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/sign-up">
                <Button>Start recovering revenue</Button>
              </Link>
              <button className="text-body-m text-text-secondary hover:text-text-primary transition-colors underline-offset-4 hover:underline">
                Watch the 90-second demo
              </button>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div
              ref={imageRef}
              className="absolute -right-1/4 top-1/2 w-[140%] hidden md:block will-change-transform"
              style={{ transform: `translateY(calc(-50% + ${parallaxY}px))` }}
            >
              <OscilloscopeHero className="w-full h-auto rounded-card" />
            </div>
            <div className="md:hidden">
              <OscilloscopeHero className="w-full h-auto rounded-card" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-scroll-cue">
        <svg width="48" height="16" viewBox="0 0 48 16" aria-hidden>
          <path
            d="M 4 8 L 20 8 L 24 4 L 28 12 L 32 8 L 44 8"
            stroke="var(--pulse-500)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <CaretDown size={16} weight="thin" className="text-text-tertiary" />
      </div>
    </section>
  );
}
