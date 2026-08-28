# Undrop

**Agentic revenue recovery for Razorpay merchants** — reactive transaction recovery plus proactive route intelligence in one product.

## The problem

Roughly 7–10% of digital transactions in India fail every month. Per NPCI's breakdown, ~80% are "business decline" (wrong PIN, insufficient balance, limit breaches) — not fraud. Most failed revenue is recoverable, not lost.

## Two-layer solution

1. **Reactive recovery** — For every failed transaction, an AI agent produces a typed decision (retry now, retry delayed, suggest alt method, escalate), drafts channel-accurate recovery messages, and executes the recovery loop.

2. **Proactive route intelligence** — Every failure is also a data point about system health. Undrop clusters declines live by issuer/method/error code, flags statistically anomalous corridors, and surfaces actionable route fixes before they bleed more GMV.

```
┌─────────────┐     webhooks      ┌──────────────┐
│  Razorpay   │ ───────────────►  │   Undrop     │
│  (test mode)│                   │   API        │
└─────────────┘                   └──────┬───────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
              ┌──────────┐        ┌──────────┐        ┌──────────┐
              │  Agent   │        │ Cluster  │        │ Recovery │
              │  (Grok)  │        │   Job    │        │ Messages │
              └──────────┘        └──────────┘        └──────────┘
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         ▼
                              ┌─────────────────────┐
                              │  Pulse Ledger +     │
                              │  Route Intelligence │
                              └─────────────────────┘
```

## What's real vs. simulated

| Component | Status |
|-----------|--------|
| Razorpay webhook listener | Real — accepts `payment.failed` / `payment.captured` |
| User-connected API keys | Real — encrypted at rest with AES-256-GCM |
| Google OAuth | Real — when env vars configured |
| Synthetic event simulator | Simulated — replays NPCI decline distribution (~80/20 business/technical) with injected clusters |
| Dashboard seed data | Simulated — realistic merchant/issuer/method mix for demo |
| AI agent decisions | Real when Grok/Cerebras keys present; rule-based fallback otherwise |

The simulator deliberately injects clusters (e.g., HDFC UPI Intent at 3× baseline over 12 minutes) so Route Intelligence has something meaningful to detect.

## Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind (custom design tokens)
- **Auth:** Auth.js v5 — Google primary, config-driven provider array
- **Database:** Supabase Postgres + RLS (schema in `supabase/schema.sql`)
- **AI:** Grok (primary) + Cerebras (fallback) with structured JSON output
- **Charts:** Recharts, restyled to design system
- **Animation:** Framer Motion + hand-rolled canvas waveforms

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in AUTH_SECRET, optional GOOGLE_CLIENT_ID/SECRET, GROK_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Without OAuth configured:** click "Continue with Demo Account" on sign-in.

**With Google OAuth:** set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXT_PUBLIC_GOOGLE_ENABLED=true`.

### Razorpay webhook (optional)

Point your test-mode webhook to:
```
POST https://your-domain/api/webhooks/razorpay
```

Events: `payment.failed`, `payment.captured`

### Synthetic simulator

```bash
curl -X POST http://localhost:3000/api/simulator \
  -H "Content-Type: application/json" \
  -d '{"count": 5, "injectCluster": true}'
```

## Demo script (60–90s)

1. **Landing page** (2s) — "Most failed payments aren't lost. They're recoverable."
2. **Sign in** → onboarding (skip or connect Razorpay test keys)
3. **Dashboard** — live Pulse Ledger, click a declining transaction, show agent trace + recovery message draft
4. **Route Intelligence** — HDFC UPI Intent cluster at 34% above baseline → "Push to Smart Router"
5. **Reports** — recovered GMV, success-rate lift, ops hours saved

Lead with the differentiation: *"We don't just retry payments — we read the pattern and fix the route."*

## Design

Full design system in the brief (§6). Key constraints:
- Ink/surface palette with ember (money), pulse (live/success), flatline (decline)
- Cabinet Grotesk + Switzer + JetBrains Mono
- Film grain overlay, no glassmorphism, no purple gradients
- Official Google sign-in button (brand guidelines)

## Deploy

Vercel + Supabase. Set all env vars from `.env.example`.
