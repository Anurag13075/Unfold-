import { auth } from "@/lib/auth";
import { getRouteClusters } from "@/lib/data";
import { RoutesClient } from "./routes-client";

export default async function RoutesPage() {
  const session = await auth();
  const clusters = getRouteClusters(session!.user!.id);
  return <RoutesClient clusters={clusters} />;
}
