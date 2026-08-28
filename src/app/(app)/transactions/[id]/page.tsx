import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { demoStore } from "@/lib/supabase";
import { getAgentActions, getRecoveryMessage, getTransaction } from "@/lib/data";
import { TransactionDetail } from "@/components/transactions/transaction-detail";
import { notFound } from "next/navigation";

export default function TransactionPage({ params }: { params: { id: string } }) {
  const transaction = getTransaction(params.id);
  if (!transaction) notFound();

  const actions = getAgentActions(params.id);
  const message = getRecoveryMessage(params.id);

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-ink-950 border-b border-border px-6 flex items-center">
        <h1 className="font-display text-display-m text-text-primary">Transaction</h1>
      </header>
      <div className="p-6 max-w-2xl">
        <TransactionDetail
          transactionId={params.id}
          initialData={{ transaction, actions, message }}
        />
      </div>
    </>
  );
}
