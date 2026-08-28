import { createServiceClient } from "./supabase";
import type { Transaction, RouteCluster, AgentAction, RecoveryMessage } from "@/types";

export async function ensureSeeded(userId: string) {
  return;
}

export async function getTransactions(userId: string, filter?: string): Promise<Transaction[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filter && filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((t) => ({
    id: t.id,
    razorpay_payment_id: t.razorpay_payment_id,
    amount: t.amount,
    currency: t.currency,
    method: t.method,
    issuer: t.issuer,
    status: t.status as Transaction["status"],
    decline_code: t.decline_code,
    decline_reason: t.decline_reason,
    merchant_name: t.merchant_name,
    created_at: t.created_at,
    recovered_at: t.recovered_at,
  }));
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    razorpay_payment_id: data.razorpay_payment_id,
    amount: data.amount,
    currency: data.currency,
    method: data.method,
    issuer: data.issuer,
    status: data.status as Transaction["status"],
    decline_code: data.decline_code,
    decline_reason: data.decline_reason,
    merchant_name: data.merchant_name,
    created_at: data.created_at,
    recovered_at: data.recovered_at,
  };
}

export async function getAgentActions(transactionId: string): Promise<AgentAction[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("agent_actions")
    .select("*")
    .eq("transaction_id", transactionId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((a) => ({
    id: a.id,
    transaction_id: a.transaction_id,
    decision: a.decision as AgentAction["decision"],
    delay_seconds: a.delay_seconds,
    alt_method: a.alt_method,
    reasoning: a.reasoning,
    confidence: a.confidence,
    created_at: a.created_at,
  }));
}

export async function getRecoveryMessage(transactionId: string): Promise<RecoveryMessage | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("recovery_messages")
    .select("*")
    .eq("transaction_id", transactionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    transaction_id: data.transaction_id,
    channel: data.channel as RecoveryMessage["channel"],
    body: data.body,
    created_at: data.created_at,
  };
}

export async function getRouteClusters(userId: string): Promise<RouteCluster[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("route_clusters")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) return [];

  const clusters: RouteCluster[] = data.map((c) => ({
    id: c.id,
    issuer: c.issuer,
    method: c.method,
    error_code: c.error_code,
    severity: c.severity as RouteCluster["severity"],
    headline: c.headline,
    summary: c.summary,
    recommended_action: c.recommended_action,
    failure_rate: c.failure_rate,
    baseline_rate: c.baseline_rate,
    status: c.status as RouteCluster["status"],
    sparkline: Array.isArray(c.sparkline) ? (c.sparkline as number[]) : [],
    history: Array.isArray(c.history) ? (c.history as { date: string; resolved: boolean }[]) : [],
    created_at: c.created_at,
    resolved_at: c.resolved_at,
  }));

  clusters.sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1;
    if (b.status === "active" && a.status !== "active") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return clusters;
}

export async function getDashboardStats(userId: string) {
  const txns = await getTransactions(userId);
  const recovered = txns.filter((t) => t.status === "recovered");
  const recoveredGmv = recovered.reduce((sum, t) => sum + t.amount, 0);
  const totalFailed = txns.filter((t) => t.status !== "recovered").length + recovered.length;
  const recoveryRate = totalFailed > 0 ? (recovered.length / totalFailed) * 100 : 0;

  return {
    recoveredGmv,
    recoveryRate: Math.round(recoveryRate * 10) / 10,
    opsHoursSaved: Math.round(recovered.length * 0.25),
    tickerAmount: recoveredGmv,
    tickerDelta: recoveredGmv > 0 ? "+100%" : "0.0%",
  };
}

export async function getReportsData(userId: string) {
  const txns = await getTransactions(userId);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const recoveredTxns = txns.filter((t) => t.status === "recovered");
  const recoveredTotal = recoveredTxns.reduce((sum, t) => sum + t.amount, 0);

  const recoveryOverTime = days.map((day) => ({
    day,
    recovered: Math.round(recoveredTotal / (days.length || 1)),
    baseline: 0,
  }));

  const userTxnIds = new Set(txns.map((t) => t.id));

  const supabase = createServiceClient();
  let waMsgs = 0;
  let smsMsgs = 0;
  let emailMsgs = 0;
  let resolvedClusters: RouteCluster[] = [];

  if (supabase && userTxnIds.size > 0) {
    const txnIdsArray = Array.from(userTxnIds);
    const { data: messages } = await supabase
      .from("recovery_messages")
      .select("channel, transaction_id")
      .in("transaction_id", txnIdsArray);

    if (messages) {
      waMsgs = messages.filter((m) => m.channel === "whatsapp").length;
      smsMsgs = messages.filter((m) => m.channel === "sms").length;
      emailMsgs = messages.filter((m) => m.channel === "email").length;
    }
  }

  const clusters = await getRouteClusters(userId);
  resolvedClusters = clusters.filter((c) => c.status === "resolved");

  const channelPerformance = [
    { channel: "WhatsApp", recovered: waMsgs * 1500, rate: waMsgs > 0 ? 80 : 0 },
    { channel: "SMS", recovered: smsMsgs * 1200, rate: smsMsgs > 0 ? 65 : 0 },
    { channel: "Email", recovered: emailMsgs * 900, rate: emailMsgs > 0 ? 45 : 0 },
  ];

  const topRoutesFixed = resolvedClusters.map((c) => ({
    route: `${c.issuer} · ${c.method}`,
    incidents: 1,
    gmvSaved: 150000,
    lastFixed: "Just now",
  }));

  return { recoveryOverTime, channelPerformance, topRoutesFixed };
}
