import {
  getRecoveryMessage,
  getTransaction,
  logCopilotToolAction,
  logRecoveryMessageTrace,
  updateTransactionStatus,
} from "@/lib/data";
import {
  sendEmailOutreach,
  sendSmsOutreach,
  sendTelegramOutreach,
  sendWhatsappOutreach,
  type OutreachResult,
} from "@/lib/outreach";
import {
  getMerchantEmailKey,
  getMerchantSmsConfig,
  getMerchantTelegramConfig,
  getMerchantWhatsappConfig,
} from "@/lib/outreach-config";
import { getUserById } from "@/lib/users";
import { formatCurrency } from "@/lib/utils";

export type CopilotToolName = "resend_recovery_message" | "mark_transaction_status";

export interface PendingCopilotToolCall {
  name: CopilotToolName;
  params: Record<string, unknown>;
}

export interface ToolExecutionResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

export const copilotTools = [
  {
    type: "function",
    function: {
      name: "resend_recovery_message",
      description: "Resend a payment recovery message to the customer via a specific channel.",
      parameters: {
        type: "object",
        properties: {
          transactionId: {
            type: "string",
            description: "Existing Undrop transaction ID, for example txn_pay_123 or txn_sim_ab12cd34.",
          },
          channel: {
            type: "string",
            enum: ["email", "sms", "whatsapp", "telegram"],
          },
          reason: {
            type: "string",
            description: "Optional merchant-provided reason for resending the recovery message.",
          },
        },
        required: ["transactionId", "channel"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "mark_transaction_status",
      description: "Manually update a transaction's status - use only when the merchant explicitly confirms this action.",
      parameters: {
        type: "object",
        properties: {
          transactionId: {
            type: "string",
            description: "Existing Undrop transaction ID.",
          },
          status: {
            type: "string",
            enum: ["recovered", "escalated"],
          },
        },
        required: ["transactionId", "status"],
      },
    },
  },
] as const;

function getStringParam(params: Record<string, unknown>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value.trim() : "";
}

function getRecoveryUrl(baseUrl: string, transactionId: string) {
  return `${baseUrl.replace(/\/$/, "")}/recover/${transactionId}`;
}

export async function describeCopilotToolConsequence(
  userId: string,
  toolCall: PendingCopilotToolCall
): Promise<{ ok: true; message: string; pendingToolCall: PendingCopilotToolCall } | { ok: false; message: string }> {
  if (toolCall.name === "resend_recovery_message") {
    const transactionId = getStringParam(toolCall.params, "transactionId");
    const channel = getStringParam(toolCall.params, "channel");
    const transaction = await getTransaction(transactionId, userId);

    if (!transaction) {
      return { ok: false, message: "I can't find that transaction for your workspace." };
    }
    if (!["email", "sms", "whatsapp", "telegram"].includes(channel)) {
      return { ok: false, message: "Choose one supported channel: email, sms, whatsapp, or telegram." };
    }
    if (channel === "email" && !transaction.customer_email) {
      return { ok: false, message: "I can't resend email for this transaction because no real customer email is stored." };
    }
    if ((channel === "sms" || channel === "whatsapp") && !transaction.customer_contact) {
      return { ok: false, message: `I can't resend ${channel} for this transaction because no real customer phone number is stored.` };
    }
    if (channel === "telegram") {
      const user = await getUserById(userId);
      const telegramConfig = user ? getMerchantTelegramConfig(user) : null;
      if (!telegramConfig) {
        return { ok: false, message: "I can't send a Telegram recovery alert because no merchant Telegram config is stored." };
      }
    }

    return {
      ok: true,
      pendingToolCall: {
        name: "resend_recovery_message",
        params: {
          transactionId,
          channel,
          reason: getStringParam(toolCall.params, "reason") || undefined,
        },
      },
      message: `I will resend a ${channel} recovery message for ${transaction.merchant_name}'s ${formatCurrency(transaction.amount)} ${transaction.status} transaction (${transaction.id}). Confirm this action?`,
    };
  }

  if (toolCall.name === "mark_transaction_status") {
    const transactionId = getStringParam(toolCall.params, "transactionId");
    const status = getStringParam(toolCall.params, "status");
    const transaction = await getTransaction(transactionId, userId);

    if (!transaction) {
      return { ok: false, message: "I can't find that transaction for your workspace." };
    }
    if (status !== "recovered" && status !== "escalated") {
      return { ok: false, message: "I can only mark a transaction as recovered or escalated." };
    }

    return {
      ok: true,
      pendingToolCall: {
        name: "mark_transaction_status",
        params: { transactionId, status },
      },
      message: `I will mark ${transaction.merchant_name}'s ${formatCurrency(transaction.amount)} transaction (${transaction.id}) as ${status}. This changes the merchant record and writes a copilot audit action. Confirm this action?`,
    };
  }

  return { ok: false, message: "That tool is not available in this workspace." };
}

export async function executeCopilotTool(params: {
  userId: string;
  toolCall: PendingCopilotToolCall;
  baseUrl: string;
}): Promise<ToolExecutionResult> {
  const transactionId = getStringParam(params.toolCall.params, "transactionId");
  const transaction = await getTransaction(transactionId, params.userId);

  if (!transaction) {
    return { success: false, message: "I can't find that transaction for your workspace." };
  }

  if (params.toolCall.name === "mark_transaction_status") {
    const status = getStringParam(params.toolCall.params, "status");
    if (status !== "recovered" && status !== "escalated") {
      return { success: false, message: "I can only mark a transaction as recovered or escalated." };
    }

    const updated = await updateTransactionStatus(transaction.id, params.userId, status);
    if (!updated) {
      return { success: false, message: `I could not update ${transaction.id}. The database rejected the status change.` };
    }

    await logCopilotToolAction({
      transactionId: transaction.id,
      toolName: "mark_transaction_status",
      summary: `Marked transaction as ${status}`,
    });

    return {
      success: true,
      message: `Marked ${updated.id} as ${updated.status}. Audit entry written at ${new Date().toISOString()}.`,
      details: { transactionId: updated.id, status: updated.status, recoveredAt: updated.recovered_at },
    };
  }

  if (params.toolCall.name === "resend_recovery_message") {
    const channel = getStringParam(params.toolCall.params, "channel") as "email" | "sms" | "whatsapp" | "telegram";
    const user = await getUserById(params.userId);
    if (!user) {
      return { success: false, message: "I could not load the merchant configuration for this workspace." };
    }

    const recoveryUrl = getRecoveryUrl(params.baseUrl, transaction.id);
    const savedMessage = await getRecoveryMessage(transaction.id);
    const body =
      savedMessage?.body ||
      `Your payment of ${formatCurrency(transaction.amount)} to ${transaction.merchant_name} failed. Tap to recover in one step.`;

    let result: OutreachResult;

    if (channel === "email") {
      if (!transaction.customer_email) {
        return { success: false, message: "I can't send email because this transaction has no stored customer email." };
      }
      result = await sendEmailOutreach({
        to: transaction.customer_email,
        subject: `[Payment Recovery] Action required for ${formatCurrency(transaction.amount)}`,
        merchantName: transaction.merchant_name,
        amount: transaction.amount,
        recoveryUrl,
        customApiKey: getMerchantEmailKey(user) || undefined,
      });
      await logRecoveryMessageTrace({
        transactionId: transaction.id,
        channel: "email",
        body: `[Copilot resend via ${result.provider}] Recovery Link: ${recoveryUrl}`,
      });
    } else if (channel === "sms") {
      if (!transaction.customer_contact) {
        return { success: false, message: "I can't send SMS because this transaction has no stored customer phone number." };
      }
      const smsConfig = getMerchantSmsConfig(user);
      result = await sendSmsOutreach({
        to: transaction.customer_contact,
        body,
        recoveryUrl,
        customSid: smsConfig?.sid,
        customToken: smsConfig?.token,
        customFrom: smsConfig?.from,
      });
      await logRecoveryMessageTrace({
        transactionId: transaction.id,
        channel: "sms",
        body: `[Copilot resend via ${result.provider}] Recovery Link: ${recoveryUrl}`,
      });
    } else if (channel === "whatsapp") {
      if (!transaction.customer_contact) {
        return { success: false, message: "I can't send WhatsApp because this transaction has no stored customer phone number." };
      }
      const whatsappConfig = getMerchantWhatsappConfig(user);
      result = await sendWhatsappOutreach({
        to: transaction.customer_contact,
        body,
        recoveryUrl,
        customSid: whatsappConfig?.sid,
        customToken: whatsappConfig?.token,
        customFrom: whatsappConfig?.from,
      });
      await logRecoveryMessageTrace({
        transactionId: transaction.id,
        channel: "whatsapp",
        body: `[Copilot resend via ${result.provider}] Recovery Link: ${recoveryUrl}`,
      });
    } else {
      const telegramConfig = getMerchantTelegramConfig(user);
      if (!telegramConfig) {
        return { success: false, message: "I can't send Telegram because no merchant Telegram config is stored." };
      }
      result = await sendTelegramOutreach({
        text: `Recovery resend requested for ${transaction.id}: ${formatCurrency(transaction.amount)} at ${transaction.merchant_name}.`,
        recoveryUrl,
        customBotToken: telegramConfig.botToken,
        customChatId: telegramConfig.chatId,
      });
    }

    await logCopilotToolAction({
      transactionId: transaction.id,
      toolName: "resend_recovery_message",
      summary: `Resent ${channel} recovery message via ${result.provider}`,
    });

    return {
      success: result.success,
      message: result.success
        ? `Resent ${channel} recovery for ${transaction.id} via ${result.provider}${result.simulated ? " in simulation mode" : ""}. Audit entry written.`
        : `The ${channel} resend for ${transaction.id} failed via ${result.provider}: ${result.error || "unknown provider error"}.`,
      details: {
        transactionId: transaction.id,
        channel,
        provider: result.provider,
        simulated: result.simulated,
        details: result.details,
      },
    };
  }

  return { success: false, message: "That tool is not available in this workspace." };
}
