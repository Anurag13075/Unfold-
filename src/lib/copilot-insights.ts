import { callCerebras, callGrok } from "@/lib/agent";
import { getRouteClusters, getTransactions } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

function getHourBucket(date: string) {
  return new Date(date).getTime();
}

async function phraseFinding(finding: string) {
  const hasProvider = !!(process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.CEREBRAS_API_KEY);
  if (!hasProvider) return finding;

  const messages = [
    {
      role: "system" as const,
      content:
        "Phrase this single finding as a short, natural, slightly urgent one-sentence proactive alert, like a sharp colleague tapping your shoulder - not a formal report. Use only the finding provided. Do not invent numbers.",
    },
    {
      role: "user" as const,
      content: finding,
    },
  ];

  let response = await callGrok(messages, "text");
  if (!response) response = await callCerebras(messages, "text");

  return response?.trim() || finding;
}

export async function getProactiveInsight(userId: string): Promise<string | null> {
  const [clusters, transactions] = await Promise.all([
    getRouteClusters(userId),
    getTransactions(userId),
  ]);

  const riskyCluster = clusters
    .filter((cluster) => cluster.status === "active" && cluster.baseline_rate > 0)
    .map((cluster) => ({
      cluster,
      multiple: cluster.failure_rate / cluster.baseline_rate,
    }))
    .filter(({ multiple }) => multiple > 2)
    .sort((a, b) => b.multiple - a.multiple)[0];

  if (riskyCluster) {
    const { cluster, multiple } = riskyCluster;
    return phraseFinding(
      `${cluster.issuer} ${cluster.method} is failing at ${(cluster.failure_rate * 100).toFixed(0)}% vs ${(cluster.baseline_rate * 100).toFixed(0)}% baseline (${multiple.toFixed(1)}x), so the recommended action is: ${cluster.recommended_action}`
    );
  }

  const recent = transactions.slice(0, 20);
  if (recent.length >= 5) {
    const average = recent.reduce((sum, txn) => sum + txn.amount, 0) / recent.length;
    const outlier = recent
      .filter((txn) => txn.amount > average * 2.5 && txn.amount > 10000)
      .sort((a, b) => b.amount - a.amount)[0];

    if (outlier) {
      return phraseFinding(
        `${outlier.merchant_name} has an unusually large ${outlier.status} transaction of ${formatCurrency(outlier.amount)}, which is more than 2.5x the recent average of ${formatCurrency(Math.round(average))}.`
      );
    }
  }

  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const twoHoursAgo = now - 2 * 60 * 60 * 1000;
  const declined = transactions.filter((txn) => txn.status === "declined" || txn.status === "failed" || txn.status === "recovering");
  const lastHour = declined.filter((txn) => getHourBucket(txn.created_at) >= oneHourAgo).length;
  const priorHour = declined.filter((txn) => {
    const createdAt = getHourBucket(txn.created_at);
    return createdAt >= twoHoursAgo && createdAt < oneHourAgo;
  }).length;

  if (lastHour >= 3 && lastHour > Math.max(2, priorHour * 1.75)) {
    return phraseFinding(
      `Declines have spiked in the last hour: ${lastHour} failed or recovering payments vs ${priorHour} in the prior hour.`
    );
  }

  return null;
}
