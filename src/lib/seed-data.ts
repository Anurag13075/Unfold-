import type {
  RouteCluster,
  Transaction,
  AgentAction,
  RecoveryMessage,
} from "@/types";

const ISSUERS = ["HDFC", "ICICI", "SBI", "Axis", "Kotak", "Yes Bank"];
const METHODS = ["UPI Intent", "UPI Collect", "Card", "Netbanking", "Wallet"];
const DECLINE_CODES = [
  { code: "BAD_REQUEST_ERROR", reason: "Payment declined by issuer", type: "business" },
  { code: "GATEWAY_ERROR", reason: "Gateway timeout", type: "technical" },
  { code: "INSUFFICIENT_FUNDS", reason: "Insufficient balance", type: "business" },
  { code: "AUTHENTICATION_ERROR", reason: "Wrong UPI PIN entered", type: "business" },
  { code: "LIMIT_EXCEEDED", reason: "Daily transaction limit breached", type: "business" },
  { code: "ISSUER_UNAVAILABLE", reason: "Issuer bank temporarily unavailable", type: "technical" },
];

const MERCHANTS = [
  "Urban Threads",
  "FreshCart Grocery",
  "CloudDesk SaaS",
  "FitPulse Gym",
  "BookNest",
  "StyleHub",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function generateWaveform(status: Transaction["status"]): number[] {
  const points = 40;
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    if (status === "declined") {
      data.push(i < 20 ? 0.5 + Math.sin(i * 0.5) * 0.2 : 0.1);
    } else if (status === "recovering") {
      data.push(i < 25 ? 0.3 : 0.3 + (i - 25) * 0.03);
    } else if (status === "recovered") {
      data.push(i < 15 ? 0.4 + Math.sin(i * 0.4) * 0.15 : 0.5 + Math.sin(i * 0.6) * 0.35);
    } else {
      data.push(0.1 + Math.random() * 0.05);
    }
  }
  return data;
}

export function seedDemoData(userId: string) {
  const transactions: Transaction[] = [];
  const agentActions: AgentAction[] = [];
  const recoveryMessages: RecoveryMessage[] = [];
  const now = Date.now();

  const statuses: Transaction["status"][] = [
    "declined", "declined", "recovering", "recovered", "recovered",
    "declined", "recovered", "declined", "recovering", "recovered",
    "declined", "recovered", "declined", "declined", "recovered",
  ];

  statuses.forEach((status, i) => {
    const decline = randomFrom(DECLINE_CODES);
    const id = generateId("txn");
    const createdAt = new Date(now - i * 180000 - Math.random() * 60000).toISOString();

    const txn: Transaction = {
      id,
      razorpay_payment_id: `pay_${generateId("rzp").slice(4)}`,
      amount: Math.floor(Math.random() * 15000) + 500,
      currency: "INR",
      method: i < 5 ? "UPI Intent" : randomFrom(METHODS),
      issuer: i < 5 ? "HDFC" : randomFrom(ISSUERS),
      status,
      decline_code: status !== "recovered" || i % 3 === 0 ? decline.code : null,
      decline_reason: status !== "recovered" || i % 3 === 0 ? decline.reason : null,
      merchant_name: randomFrom(MERCHANTS),
      created_at: createdAt,
      recovered_at: status === "recovered" ? new Date(new Date(createdAt).getTime() + 120000).toISOString() : null,
    };
    transactions.push(txn);

    if (status !== "declined" || i % 2 === 0) {
      const action: AgentAction = {
        id: generateId("act"),
        transaction_id: id,
        decision: status === "recovered" ? "retry_delayed" : status === "recovering" ? "retry_now" : "suggest_alt_method",
        delay_seconds: status === "recovered" ? 300 : null,
        alt_method: status === "declined" ? "UPI Collect" : null,
        reasoning:
          status === "recovered"
            ? "Business decline with sufficient retry window. Customer has prior successful UPI transactions on this issuer."
            : status === "recovering"
            ? "Transient gateway error detected. Immediate retry recommended within 30s window."
            : "Repeated authentication failures suggest alternative payment method.",
        confidence: 0.72 + Math.random() * 0.25,
        created_at: new Date(new Date(createdAt).getTime() + 5000).toISOString(),
      };
      agentActions.push(action);

      recoveryMessages.push({
        id: generateId("msg"),
        transaction_id: id,
        channel: i % 3 === 0 ? "whatsapp" : i % 3 === 1 ? "sms" : "email",
        body: `Hi! Your payment of ₹${txn.amount.toLocaleString("en-IN")} to ${txn.merchant_name} didn't go through (${decline.reason}). Tap here to retry securely — most customers complete payment within 2 minutes.`,
        created_at: new Date(new Date(createdAt).getTime() + 8000).toISOString(),
      });
    }
  });

  const clusters: RouteCluster[] = [
    {
      id: generateId("cluster"),
      issuer: "HDFC",
      method: "UPI Intent",
      error_code: "GATEWAY_ERROR",
      severity: "critical",
      headline: "HDFC declining 34% above baseline",
      summary: "UPI Intent failures on HDFC spiked 3.2× in the last 12 minutes — likely issuer-side routing congestion, not merchant config.",
      recommended_action: "Route HDFC UPI Intent traffic to backup acquirer corridor via Smart Router.",
      failure_rate: 0.34,
      baseline_rate: 0.08,
      status: "active",
      sparkline: [0.08, 0.09, 0.07, 0.08, 0.1, 0.12, 0.18, 0.24, 0.31, 0.34, 0.33, 0.34],
      history: [
        { date: "2026-08-20", resolved: true },
        { date: "2026-08-14", resolved: true },
        { date: "2026-08-05", resolved: true },
      ],
      created_at: new Date(now - 720000).toISOString(),
      resolved_at: null,
    },
    {
      id: generateId("cluster"),
      issuer: "ICICI",
      method: "Card",
      error_code: "AUTHENTICATION_ERROR",
      severity: "medium",
      headline: "ICICI card 3DS failures elevated",
      summary: "Authentication errors on ICICI debit cards running 18% above 7-day baseline during peak hours.",
      recommended_action: "Enable step-up authentication fallback for ICICI debit BIN range 4xxx.",
      failure_rate: 0.18,
      baseline_rate: 0.06,
      status: "active",
      sparkline: [0.06, 0.07, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.17, 0.18, 0.17, 0.18],
      history: [{ date: "2026-08-18", resolved: true }],
      created_at: new Date(now - 3600000).toISOString(),
      resolved_at: null,
    },
    {
      id: generateId("cluster"),
      issuer: "SBI",
      method: "Netbanking",
      error_code: "ISSUER_UNAVAILABLE",
      severity: "low",
      headline: "SBI netbanking intermittent timeouts",
      summary: "Technical declines on SBI netbanking slightly elevated but within recoverable range.",
      recommended_action: "Monitor — auto-retry with 60s backoff is recovering 71% of affected transactions.",
      failure_rate: 0.11,
      baseline_rate: 0.07,
      status: "resolved",
      sparkline: [0.07, 0.08, 0.11, 0.13, 0.11, 0.09, 0.08, 0.07, 0.07, 0.06, 0.07, 0.07],
      history: [
        { date: "2026-08-22", resolved: true },
        { date: "2026-08-10", resolved: true },
      ],
      created_at: new Date(now - 86400000).toISOString(),
      resolved_at: new Date(now - 43200000).toISOString(),
    },
  ];

  return { transactions, agentActions, recoveryMessages, clusters, generateWaveform };
}

export { generateWaveform, DECLINE_CODES, ISSUERS, METHODS };
