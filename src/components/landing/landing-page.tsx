"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bank,
  BellRinging,
  Check,
  ChartLineUp,
  ClockCountdown,
  FlowArrow,
  Gauge,
  Lightning,
  LockKey,
  ShieldCheck,
  Sparkle,
  Stack,
  TrendUp,
} from "@phosphor-icons/react";
import { Wordmark } from "@/components/brand/wordmark";

const rise = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

function PremiumNav() {
  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[.08] bg-[#07090c]/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Undrop home">
          <Wordmark className="h-7 w-[120px] text-white" />
        </Link>
        <div className="hidden items-center gap-7 text-sm text-white/55 md:flex">
          {["Product", "Signals", "Automation", "Security"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-white">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link href="/sign-in" className="hidden text-white/65 transition hover:text-white sm:block">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center rounded-full bg-[#b8ff66] px-4 py-2.5 text-[#10130d] shadow-[0_0_34px_rgba(184,255,102,.25)] transition hover:-translate-y-0.5 hover:bg-[#d7ffa9]"
          >
            Start free <ArrowRight className="ml-1.5" size={15} weight="bold" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function ImmersiveHero() {
  return (
    <section className="relative min-h-[94svh] overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-[.18] mix-blend-screen"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.2),#07090c_92%),radial-gradient(ellipse_at_50%_20%,rgba(184,255,102,.24),transparent_42%),radial-gradient(ellipse_at_75%_20%,rgba(122,146,255,.14),transparent_34%)]" />
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.55, 0.95, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[12%] top-[22%] hidden h-24 w-px bg-gradient-to-b from-transparent via-[#b8ff66] to-transparent md:block"
      />
      <motion.div
        animate={{ y: [0, 14, 0], opacity: [0.35, 0.85, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[18%] top-[34%] hidden h-28 w-px bg-gradient-to-b from-transparent via-[#7a92ff] to-transparent md:block"
      />
      <div className="relative mx-auto max-w-[1240px]">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.09 }} className="mx-auto max-w-[920px] text-center">
          <motion.div variants={rise} className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[.12] bg-white/[.055] px-3 py-1.5 text-xs text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b8ff66]" />
            Razorpay recovery intelligence for modern merchants
          </motion.div>
          <motion.h1 variants={rise} className="font-display text-[clamp(4.2rem,13vw,10.8rem)] font-medium leading-[.78] text-white">
            Undrop
          </motion.h1>
          <motion.p variants={rise} className="mx-auto mt-8 max-w-[690px] text-base leading-7 text-white/62 sm:text-xl sm:leading-8">
            A real-time recovery cockpit that detects failed-payment patterns, chooses the right next action, and wins back revenue before your team opens a spreadsheet.
          </motion.p>
          <motion.div variants={rise} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/sign-up" className="inline-flex items-center rounded-full bg-[#b8ff66] px-5 py-3 text-sm font-semibold text-[#10130d] transition hover:-translate-y-0.5 hover:bg-[#d7ffa9]">
              Launch recovery cockpit <ArrowRight className="ml-1.5" size={16} weight="bold" />
            </Link>
            <a href="#product" className="rounded-full border border-white/[.17] bg-white/[.035] px-5 py-3 text-sm font-medium text-white/78 backdrop-blur transition hover:border-white/35 hover:bg-white/[.07]">
              Explore product
            </a>
          </motion.div>
        </motion.div>
        <HeroConsole />
      </div>
    </section>
  );
}

function HeroConsole() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 42, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-14 max-w-[1120px] rounded-[8px] border border-white/[.12] bg-[#0b0f15]/86 p-2 shadow-[0_45px_120px_rgba(0,0,0,.6)] backdrop-blur-2xl"
    >
      <div className="absolute -inset-x-8 -bottom-10 -z-10 h-28 bg-[#b8ff66]/14 blur-[70px]" />
      <div className="overflow-hidden rounded-[6px] border border-white/[.08] bg-[#090c11]">
        <div className="grid h-11 grid-cols-[1fr_auto_1fr] items-center border-b border-white/[.08] px-4">
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff6b70]" />
            <span className="h-2 w-2 rounded-full bg-[#ffc45c]" />
            <span className="h-2 w-2 rounded-full bg-[#b8ff66]" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/35">live recovery cockpit</p>
        </div>
        <div className="grid min-h-[430px] grid-cols-1 lg:grid-cols-[220px_1fr_310px]">
          <aside className="hidden border-r border-white/[.08] p-4 lg:block">
            <p className="mb-6 text-xs font-semibold text-white">Workspace</p>
            {["Pulse Ledger", "Route Intelligence", "Customer Outreach", "Recovery Reports"].map((item, i) => (
              <div key={item} className={`mb-1 rounded-[7px] px-3 py-2.5 text-xs ${i === 0 ? "bg-[#b8ff66] text-[#10130d]" : "text-white/40"}`}>{item}</div>
            ))}
          </aside>
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-white/40">Today at 10:42</p>
                <h2 className="mt-1 text-2xl font-medium leading-tight text-white">At-risk revenue is compressing.</h2>
              </div>
              <span className="rounded-full border border-[#b8ff66]/25 bg-[#b8ff66]/10 px-3 py-1.5 text-xs text-[#cfff97]">31 recoveries in flight</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <HeroMetric label="Recovered" value="INR 84.2K" delta="+18.2%" />
              <HeroMetric label="Avoided loss" value="INR 1.42L" delta="12 routes" />
              <HeroMetric label="Lift" value="31.8%" delta="+5.4 pts" />
            </div>
            <div className="mt-5 rounded-[8px] border border-white/[.08] bg-white/[.025] p-4">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Recovery performance</span>
                <span className="text-[#b8ff66]">last 7 days</span>
              </div>
              <div className="mt-5 flex h-32 items-end gap-2">
                {[34, 42, 38, 67, 50, 74, 92, 70, 86, 100, 78, 92, 96, 88].map((h, i) => (
                  <motion.i key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: 0.25 + i * 0.03, duration: 0.45 }} className="block flex-1 rounded-t-[3px] bg-gradient-to-t from-[#5da92b] to-[#d7ffa9]" />
                ))}
              </div>
            </div>
          </div>
          <aside className="border-t border-white/[.08] p-5 lg:border-l lg:border-t-0">
            <p className="text-xs uppercase tracking-[.16em] text-white/35">active signal</p>
            <div className="mt-5 rounded-[8px] border border-[#b8ff66]/22 bg-[#b8ff66]/[.07] p-4">
              <Sparkle className="text-[#b8ff66]" size={20} weight="fill" />
              <p className="mt-4 text-sm leading-5 text-white/86">HDFC UPI Intent failures are 4.3x above baseline.</p>
              <p className="mt-3 text-xs leading-5 text-white/45">Undrop paused retries for low-intent cohorts and moved high-intent customers to a later window.</p>
            </div>
            <div className="mt-4 space-y-2">
              {["Detect issuer drift", "Score recoverability", "Dispatch next action"].map((item, i) => (
                <motion.div key={item} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 + i * 0.08 }} className="flex items-center gap-2 rounded-[7px] bg-white/[.035] px-3 py-2 text-xs text-white/62">
                  <Check size={13} weight="bold" className="text-[#b8ff66]" /> {item}
                </motion.div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}

function HeroMetric({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-[8px] border border-white/[.08] bg-white/[.025] p-3">
      <p className="text-[10px] text-white/40">{label}</p>
      <p className="mt-2 text-sm font-medium text-white sm:text-base">{value}</p>
      <p className="mt-1 text-[10px] text-[#b8ff66]">{delta}</p>
    </div>
  );
}

function BentoProof() {
  const cards = [
    { icon: Gauge, title: "Failure intelligence", body: "Issuer, method, route, and customer intent in one readable signal.", className: "md:col-span-5" },
    { icon: ClockCountdown, title: "Retry timing", body: "Undrop picks the recovery moment instead of hammering customers instantly.", className: "md:col-span-3" },
    { icon: BellRinging, title: "Multi-channel outreach", body: "Email, SMS, WhatsApp, Telegram, and webhook dispatch with traceable status.", className: "md:col-span-4" },
    { icon: Bank, title: "Route bypass", body: "Degraded payment corridors are isolated before they drag down every checkout.", className: "md:col-span-4" },
    { icon: FlowArrow, title: "Closed-loop automation", body: "Every failed attempt becomes a smarter next payment path.", className: "md:col-span-8" },
  ];
  return (
    <section id="product" className="py-24 sm:py-32">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-[650px]">
          <p className="text-xs font-medium uppercase tracking-[.16em] text-[#b8ff66]">Product system</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[.96] text-white sm:text-6xl">A recovery OS, not another alert dashboard.</h2>
        </div>
        <p className="max-w-[380px] text-sm leading-6 text-white/50">Built around decisions: what failed, why it matters, who to contact, and where the next attempt should go.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.48, delay: i * 0.05 }}
              className={`${card.className} group min-h-[210px] rounded-[8px] border border-white/[.1] bg-white/[.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition hover:-translate-y-1 hover:border-[#b8ff66]/35 hover:bg-white/[.055]`}
            >
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#b8ff66]/10 text-[#b8ff66]"><Icon size={20} weight="duotone" /></span>
                  <ArrowRight size={17} className="text-white/20 transition group-hover:translate-x-1 group-hover:text-[#b8ff66]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">{card.title}</h3>
                  <p className="mt-3 max-w-[460px] text-sm leading-6 text-white/50">{card.body}</p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function SignalTheater() {
  return (
    <section id="signals" className="grid gap-10 py-20 md:grid-cols-[.85fr_1.15fr] md:items-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-[.16em] text-[#b8ff66]">Signal theater</p>
        <h2 className="mt-4 font-display text-4xl font-medium leading-[.96] text-white sm:text-6xl">Watch the failure before it becomes a revenue leak.</h2>
        <p className="mt-6 max-w-[460px] text-base leading-7 text-white/55">The interface is designed for scanning: one live signal, a severity trail, affected corridors, and the exact action Undrop is taking.</p>
      </div>
      <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-[8px] border border-white/[.1] bg-[#0d1118] p-4">
        {["HDFC UPI Intent", "ICICI Card 3DS", "SBI Netbanking", "Axis UPI Collect"].map((row, i) => (
          <div key={row} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/[.07] py-4 last:border-b-0">
            <div>
              <p className="text-sm font-medium text-white">{row}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[.06]">
                <motion.span initial={{ width: 0 }} whileInView={{ width: `${[86, 62, 44, 28][i]}%` }} viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.6 }} className="block h-full rounded-full bg-gradient-to-r from-[#ff7a70] via-[#ffc45c] to-[#b8ff66]" />
              </div>
            </div>
            <span className="font-mono text-xs text-white/50">{[34.2, 18.6, 12.8, 8.1][i]}%</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function RecoveryLoop() {
  const steps = [
    ["01", "Detect", "Anomaly surfaces from issuer, route, and payment-method drift."],
    ["02", "Decide", "Recoverability score chooses retry, outreach, route bypass, or hold."],
    ["03", "Dispatch", "Customer receives the right recovery path on the strongest channel."],
    ["04", "Learn", "Outcome data feeds back into future timing and route decisions."],
  ];
  return (
    <section id="automation" className="my-20 rounded-[8px] bg-[#b8ff66] px-5 py-16 text-[#10130d] sm:px-10 sm:py-20">
      <div className="grid gap-10 md:grid-cols-[.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.15em] text-[#49691f]">Recovery loop</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[.96] sm:text-6xl">From failed payment to recovered GMV in one closed loop.</h2>
        </div>
        <div className="grid gap-3">
          {steps.map(([num, title, body], i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="grid grid-cols-[56px_1fr] gap-4 rounded-[8px] border border-[#10130d]/12 bg-[#10130d]/[.045] p-4">
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

function ChannelMatrix() {
  return (
    <section className="py-20">
      <div className="mb-10 max-w-[660px]">
        <p className="text-xs font-medium uppercase tracking-[.16em] text-[#b8ff66]">Recovery channels</p>
        <h2 className="mt-4 font-display text-4xl font-medium leading-[.96] text-white sm:text-6xl">Every customer gets the path most likely to work.</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {["Email", "SMS", "WhatsApp", "Webhook"].map((channel, i) => (
          <motion.div key={channel} whileHover={{ y: -6 }} className="rounded-[8px] border border-white/[.1] bg-white/[.035] p-5">
            <div className="mb-8 flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-white/[.07] text-[#b8ff66]"><Stack size={18} /></span>
              <span className="font-mono text-[10px] text-white/30">0{i + 1}</span>
            </div>
            <h3 className="text-lg font-medium text-white">{channel}</h3>
            <p className="mt-3 text-sm leading-6 text-white/50">Dispatch, track, and explain recovery messages from the same transaction record.</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SecurityLayer() {
  return (
    <section id="security" className="grid gap-8 border-y border-white/[.1] py-20 md:grid-cols-3 md:items-center">
      <div className="md:col-span-2">
        <div className="inline-grid h-11 w-11 place-items-center rounded-[8px] border border-white/[.12] text-[#b8ff66]"><LockKey size={22} weight="duotone" /></div>
        <h2 className="mt-6 font-display text-4xl font-medium leading-[.96] text-white sm:text-6xl">Secure by default. Explainable by design.</h2>
      </div>
      <p className="text-base leading-7 text-white/55">Every decision has an audit trail, every credential is treated as sensitive, and every recovery event is visible to the merchant team.</p>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="py-24 text-center sm:py-32">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-[820px]">
        <p className="text-xs font-medium uppercase tracking-[.16em] text-[#b8ff66]">Build submission ready</p>
        <h2 className="mt-4 font-display text-5xl font-medium leading-[.9] text-white sm:text-7xl">Make failed payments feel recoverable.</h2>
        <p className="mx-auto mt-6 max-w-[560px] text-base leading-7 text-white/55">Undrop turns Razorpay failure data into a living recovery product: signal, decision, action, proof.</p>
        <Link href="/sign-up" className="mt-9 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#10130d] transition hover:-translate-y-0.5 hover:bg-[#b8ff66]">
          Open the product <ArrowRight className="ml-1.5" size={16} weight="bold" />
        </Link>
      </motion.div>
    </section>
  );
}

function PremiumFooter() {
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

export function LandingPageContent() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07090c] text-[#f7f6f1] selection:bg-[#b8ff66] selection:text-[#10130d]">
      <PremiumNav />
      <ImmersiveHero />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <LogoStrip />
        <BentoProof />
        <SignalTheater />
        <RecoveryLoop />
        <ChannelMatrix />
        <SecurityLayer />
        <ClosingCta />
        <PremiumFooter />
      </div>
    </main>
  );
}

function Nav() { return <nav className="flex h-[82px] items-center justify-between border-b border-white/[.10]"><Link href="/" aria-label="Undrop home"><Wordmark className="h-7 w-[120px] text-white" /></Link><div className="hidden items-center gap-8 text-sm text-white/55 md:flex"><a href="#product" className="transition hover:text-white">Product</a><a href="#how-it-works" className="transition hover:text-white">How it works</a><a href="#security" className="transition hover:text-white">Security</a></div><div className="flex items-center gap-4 text-sm font-medium"><Link href="/sign-in" className="hidden text-white/70 transition hover:text-white sm:block">Sign in</Link><Link href="/sign-up" className="rounded-full bg-[#b5ff6d] px-4 py-2.5 text-[#11130e] transition hover:bg-[#d1ff9f]">Get started <ArrowRight className="ml-1 inline-block" size={14} weight="bold" /></Link></div></nav>; }

function Hero() { return <section className="relative pb-20 pt-20 sm:pb-28 sm:pt-28"><motion.div initial="hidden" animate="show" transition={{ staggerChildren: .1 }} className="mx-auto max-w-[830px] text-center"><motion.div variants={rise} className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b5ff6d]/25 bg-[#b5ff6d]/[.08] px-3 py-1.5 text-xs font-medium text-[#c7ff91]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b5ff6d]" />Built for teams on Razorpay</motion.div><motion.h1 variants={rise} className="font-display text-[clamp(3.2rem,8vw,6.6rem)] font-medium leading-[.91] tracking-[-.065em] text-white">Failed payments<br /><span className="text-[#b5ff6d]">don&apos;t have to stay failed.</span></motion.h1><motion.p variants={rise} className="mx-auto mt-7 max-w-[585px] text-base leading-7 text-white/60 sm:text-lg">Undrop notices revenue at risk, understands why it failed, and gives every customer the smartest possible path back to payment.</motion.p><motion.div variants={rise} className="mt-9 flex flex-wrap justify-center gap-3"><Link href="/sign-up" className="rounded-full bg-[#b5ff6d] px-5 py-3 text-sm font-semibold text-[#11130e] transition hover:-translate-y-0.5 hover:bg-[#d1ff9f]">Start recovering revenue <ArrowRight className="ml-1 inline-block" size={16} weight="bold" /></Link><a href="#product" className="rounded-full border border-white/[.18] px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/40 hover:bg-white/[.04]">See how it works</a></motion.div></motion.div><motion.div initial={{ opacity: 0, y: 34, scale: .98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: .8, delay: .25, ease: [0.16, 1, .3, 1] }} className="relative mx-auto mt-16 max-w-[1080px] rounded-[28px] border border-white/[.13] bg-[#10141b] p-2 shadow-[0_40px_90px_rgba(0,0,0,.48)]"><div className="absolute -inset-20 -z-10 bg-[#b5ff6d]/10 blur-[110px]" /><DashboardPreview /></motion.div></section>; }

function DashboardPreview() { return <div className="overflow-hidden rounded-[21px] border border-white/[.07] bg-[#0c0f14]"><div className="flex h-12 items-center justify-between border-b border-white/[.07] px-4 sm:px-5"><div className="flex gap-2"><span className="h-2 w-2 rounded-full bg-[#ff6e70]" /><span className="h-2 w-2 rounded-full bg-[#ffc86b]" /><span className="h-2 w-2 rounded-full bg-[#b5ff6d]" /></div><p className="font-mono text-[10px] text-white/35">LIVE RECOVERY CONSOLE</p><span className="w-10" /></div><div className="grid min-h-[420px] grid-cols-1 sm:grid-cols-[170px_1fr]"><aside className="hidden border-r border-white/[.07] p-4 sm:block"><p className="mb-7 text-xs font-semibold text-white">undrop</p>{["Overview", "Recoveries", "Signals", "Automations"].map((item, i) => <div key={item} className={`mb-1 rounded-lg px-3 py-2 text-xs ${i === 0 ? "bg-white/[.08] text-white" : "text-white/40"}`}>{item}</div>)}</aside><div className="p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-xs text-white/45">Good morning, Priya</p><h2 className="mt-1 text-xl font-medium tracking-[-.04em] sm:text-2xl">Revenue, back on track.</h2></div><div className="hidden rounded-full bg-[#b5ff6d]/10 px-3 py-1.5 text-xs text-[#b5ff6d] sm:block">● Systems healthy</div></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"><Metric label="Recovered today" value="₹84,260" change="+18.2%" /><Metric label="At-risk revenue" value="₹1.42L" change="Watching" neutral /><Metric label="Recovery rate" value="31.8%" change="+5.4 pts" /></div><div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_.75fr]"><div className="rounded-2xl border border-white/[.08] bg-white/[.025] p-4"><div className="flex justify-between"><p className="text-xs text-white/55">Recovery performance</p><p className="text-xs text-[#b5ff6d]">Last 7 days</p></div><div className="mt-5 flex h-28 items-end gap-2">{[34,42,38,67,50,74,92,70,86,100,78,92].map((h,i)=><motion.i key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once:true }} transition={{ delay: .4+i*.035, duration:.45 }} className="block flex-1 rounded-t-sm bg-gradient-to-t from-[#6abe29] to-[#c7ff91]" />)}</div><div className="mt-3 flex justify-between text-[10px] text-white/30"><span>Mon</span><span>Wed</span><span>Fri</span><span>Today</span></div></div><div className="rounded-2xl border border-[#b5ff6d]/20 bg-[#b5ff6d]/[.055] p-4"><div className="flex items-center gap-2 text-[#c7ff91]"><Sparkle size={17} weight="fill" /><p className="text-xs font-medium">New signal</p></div><p className="mt-4 text-sm leading-5 text-white/85">UPI failures are elevated for HDFC customers.</p><p className="mt-2 text-xs leading-4 text-white/45">A recovery flow has been tuned and is now active.</p><button className="mt-4 text-xs font-medium text-[#c7ff91]">View signal →</button></div></div></div></div></div>; }

function Metric({label,value,change,neutral}:{label:string;value:string;change:string;neutral?:boolean}) { return <div className="rounded-xl border border-white/[.08] bg-white/[.025] p-3 sm:p-4"><p className="text-[10px] text-white/40">{label}</p><p className="mt-2 text-base font-medium tracking-[-.03em] sm:text-lg">{value}</p><p className={`mt-1 text-[10px] ${neutral ? "text-white/45" : "text-[#b5ff6d]"}`}>{change}</p></div>; }
function LogoStrip() { return <div className="border-y border-white/[.09] py-6 text-center"><p className="text-xs text-white/35">Designed for the teams who obsess over every successful payment.</p><div className="mt-5 flex justify-center gap-7 text-sm font-semibold tracking-[-.03em] text-white/35 sm:gap-12"><span>Razorpay</span><span>cashfree</span><span>PhonePe</span><span>UPI</span></div></div>; }
function SignalSection() { return <section id="product" className="grid gap-12 py-24 sm:grid-cols-2 sm:items-center sm:py-36"><div><p className="text-xs font-medium uppercase tracking-[.16em] text-[#b5ff6d]">Your revenue radar</p><h2 className="mt-5 font-display text-4xl font-medium leading-[.98] tracking-[-.055em] sm:text-5xl">See the moment a payment pattern turns into a problem.</h2><p className="mt-6 max-w-md text-base leading-7 text-white/55">Undrop connects the dots across gateway responses, issuers, payment methods, and customer behavior. You get the context before revenue quietly slips away.</p><ul className="mt-8 space-y-4 text-sm text-white/75">{["Spot unusual failure patterns in real time","Understand which revenue is actually recoverable","Keep a clear audit trail for every decision"].map(t=><li key={t} className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#b5ff6d] text-[#11130e]"><Check size={12} weight="bold" /></span>{t}</li>)}</ul></div><motion.div initial={{opacity:0,x:22}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="rounded-[24px] border border-white/[.1] bg-[#10141b] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs text-white/40">Payment signal</p><p className="mt-1 text-lg font-medium">HDFC · UPI Intent</p></div><span className="rounded-full bg-[#ffad70]/10 px-3 py-1.5 text-[11px] text-[#ffb280]">Needs attention</span></div><div className="mt-8 rounded-2xl bg-[#080a0e] p-5"><div className="flex items-end justify-between"><div><p className="text-3xl font-medium tracking-[-.05em]">34.2%</p><p className="mt-1 text-xs text-white/40">Failure rate · last 45 min</p></div><p className="text-xs text-[#ffb280]">↑ 4.3× baseline</p></div><div className="mt-5 h-px bg-white/[.1]" /><div className="mt-4 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#b5ff6d]/10 text-[#b5ff6d]"><Lightning size={17} weight="fill" /></span><p className="text-xs leading-5 text-white/60">Automation switched eligible recoveries to a safer retry window.</p></div></div></motion.div></section>; }
function RecoveryFlow() { const steps=[[ChartLineUp,"Detect","A useful signal, not more noise."],[Lightning,"Decide","The right next step for each payment."],[TrendUp,"Recover","A better moment and method to try again."]]; return <section id="how-it-works" className="rounded-[30px] bg-[#b5ff6d] px-6 py-16 text-[#11130e] sm:px-12 sm:py-20"><div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#476324]">A closed loop for recovery</p><h2 className="mt-4 font-display text-4xl font-medium leading-[.98] tracking-[-.055em] sm:text-5xl">Turn every failure into a better next attempt.</h2></div><div className="mt-12 grid gap-8 border-t border-[#11130e]/15 pt-7 sm:grid-cols-3">{steps.map(([Icon,title,body],i)=>{const I=Icon as typeof ChartLineUp;return <div key={title as string}><span className="mb-7 grid h-10 w-10 place-items-center rounded-xl bg-[#11130e] text-[#b5ff6d]"><I size={20} weight="bold" /></span><p className="text-sm font-semibold">0{i+1} · {title as string}</p><p className="mt-2 max-w-[210px] text-sm leading-5 text-[#11130e]/65">{body as string}</p></div>})}</div></section>; }
function Closing() { return <section id="security" className="grid gap-10 py-24 sm:grid-cols-2 sm:items-end sm:py-36"><div><div className="inline-grid h-11 w-11 place-items-center rounded-xl border border-white/[.12] text-[#b5ff6d]"><ShieldCheck size={22} weight="duotone" /></div><h2 className="mt-6 font-display text-4xl font-medium leading-[.98] tracking-[-.055em] sm:text-5xl">Automated with care. Transparent by default.</h2></div><div><p className="max-w-md text-base leading-7 text-white/55">Every action is explainable, every recovery is traceable, and your data stays protected with encryption at rest and in transit.</p><Link href="/sign-up" className="mt-7 inline-block rounded-full border border-white/[.2] px-5 py-3 text-sm font-medium transition hover:border-[#b5ff6d] hover:bg-[#b5ff6d] hover:text-[#11130e]">Meet Undrop <ArrowRight className="ml-1 inline-block" size={16} weight="bold" /></Link></div></section>; }
function Footer() { return <footer className="flex flex-col gap-6 border-t border-white/[.1] py-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><Wordmark className="h-6 w-[104px] text-white/80" /><p>© 2026 Undrop. Recovery, with intent.</p><div className="flex gap-5"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a><Link href="/sign-in" className="hover:text-white">Sign in</Link></div></footer>; }
