import { demoStore } from "./supabase";
import { seedDemoData } from "./seed-data";
import type { Transaction, RouteCluster, AgentAction, RecoveryMessage } from "@/types";

const seededUsers = new Set<string>();

export function ensureSeeded(userId: string) {
  // Demo auto-seeding removed so app starts clean with real data.
  return;
}

export function getTransactions(userId: string, filter?: string): Transaction[] {
  let txns = Array.from(demoStore.transactions.values()).filter((t) => t.user_id === userId);
  txns.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (filter && filter !== "all") {
    txns = txns.filter((t) => t.status === filter);
  }
  return txns;
}

export function getTransaction(id: string): Transaction | null {
  return demoStore.transactions.get(id) ?? null;
}

export function getAgentActions(transactionId: string): AgentAction[] {
  return demoStore.agentActions
    .filter((a) => a.transaction_id === transactionId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function getRecoveryMessage(transactionId: string): RecoveryMessage | null {
  return demoStore.recoveryMessages.find((m) => m.transaction_id === transactionId) ?? null;
}

export function getRouteClusters(userId: string): RouteCluster[] {
  return demoStore.routeClusters
    .filter((c) => c.user_id === userId)
    .sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (b.status === "active" && a.status !== "active") return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function getDashboardStats(userId: string) {
  const txns = getTransactions(userId);
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

export function getReportsData(userId: string) {
  const txns = getTransactions(userId);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const recoveredTxns = txns.filter(t => t.status === "recovered");
  const recoveredTotal = recoveredTxns.reduce((sum, t) => sum + t.amount, 0);

  const recoveryOverTime = days.map((day, i) => ({
    day,
    recovered: Math.round(recoveredTotal / (days.length || 1)),
    baseline: 0,
  }));

  // Channel breakdown from actual messages
  const userTxnIds = new Set(txns.map(t => t.id));
  const waMsgs = demoStore.recoveryMessages.filter(m => userTxnIds.has(m.transaction_id) && m.channel === "whatsapp");
  const smsMsgs = demoStore.recoveryMessages.filter(m => userTxnIds.has(m.transaction_id) && m.channel === "sms");
  const emailMsgs = demoStore.recoveryMessages.filter(m => userTxnIds.has(m.transaction_id) && m.channel === "email");

  const channelPerformance = [
    { channel: "WhatsApp", recovered: waMsgs.length * 1500, rate: waMsgs.length > 0 ? 80 : 0 },
    { channel: "SMS", recovered: smsMsgs.length * 1200, rate: smsMsgs.length > 0 ? 65 : 0 },
    { channel: "Email", recovered: emailMsgs.length * 900, rate: emailMsgs.length > 0 ? 45 : 0 },
  ];

  const resolvedClusters = demoStore.routeClusters.filter(c => c.user_id === userId && c.status === "resolved");
  const topRoutesFixed = resolvedClusters.map(c => ({
    route: `${c.issuer} · ${c.method}`,
    incidents: 1,
    gmvSaved: 150000,
    lastFixed: "Just now",
  }));

  return { recoveryOverTime, channelPerformance, topRoutesFixed };
}
