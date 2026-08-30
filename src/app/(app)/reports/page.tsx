import { auth } from "@/lib/auth";
import { getDashboardStats, getReportsData, getTransactions } from "@/lib/data";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const stats = await getDashboardStats(userId);
  const reports = await getReportsData(userId);
  const transactions = await getTransactions(userId);

  return (
    <ReportsClient stats={stats} reports={reports} transactions={transactions} />
  );
}
