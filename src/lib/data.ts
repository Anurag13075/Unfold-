import { demoStore } from "./supabase";
import { seedDemoData } from "./seed-data";
import type { Transaction, RouteCluster, AgentAction, RecoveryMessage } from "@/types";

const seededUsers = new Set<string>();

export function ensureSeeded(userId: string) {
  if (seededUsers.has(userId)) return;
  const { transactions, agentActions, recoveryMessages, clusters } = seedDemoData(userId);
  transactions.forEach((t) => demoStore.transactions.set(t.id, t));
  demoStore.agentActions.push(...agentActions);
  demoStore.recoveryMessages.push(...recoveryMessages);
  demoStore.routeClusters.push(...clusters);
  seededUsers.add(userId);
}

export function getTransactions(userId: string, filter?: string): Transaction[] {
  ensureSeeded(userId);
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
  ensureSeeded(userId);
  return demoStore.routeClusters
    .filter((c) => c.user_id === userId)
    .sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (b.status === "active" && a.status !== "active") return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function getDashboardStats(userId: string) {
  ensureSeeded(userId);
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
    tickerDelta: "+12.4%",
  };
}

export function getReportsData(userId: string) {
  ensureSeeded(userId);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const recoveryOverTime = days.map((day, i) => ({
    day,
    recovered: Math.floor(15000 + Math.random() * 45000 + i * 3000),
    baseline: Math.floor(8000 + Math.random() * 12000),
  }));

  const channelPerformance = [
    { channel: "WhatsApp", recovered: 142000, rate: 78 },
    { channel: "SMS", recovered: 89000, rate: 62 },
    { channel: "Email", recovered: 54000, rate: 41 },
  ];

  const topRoutesFixed = [
    { route: "HDFC · UPI Intent", incidents: 3, gmvSaved: 284000, lastFixed: "2h ago" },
    { route: "ICICI · Card 3DS", incidents: 2, gmvSaved: 156000, lastFixed: "1d ago" },
    { route: "SBI · Netbanking", incidents: 1, gmvSaved: 67000, lastFixed: "3d ago" },
    { route: "Axis · UPI Collect", incidents: 1, gmvSaved: 43000, lastFixed: "5d ago" },
  ];

  return { recoveryOverTime, channelPerformance, topRoutesFixed };
}
