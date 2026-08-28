import { auth } from "@/lib/auth";
import { getDashboardStats, getReportsData } from "@/lib/data";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const session = await auth();
  const userId = session!.user!.id;
  return (
    <ReportsClient stats={getDashboardStats(userId)} reports={getReportsData(userId)} />
  );
}
