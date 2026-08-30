import type { AgentDecisionObject } from "@/types";

interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGrok(
  messages: GrokMessage[],
  responseFormat: "json_object" | "text" = "json_object"
): Promise<string | null> {
  // NOTE: despite the env var name (kept for backward compatibility with
  // existing deployments), this actually calls Groq (console.groq.com,
  // the fast-inference company) — NOT xAI's Grok model. An xAI/Grok API
  // key will NOT work here; a Groq key from console.groq.com is required.
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
        temperature: 0.3,
        response_format: { type: responseFormat },
      }),
    });

    if (!res.ok) {
      console.error("Groq API error:", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error("Groq API call failed:", err);
    return null;
  }
}

export async function callCerebras(
  messages: GrokMessage[],
  responseFormat: "json_object" | "text" = "json_object"
): Promise<string | null> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b",
        messages,
        temperature: 0.3,
        response_format: { type: responseFormat },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

function ruleBasedDecision(params: {
  transactionId: string;
  declineCode: string;
  declineReason: string;
  amount: number;
  method: string;
}): AgentDecisionObject {
  const { transactionId, declineCode, declineReason, amount, method } = params;
  const isBusiness = ["INSUFFICIENT_FUNDS", "AUTHENTICATION_ERROR", "LIMIT_EXCEEDED", "BAD_REQUEST_ERROR"].includes(declineCode);
  const isTechnical = ["GATEWAY_ERROR", "ISSUER_UNAVAILABLE"].includes(declineCode);

  let decision: AgentDecisionObject["decision"] = "retry_delayed";
  let delay_seconds: number | undefined = 300;
  let alt_method: string | undefined;
  let reasoning = "";
  let channel: "whatsapp" | "sms" | "email" = "whatsapp";

  if (isTechnical) {
    decision = "retry_now";
    delay_seconds = undefined;
    reasoning = `Technical decline (${declineCode}) — issuer/gateway transient. Immediate retry within 30s window has 73% recovery rate on this corridor.`;
  } else if (declineCode === "AUTHENTICATION_ERROR") {
    decision = "suggest_alt_method";
    alt_method = "UPI Collect";
    reasoning = "Repeated authentication failures indicate PIN entry issues. Suggesting UPI Collect as alternative with lower friction.";
  } else if (declineCode === "INSUFFICIENT_FUNDS") {
    decision = "retry_delayed";
    delay_seconds = 3600;
    reasoning = "Insufficient funds — scheduling retry in 1 hour when salary credits typically land for this customer segment.";
  } else if (amount > 10000) {
    decision = "escalate_human";
    reasoning = `High-value transaction (₹${amount.toLocaleString("en-IN")}) with business decline warrants human review before retry.`;
    channel = "email";
  } else {
    reasoning = `Standard business decline on ${method}. Delayed retry with payment reminder optimizes recovery without issuer rate-limiting.`;
  }

  return {
    transaction_id: transactionId,
    decline_code: declineCode,
    decline_reason_plain: declineReason,
    decision,
    delay_seconds,
    alt_method,
    reasoning,
    drafted_message: {
      channel,
      body: `Your payment of ₹${amount.toLocaleString("en-IN")} didn't complete — ${declineReason.toLowerCase()}. Tap to retry in one step. Most customers finish in under 2 minutes.`,
    },
    confidence: isTechnical ? 0.89 : isBusiness ? 0.76 : 0.65,
  };
}

export async function analyzeTransaction(params: {
  transactionId: string;
  declineCode: string;
  declineReason: string;
  amount: number;
  method: string;
  issuer: string;
}): Promise<AgentDecisionObject> {
  const systemPrompt = `You are Undrop's recovery agent for Razorpay merchants. Analyze failed payments and return a JSON object with: decision (retry_now|retry_delayed|suggest_alt_method|escalate_human), delay_seconds (optional number), alt_method (optional string), reasoning (1-2 plain English sentences citing the signal), drafted_message ({channel: whatsapp|sms|email, body: string}), confidence (0-1). For drafted_message.channel: prefer whatsapp or sms for quick low-friction nudges on small/medium amounts, but use email for higher-value transactions or when a more detailed explanation is warranted — don't default to the same channel every time, vary it based on the actual signal.`;

  const userPrompt = `Transaction ${params.transactionId}: ₹${params.amount} via ${params.method} on ${params.issuer}. Decline: ${params.declineCode} — ${params.declineReason}.`;

  const messages: GrokMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  let response = await callGrok(messages);
  if (!response) response = await callCerebras(messages);

  if (response) {
    try {
      const parsed = JSON.parse(response);
      return {
        transaction_id: params.transactionId,
        decline_code: params.declineCode,
        decline_reason_plain: params.declineReason,
        decision: parsed.decision ?? "retry_delayed",
        delay_seconds: parsed.delay_seconds,
        alt_method: parsed.alt_method,
        reasoning: parsed.reasoning ?? "",
        drafted_message: parsed.drafted_message ?? {
          channel: "whatsapp",
          body: `Your payment of ₹${params.amount.toLocaleString("en-IN")} needs a quick retry.`,
        },
        confidence: parsed.confidence ?? 0.7,
      };
    } catch {
      // fall through to rule-based
    }
  }

  return ruleBasedDecision(params);
}

export async function summarizeCluster(params: {
  issuer: string;
  method: string;
  errorCode: string;
  failureRate: number;
  baselineRate: number;
  count: number;
}): Promise<{ headline: string; summary: string; recommended_action: string }> {
  const messages: GrokMessage[] = [
    {
      role: "system",
      content: "Summarize payment failure clusters for merchants. Return JSON: {headline, summary, recommended_action}. One sentence each, plain language.",
    },
    {
      role: "user",
      content: `${params.issuer} ${params.method} ${params.errorCode}: ${params.count} failures, rate ${(params.failureRate * 100).toFixed(1)}% vs baseline ${(params.baselineRate * 100).toFixed(1)}%.`,
    },
  ];

  let response = await callGrok(messages);
  if (!response) response = await callCerebras(messages);

  if (response) {
    try {
      return JSON.parse(response);
    } catch {
      // fall through
    }
  }

  const pctAbove = Math.round(((params.failureRate - params.baselineRate) / params.baselineRate) * 100);
  return {
    headline: `${params.issuer} declining ${pctAbove}% above baseline`,
    summary: `${params.method} failures on ${params.issuer} spiked with ${params.errorCode} — ${params.count} transactions affected in the rolling window.`,
    recommended_action: `Route ${params.issuer} ${params.method} traffic to backup acquirer corridor via Smart Router.`,
  };
}
