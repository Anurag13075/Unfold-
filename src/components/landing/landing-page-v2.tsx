"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bank,
  BellRinging,
  CheckCircle,
  ClockCountdown,
  Command,
  FlowArrow,
  Gauge,
  LockKey,
  PaperPlaneTilt,
  Path,
  ShieldCheck,
  Sparkle,
  TrendUp,
  Warning,
} from "@phosphor-icons/react";
import { Wordmark } from "@/components/brand/wordmark";

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease } },
};

function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[.08] bg-[#07090c]/72 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-18 max-w-[1240px] items-center justify-between px-5 sm:h-[76px] sm:px-8">
        <Link href="/" aria-label="Undrop home">
          <Wordmark className="h-7 w-[120px] text-white" />
        </Link>
        <div className="hidden items-center gap-7 text-sm text-white/56 md:flex">
          <a href="#copilot" className="transition hover:text-white">Ask Undrop</a>
          <a href="#recovery" className="transition hover:text-white">Recovery</a>
          <a href="#routes" className="transition hover:text-white">Routes</a>
          <a href="#trust" className="transition hover:text-white">Trust</a>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link href="/sign-in" className="hidden text-white/66 transition hover:text-white sm:block">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-10 items-center rounded-full bg-[#b8ff66] px-4 text-[#10130d] shadow-[0_0_34px_rgba(184,255,102,.22)] transition hover:-translate-y-0.5 hover:bg-[#d7ffa9]"
          >
            Start demo <ArrowRight className="ml-1.5" size={15} weight="bold" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[96svh] overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-[.22] mix-blend-screen"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.12),#07090c_88%),linear-gradient(115deg,rgba(184,255,102,.18),transparent_32%,rgba(122,146,255,.13)_68%,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-[1240px]">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08 }}
          className="mx-auto max-w-[960px] text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[.12] bg-white/[.055] px-3 py-1.5 text-xs text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b8ff66]" />
            Now with confirmed copilot actions for live recovery ops
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-display text-7xl font-medium leading-none text-white sm:text-8xl lg:text-9xl"
          >
            Undrop
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-[760px] text-base leading-7 text-white/64 sm:text-xl sm:leading-8"
          >
            An AI recovery cockpit for Razorpay merchants. Ask what is leaking, confirm the next action, resend recovery messages, update transaction status, and keep every decision traceable.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center rounded-full bg-[#b8ff66] px-5 text-sm font-semibold text-[#10130d] transition hover:-translate-y-0.5 hover:bg-[#d7ffa9]"
            >
              Launch cockpit <ArrowRight className="ml-1.5" size={16} weight="bold" />
            </Link>
            <a
              href="#copilot"
              className="inline-flex h-12 items-center rounded-full border border-white/[.17] bg-white/[.035] px-5 text-sm font-medium text-white/78 backdrop-blur transition hover:border-white/35 hover:bg-white/[.07]"
            >
              See Ask Undrop
            </a>
          </motion.div>
        </motion.div>
        <HeroCockpit />
      </div>
    </section>
  );
}

