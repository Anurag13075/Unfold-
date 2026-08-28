import { getAgentActions, getRecoveryMessage, getTransaction } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const transaction = getTransaction(params.id);
  if (!transaction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    transaction,
    actions: getAgentActions(params.id),
    message: getRecoveryMessage(params.id),
  });
}
