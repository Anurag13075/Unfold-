import { callCerebras, callGrok } from "@/lib/agent";
import { getAgentActions, getDashboardStats, getRouteClusters, getTransactions } from "@/lib/data";
import { copilotTools, type PendingCopilotToolCall } from "@/lib/copilot-tools";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import type { AgentAction, RouteCluster, Transaction } from "@/types";

export interface CopilotHistoryMessage {
  role: string;
  content: string;
}

export type ConfirmationIntent = "confirm" | "deny" | "unclear";

interface CopilotSnapshot {
  dashboardStats: Awaited<ReturnType<typeof getDashboardStats>>;
  activeRouteClusters: Array<Pick<RouteCluster, "id" | "issuer" | "method" | "error_code" | "severity" | "headline" | "failure_rate" | "baseline_rate" | "recommended_action" | "status">>;
  recentTransactions: Array<Pick<Transaction, "id" | "amount" | "currency" | "method" | "issuer" | "status" | "decline_code" | "decline_reason" | "merchant_name" | "created_at" | "recovered_at">>;
  recentAgentDecisions: Array<Pick<AgentAction, "transaction_id" | "decision" | "confidence" | "reasoning" | "created_at">>;
}

async function getCopilotSnapshot(userId: string): Promise<CopilotSnapshot> {
  const [dashboardStats, routeClusters, transactions] = await Promise.all([
    getDashboardStats(userId),
    getRouteClusters(userId),
    getTransactions(userId),
  ]);

  const recentTransactions = transactions.slice(0, 20);
  const actionBatches = await Promise.all(recentTransactions.slice(0, 10).map((txn) => getAgentActions(txn.id)));
  const recentAgentDecisions = actionBatches
    .flat()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20)
    .map((action) => ({
      transaction_id: action.transaction_id,
      decision: action.decision,
      confidence: action.confidence,
      reasoning: action.reasoning,
      created_at: action.created_at,
    }));

  return {
    dashboardStats,
    activeRouteClusters: routeClusters
      .filter((cluster) => cluster.status === "active")
      .map((cluster) => ({
        id: cluster.id,
        issuer: cluster.issuer,
        method: cluster.method,
        error_code: cluster.error_code,
        severity: cluster.severity,
        headline: cluster.headline,
        failure_rate: cluster.failure_rate,
        baseline_rate: cluster.baseline_rate,
        recommended_action: cluster.recommended_action,
        status: cluster.status,
      })),
    recentTransactions: recentTransactions.map((txn) => ({
      id: txn.id,
      amount: txn.amount,
      currency: txn.currency,
      method: txn.method,
      issuer: txn.issuer,
      status: txn.status,
      decline_code: txn.decline_code,
      decline_reason: txn.decline_reason,
      merchant_name: txn.merchant_name,
      created_at: txn.created_at,
      recovered_at: txn.recovered_at,
    })),
    recentAgentDecisions,
  };
}

function sanitizeHistory(conversationHistory: CopilotHistoryMessage[]) {
  return conversationHistory
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-10)
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: message.content.slice(0, 1600),
    }));
}

function answerFromRules(question: string, snapshot: CopilotSnapshot) {
  const normalized = question.toLowerCase();
  const stats = snapshot.dashboardStats;
  const txns = snapshot.recentTransactions;
  const activeClusters = snapshot.activeRouteClusters;
  const declined = txns.filter((txn) => txn.status === "declined" || txn.status === "recovering");
  const recovered = txns.filter((txn) => txn.status === "recovered");
  const atRiskGmv = declined.reduce((sum, txn) => sum + txn.amount, 0);
  const topCluster = activeClusters[0];

  if (normalized.includes("recovery rate") || normalized.includes("success rate")) {
    return `Your current recovery rate is ${stats.recoveryRate}%, with ${formatCurrency(stats.recoveredGmv)} recovered GMV in the current dataset.`;
  }

  if (normalized.includes("gmv") || normalized.includes("recovered")) {
    return `You have recovered ${formatCurrency(stats.recoveredGmv)} so far. In the latest ${txns.length} transactions I can see, ${recovered.length} are marked recovered and ${declined.length} are still at risk.`;
  }

  if (normalized.includes("route") || normalized.includes("cluster") || normalized.includes("issuer")) {
    if (!topCluster) {
      return "I do not see an active route cluster in the current data snapshot.";
    }
    const multiple = topCluster.baseline_rate > 0 ? (topCluster.failure_rate / topCluster.baseline_rate).toFixed(1) : "n/a";
    return `${topCluster.issuer} ${topCluster.method} is the top active route issue: ${(topCluster.failure_rate * 100).toFixed(0)}% failure rate vs ${(topCluster.baseline_rate * 100).toFixed(0)}% baseline (${multiple}x). Recommended action: ${topCluster.recommended_action}`;
  }

  if (normalized.includes("risk") || normalized.includes("at risk") || normalized.includes("declined")) {
    return `The latest snapshot has ${declined.length} unrecovered failed payments worth ${formatCurrency(atRiskGmv)}. The largest at-risk payment is ${formatCurrency(Math.max(...declined.map((txn) => txn.amount), 0))}.`;
  }

  if (normalized.includes("decision") || normalized.includes("agent")) {
    const counts = snapshot.recentAgentDecisions.reduce<Record<string, number>>((acc, action) => {
      acc[action.decision] = (acc[action.decision] || 0) + 1;
      return acc;
    }, {});
    const summary = Object.entries(counts)
      .map(([decision, count]) => `${decision}: ${count}`)
      .join(", ");
    return summary
      ? `Recent agent decisions are: ${summary}.`
      : "I do not see recent agent decisions in the current data snapshot.";
  }

  return `I'm using the live payment snapshot directly. Current recovered GMV is ${formatCurrencyCompact(stats.recoveredGmv)}, recovery rate is ${stats.recoveryRate}%, active route clusters: ${activeClusters.length}, and latest transactions loaded: ${txns.length}. Ask about recovery rate, at-risk GMV, route clusters, or agent decisions for a sharper answer.`;
}