function HeroCockpit() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 42, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.25, ease }}
      className="relative mx-auto mt-14 max-w-[1140px] rounded-[8px] border border-white/[.12] bg-[#0b0f15]/88 p-2 shadow-[0_45px_120px_rgba(0,0,0,.62)] backdrop-blur-2xl"
    >
      <div className="overflow-hidden rounded-[6px] border border-white/[.08] bg-[#090c11]">
        <div className="grid h-11 grid-cols-[1fr_auto_1fr] items-center border-b border-white/[.08] px-4">
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff6b70]" />
            <span className="h-2 w-2 rounded-full bg-[#ffc45c]" />
            <span className="h-2 w-2 rounded-full bg-[#b8ff66]" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/38">live recovery command center</p>
        </div>
        <div className="grid min-h-[460px] grid-cols-1 lg:grid-cols-[230px_1fr_330px]">
          <aside className="hidden border-r border-white/[.08] p-4 lg:block">
            <p className="mb-6 text-xs font-semibold text-white">Workspace</p>
            {["Pulse Ledger", "Ask Undrop", "Route Intelligence", "Outreach Trace"].map((item, i) => (
              <div
                key={item}
                className={`mb-1 rounded-[7px] px-3 py-2.5 text-xs ${i === 1 ? "bg-[#b8ff66] text-[#10130d]" : "text-white/42"}`}
              >
                {item}
              </div>
            ))}
            <div className="mt-8 rounded-[8px] border border-white/[.08] bg-white/[.035] p-3">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/30">Today</p>
              <p className="mt-3 text-2xl font-medium text-white">44.4%</p>
              <p className="mt-1 text-xs text-white/42">Recovery rate</p>
            </div>
          </aside>

          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-white/42">Ask Undrop</p>
                <h2 className="mt-1 text-2xl font-medium leading-tight text-white">Natural language, real payment actions.</h2>
              </div>
              <span className="rounded-full border border-[#b8ff66]/25 bg-[#b8ff66]/10 px-3 py-1.5 text-xs text-[#cfff97]">
                Confirmation required
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <ChatLine side="right">Resend WhatsApp recovery for txn_demo_7</ChatLine>
              <ChatLine side="left" warning>
                I will resend a WhatsApp recovery message for Acme Store&apos;s INR 1,499 declined transaction. The recipient will come from the stored customer phone number. Confirm this action?
              </ChatLine>
              <div className="ml-0 flex gap-2 sm:ml-12">
                <span className="rounded-full bg-[#b8ff66] px-3 py-1.5 text-xs font-semibold text-[#10130d]">Confirm</span>
                <span className="rounded-full border border-white/[.12] px-3 py-1.5 text-xs text-white/58">Cancel</span>
              </div>
              <ChatLine side="right">Confirm</ChatLine>
              <ChatLine side="left">
                Resent WhatsApp recovery for txn_demo_7 via Twilio simulation. Audit entry written.
              </ChatLine>
            </div>
          </div>

          <aside className="border-t border-white/[.08] p-5 lg:border-l lg:border-t-0">
            <p className="text-xs uppercase tracking-[.16em] text-white/35">live state</p>
            <div className="mt-5 space-y-3">
              <HeroMetric label="Recovered GMV" value="INR 1.4K" tone="pulse" />
              <HeroMetric label="At-risk txns" value="5 open" tone="ember" />
              <HeroMetric label="Tool audit" value="100%" tone="blue" />
            </div>
            <div className="mt-5 rounded-[8px] border border-[#ffc45c]/20 bg-[#ffc45c]/[.07] p-4">
              <Warning className="text-[#ffc45c]" size={20} weight="fill" />
              <p className="mt-4 text-sm leading-5 text-white/86">No action executes on the request turn.</p>
              <p className="mt-3 text-xs leading-5 text-white/45">Ask Undrop stores one pending action, asks for confirmation, then logs the confirmed execution.</p>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}

function ChatLine({ side, children, warning }: { side: "left" | "right"; children: string; warning?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease }}
      className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}
    >
      <p
        className={`max-w-[86%] rounded-[8px] px-3 py-2 text-sm leading-6 ${
          side === "right"
            ? "bg-[#b8ff66] text-[#10130d]"
            : warning
              ? "border border-[#ffc45c]/35 bg-[#ffc45c]/10 text-white/88"
              : "border border-white/[.09] bg-white/[.04] text-white/72"
        }`}
      >
        {children}
      </p>
    </motion.div>
  );
}

function HeroMetric({ label, value, tone }: { label: string; value: string; tone: "pulse" | "ember" | "blue" }) {
  const toneClass = tone === "pulse" ? "text-[#b8ff66]" : tone === "ember" ? "text-[#ffc45c]" : "text-[#8ea2ff]";
  return (
    <div className="rounded-[8px] border border-white/[.08] bg-white/[.035] p-3">
      <p className="text-[10px] uppercase tracking-[.12em] text-white/32">{label}</p>
      <p className={`mt-2 text-lg font-medium ${toneClass}`}>{value}</p>
    </div>
  );
}

function BrandStrip() {
  return (
    <section className="border-y border-white/[.09] py-6 text-center">
      <p className="text-xs text-white/36">Built for payment teams that care about every failed checkout, every route, and every customer retry.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-7 text-sm font-semibold text-white/36 sm:gap-12">
        <span>Razorpay</span>
        <span>UPI</span>
        <span>Cards</span>
        <span>WhatsApp</span>
        <span>Supabase</span>
      </div>
    </section>
  );
}

