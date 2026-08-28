import { getAgentActions, getRecoveryMessage, getTransaction } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const transaction = await getTransaction(params.id);
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
