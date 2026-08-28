import { auth } from "@/lib/auth";
import { getTransactions, getRouteClusters, getDashboardStats } from "@/lib/data";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const transactions = await getTransactions(userId);
  const clusters = await getRouteClusters(userId);
  const stats = await getDashboardStats(userId);

  return (
    <DashboardClient transactions={transactions} clusters={clusters} stats={stats} />
  );
}