function CopilotSection() {
  const actions = [
    {
      icon: PaperPlaneTilt,
      title: "Resend recovery messages",
      body: "Ask Undrop can trigger email, SMS, WhatsApp, or Telegram recovery through the existing outreach providers.",
    },
    {
      icon: Command,
      title: "Update transaction status",
      body: "Mark a transaction recovered or escalated only after the merchant explicitly confirms the pending action.",
    },
    {
      icon: ShieldCheck,
      title: "Confirm before execution",
      body: "Every tool call becomes a plain-language consequence summary with real transaction data before it runs.",
    },
  ];

  return (
    <section id="copilot" className="py-24 sm:py-32">
      <div className="mb-10 grid gap-6 md:grid-cols-[.9fr_1.1fr] md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[.16em] text-[#b8ff66]">Ask Undrop</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-none text-white sm:text-6xl">
            A copilot that can act, with a human checkpoint.
          </h2>
        </div>
        <p className="max-w-[520px] text-base leading-7 text-white/55">
          The new tool-calling flow turns natural language into real recovery actions without letting a model send messages or mutate records unchecked.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.article
              key={action.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.07, ease }}
              className="group min-h-[260px] rounded-[8px] border border-white/[.1] bg-white/[.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition hover:-translate-y-1 hover:border-[#b8ff66]/35 hover:bg-white/[.055]"
            >
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#b8ff66]/10 text-[#b8ff66]">
                    <Icon size={21} weight="duotone" />
                  </span>
                  <ArrowRight size={17} className="text-white/24 transition group-hover:translate-x-1 group-hover:text-[#b8ff66]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">{action.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/52">{action.body}</p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function RecoveryFlowSection() {
  const steps = [
    ["01", "Capture", "Razorpay failures and simulator events land in the Pulse Ledger with issuer, method, customer, and decline context."],
    ["02", "Reason", "GroqCloud or Cerebras summarizes the situation while deterministic rules keep the demo resilient."],
    ["03", "Confirm", "External actions pause as a pending confirmation with real amounts, channels, and transaction IDs."],
    ["04", "Recover", "The executor calls stored outreach configs, updates status, and writes an audit trace."],
  ];

  return (
    <section id="recovery" className="my-20 rounded-[8px] bg-[#b8ff66] px-5 py-16 text-[#10130d] sm:px-10 sm:py-20">
      <div className="grid gap-10 md:grid-cols-[.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.15em] text-[#49691f]">Recovery loop</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-none sm:text-6xl">
            Every failed payment gets a better next move.
          </h2>
        </div>
        <div className="grid gap-3">
          {steps.map(([num, title, body], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45, ease }}
              className="grid grid-cols-[56px_1fr] gap-4 rounded-[8px] border border-[#10130d]/12 bg-[#10130d]/[.045] p-4"
            >
              <span className="font-mono text-xs text-[#10130d]/55">{num}</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-5 text-[#10130d]/64">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoutesSection() {
  return (
    <section id="routes" className="grid gap-10 py-20 md:grid-cols-[.85fr_1.15fr] md:items-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-[.16em] text-[#b8ff66]">Route intelligence</p>
        <h2 className="mt-4 font-display text-4xl font-medium leading-none text-white sm:text-6xl">
          Payment failures become route signals, not buried rows.
        </h2>
        <p className="mt-6 max-w-[500px] text-base leading-7 text-white/55">
          Undrop clusters failures by issuer, method, and error code so the team can see degraded corridors before they quietly drain GMV.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="rounded-[8px] border border-white/[.1] bg-[#0d1118] p-4"
      >
        {[
          ["HDFC UPI Intent", 86, "critical", "4.3x baseline"],
          ["ICICI Card 3DS", 62, "high", "2.1x baseline"],
          ["SBI Netbanking", 44, "medium", "1.6x baseline"],
          ["Axis UPI Collect", 28, "watching", "near normal"],
        ].map(([row, width, severity, detail], index) => (
          <div key={row} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/[.07] py-4 last:border-b-0">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">{row}</p>
                <span className="rounded-full bg-white/[.055] px-2 py-0.5 font-mono text-[10px] text-white/42">{severity}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[.06]">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: `${width}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.09, duration: 0.6, ease }}
                  className="block h-full rounded-full bg-gradient-to-r from-[#ff6b70] via-[#ffc45c] to-[#b8ff66]"
                />
              </div>
            </div>
            <span className="font-mono text-xs text-white/50">{detail}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    { icon: Gauge, title: "Live GMV readout", body: "Recovered GMV, recovery rate, and at-risk payments stay visible in the cockpit." },
    { icon: BellRinging, title: "Real outreach paths", body: "Email, SMS, WhatsApp, Telegram, and webhook integrations use stored merchant config." },
    { icon: Bank, title: "Smart Router ready", body: "Route clusters can become exportable route recommendations when router dependencies are enabled." },
    { icon: ClockCountdown, title: "Retry timing", body: "Recovery decisions can delay, retry, suggest alternatives, or escalate based on the failure signal." },
    { icon: FlowArrow, title: "Closed loop", body: "Every payment outcome informs the next recovery decision and report view." },
    { icon: LockKey, title: "Credential care", body: "Provider keys are stored encrypted and resolved server-side before dispatch." },
  ];

  return (
    <section className="py-20">
      <div className="mb-10 max-w-[720px]">
        <p className="text-xs font-medium uppercase tracking-[.16em] text-[#b8ff66]">Product surfaces</p>
        <h2 className="mt-4 font-display text-4xl font-medium leading-none text-white sm:text-6xl">
          Beautiful enough to demo. Concrete enough to operate.
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.04, ease }}
              className="min-h-[210px] rounded-[8px] border border-white/[.1] bg-white/[.035] p-5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-white/[.07] text-[#b8ff66]">
                <Icon size={20} weight="duotone" />
              </span>
              <h3 className="mt-8 text-lg font-medium text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/52">{feature.body}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function TrustSection() {
  const checks = [
    "No tool executes on the same turn it is requested.",
    "Unknown transaction IDs are refused before execution.",
    "Recipients come from stored transaction data, not model text.",
    "Executed tools are written to the agent action audit trail.",
  ];

  return (
    <section id="trust" className="grid gap-8 border-y border-white/[.1] py-20 md:grid-cols-3 md:items-center">
      <div className="md:col-span-2">
        <div className="inline-grid h-11 w-11 place-items-center rounded-[8px] border border-white/[.12] text-[#b8ff66]">
          <ShieldCheck size={22} weight="duotone" />
        </div>
        <h2 className="mt-6 font-display text-4xl font-medium leading-none text-white sm:text-6xl">
          Safe enough for live judging.
        </h2>
      </div>
      <div className="space-y-3">
        {checks.map((check) => (
          <div key={check} className="flex gap-3 rounded-[8px] border border-white/[.08] bg-white/[.035] p-3 text-sm leading-5 text-white/62">
            <CheckCircle size={17} weight="fill" className="mt-0.5 shrink-0 text-[#b8ff66]" />
            <span>{check}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="py-24 text-center sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease }}
        className="mx-auto max-w-[860px]"
      >
        <p className="text-xs font-medium uppercase tracking-[.16em] text-[#b8ff66]">Buildathon ready</p>
        <h2 className="mt-4 font-display text-5xl font-medium leading-none text-white sm:text-7xl">
          Recover the payment. Explain the decision. Prove the outcome.
        </h2>
        <p className="mx-auto mt-6 max-w-[600px] text-base leading-7 text-white/55">
          Undrop turns failed Razorpay payments into an operator-grade recovery workflow with copilot actions, route intelligence, outreach, and auditability.
        </p>
        <Link
          href="/sign-up"
          className="mt-9 inline-flex h-12 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#10130d] transition hover:-translate-y-0.5 hover:bg-[#b8ff66]"
        >
          Open Undrop <ArrowRight className="ml-1.5" size={16} weight="bold" />
        </Link>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col gap-6 border-t border-white/[.1] py-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
      <Wordmark className="h-6 w-[104px] text-white/80" />
      <p>2026 Undrop. Recovery, with intent.</p>
      <div className="flex gap-5">
        <a href="#" className="hover:text-white">Privacy</a>
        <a href="#" className="hover:text-white">Terms</a>
        <Link href="/sign-in" className="hover:text-white">Sign in</Link>
      </div>
    </footer>
  );
}

export function LandingPageV2() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07090c] text-[#f7f6f1] selection:bg-[#b8ff66] selection:text-[#10130d]">
      <LandingNav />
      <Hero />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <BrandStrip />
        <CopilotSection />
        <RecoveryFlowSection />
        <RoutesSection />
        <FeatureGrid />
        <TrustSection />
        <ClosingCta />
        <Footer />
      </div>
    </main>
  );
}
