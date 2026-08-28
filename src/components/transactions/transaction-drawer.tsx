"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { TransactionDetail } from "@/components/transactions/transaction-detail";
import type { Transaction } from "@/types";

interface TransactionDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDrawer({ transaction, open, onClose }: TransactionDrawerProps) {
  return (
    <AnimatePresence>
      {open && transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-[rgba(8,9,11,0.6)]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[480px] bg-surface-800 border-l border-border shadow-modal overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between h-14 px-5 bg-surface-800 border-b border-border">
              <span className="font-mono text-mono-s text-text-tertiary">
                {transaction.razorpay_payment_id}
              </span>
              <button
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                <X size={20} weight="thin" />
              </button>
            </div>
            <div className="p-5">
              <TransactionDetail transactionId={transaction.id} compact />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
