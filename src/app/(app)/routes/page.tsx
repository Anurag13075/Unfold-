import { auth } from "@/lib/auth";
import { getRouteClusters, getTransactions } from "@/lib/data";
import { RoutesClient } from "./routes-client";

export default async function RoutesPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const clusters = await getRouteClusters(userId);
  const transactions = await getTransactions(userId);
  return <RoutesClient clusters={clusters} transactions={transactions} />;
}
