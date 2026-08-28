import { auth } from "@/lib/auth";
import { getTransactions, getRouteClusters, getDashboardStats } from "@/lib/data";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const transactions = getTransactions(userId);
  const clusters = getRouteClusters(userId);
  const stats = getDashboardStats(userId);

  return (
    <DashboardClient transactions={transactions} clusters={clusters} stats={stats} />
  );
}