function parseToolCallFromText(question: string): PendingCopilotToolCall | null {
  const normalized = question.toLowerCase();
  const transactionMatch = question.match(/\btxn_[a-zA-Z0-9_-]+\b/);
  const transactionId = transactionMatch?.[0];

  if (!transactionId) return null;

  if (normalized.includes("resend") || normalized.includes("send recovery") || normalized.includes("send message")) {
    const channel = normalized.includes("whatsapp")
      ? "whatsapp"
      : normalized.includes("sms")
        ? "sms"
        : normalized.includes("telegram")
          ? "telegram"
          : "email";

    return {
      name: "resend_recovery_message",
      params: { transactionId, channel },
    };
  }

  if (normalized.includes("mark") || normalized.includes("update status") || normalized.includes("set status")) {
    if (normalized.includes("recovered")) {
      return {
        name: "mark_transaction_status",
        params: { transactionId, status: "recovered" },
      };
    }
    if (normalized.includes("escalated") || normalized.includes("escalate")) {
      return {
        name: "mark_transaction_status",
        params: { transactionId, status: "escalated" },
      };
    }
  }

  return null;
}

async function callGroqForToolIntent(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>) {
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.1,
        tools: copilotTools,
        tool_choice: "auto",
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.name || !toolCall.function.arguments) return null;

    return {
      name: toolCall.function.name,
      params: JSON.parse(toolCall.function.arguments),
    } as PendingCopilotToolCall;
  } catch {
    return null;
  }
}

export async function detectCopilotToolCall(
  question: string,
  conversationHistory: CopilotHistoryMessage[]
): Promise<PendingCopilotToolCall | null> {
  const fallback = parseToolCallFromText(question);
  const hasProvider = !!(process.env.GROQ_API_KEY || process.env.GROK_API_KEY);
  if (!hasProvider) return fallback;

  const messages = [
    {
      role: "system" as const,
      content:
        "You classify whether the merchant wants Ask Undrop to execute one of the available tools. Call a tool only for a concrete action request with a transaction ID. For ordinary questions, do not call a tool.",
    },
    ...sanitizeHistory(conversationHistory),
    { role: "user" as const, content: question },
  ];

  return (await callGroqForToolIntent(messages)) || fallback;
}

export async function classifyConfirmationIntent(message: string): Promise<ConfirmationIntent> {
  const normalized = message.trim().toLowerCase();
  if (/^(yes|y|confirm|confirmed|do it|go ahead|proceed|approve|approved|send it)$/i.test(normalized)) {
    return "confirm";
  }
  if (/^(no|n|cancel|stop|deny|decline|don't|do not|abort)$/i.test(normalized)) {
    return "deny";
  }

  const hasProvider = !!(process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.CEREBRAS_API_KEY);
  if (!hasProvider) return "unclear";

  const messages = [
    {
      role: "system" as const,
      content:
        "Classify the user's reply to a pending action confirmation. Return exactly one word: confirm, deny, or unclear.",
    },
    { role: "user" as const, content: message },
  ];

  let response = await callGrok(messages, "text");
  if (!response) response = await callCerebras(messages, "text");
  const result = response?.trim().toLowerCase();
  return result === "confirm" || result === "deny" ? result : "unclear";
}

export async function answerCopilotQuery(
  userId: string,
  question: string,
  conversationHistory: CopilotHistoryMessage[]
): Promise<string> {
  const snapshot = await getCopilotSnapshot(userId);
  const fallbackAnswer = answerFromRules(question, snapshot);

  const hasProvider = !!(process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.CEREBRAS_API_KEY);
  if (!hasProvider) {
    return fallbackAnswer;
  }

  const messages = [
    {
      role: "system" as const,
      content: `You are Ask Undrop, a dashboard copilot for Razorpay merchants.
Only answer using the data provided below. If the data doesn't contain the answer, say so plainly - never invent numbers.
Do not mention internal implementation details, database names, or provider names.
Be concise, direct, and operational. Prefer exact numbers from the snapshot.
Do not expose customer PII. The snapshot intentionally excludes emails and phone numbers.

DATA SNAPSHOT:
${JSON.stringify(snapshot, null, 2)}`,
    },
    ...sanitizeHistory(conversationHistory),
    {
      role: "user" as const,
      content: question,
    },
  ];

  let response = await callGrok(messages, "text");
  if (!response) response = await callCerebras(messages, "text");

  if (!response) {
    return `I'm having trouble reaching my reasoning engine right now, but here's what I can tell you directly: ${fallbackAnswer}`;
  }

  return response.trim();
}
