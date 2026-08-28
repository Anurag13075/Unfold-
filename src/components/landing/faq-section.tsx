"use client";

import { useState, useRef, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./scroll-reveal";

const faqs = [
  {
    q: "What data is real vs. simulated?",
    a: "Razorpay webhook ingestion, decline codes, and API key encryption are real. The dashboard seed data and synthetic event simulator replay NPCI-aligned decline distributions (~80% business / 20% technical) with injected clusters so Route Intelligence has meaningful signal during demos.",
  },
  {
    q: "Does Route Intelligence act automatically?",
    a: "No — and that's intentional. Undrop recommends a route fix (e.g., 'Push HDFC UPI Intent to backup acquirer'). A human approves it via the ghost 'Push to Smart Router' action. The agent recovers individual transactions; route fixes stay in ops control.",
  },
  {
    q: "What happens to connected API keys?",
    a: "Razorpay key ID and secret are AES-256-GCM encrypted before touching the database. They're decrypted only server-side at the point of use. After entry, you see a masked value (rzp_test_••••••••3f2a) with a rotate action — the secret is never round-tripped to the client.",
  },
  {
    q: "What Razorpay problem does this address?",
    a: "Track 3 — AI Revenue Recovery. Undrop plugs into payment.failed webhooks, Smart Router corridors, and merchant notification channels. It's built for merchants who treat every failure as both a transaction to save and a signal about route health — the angle Razorpay's own Optimizer team would recognize.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-border py-20 md:py-32">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <h2 className="font-display text-display-l text-text-primary mb-12 text-center">
            Questions
          </h2>
        </ScrollReveal>
        <div className="max-w-[720px] mx-auto divide-y divide-border">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left focus-ring rounded-btn"
        aria-expanded={open}
      >
        <span className="text-body-l text-text-primary pr-4">{question}</span>
        <CaretDown
          size={20}
          weight="thin"
          className={cn(
            "text-text-tertiary shrink-0 transition-transform duration-200 ease-out",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className="overflow-hidden transition-[height] duration-200 ease-out"
        style={{ height }}
      >
        <div ref={contentRef} className="pb-5">
          <p className="text-body-m text-text-secondary">{answer}</p>
        </div>
      </div>
    </div>
  );
}
