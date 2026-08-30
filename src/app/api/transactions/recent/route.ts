import { auth } from "@/lib/auth";
import { getTransactions } from "@/lib/data";
import { NextResponse } from "next/server";

// Lists the CURRENT session user's own recent transactions, for use in
// Settings' Live Dispatch Tester so it can test outreach against a real
// transaction's actual amount/details instead of a hardcoded demo value.
// Deliberately scoped to session.user.id — never accepts a userId param —
// so one merchant can never enumerate another merchant's transactions.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await getTransactions(session.user.id, "all");

  const recent = transactions.slice(0, 20).map((t) => ({
    id: t.id,
    amount: t.amount,
    status: t.status,
    method: t.method,
    merchant_name: t.merchant_name,
    created_at: t.created_at,
  }));

  return NextResponse.json({ transactions: recent });
}
