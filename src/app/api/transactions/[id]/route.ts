import { auth } from "@/lib/auth";
import { getAgentActions, getRecoveryMessage, getTransaction } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transaction = await getTransaction(params.id, userId);
  if (!transaction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const actions = await getAgentActions(params.id);
  const message = await getRecoveryMessage(params.id);

  return NextResponse.json({
    transaction,
    actions,
    message,
  });
}
