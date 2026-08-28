export type AgentDecision =
  | "retry_now"
  | "retry_delayed"
  | "suggest_alt_method"
  | "escalate_human";

export interface AgentDecisionObject {
  transaction_id: string;
  decline_code: string;
  decline_reason_plain: string;
  decision: AgentDecision;
  delay_seconds?: number;
  alt_method?: string;
  reasoning: string;
  drafted_message: {
    channel: "whatsapp" | "sms" | "email";
    body: string;
  };
  confidence: number;
}

export interface Transaction {
  id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  method: string;
  issuer: string;
  status: "declined" | "recovering" | "recovered" | "failed";
  decline_code: string | null;
  decline_reason: string | null;
  merchant_name: string;
  created_at: string;
  recovered_at: string | null;
}

export interface AgentAction {
  id: string;
  transaction_id: string;
  decision: AgentDecision;
  delay_seconds: number | null;
  alt_method: string | null;
  reasoning: string;
  confidence: number;
  created_at: string;
}

export interface RouteCluster {
  id: string;
  issuer: string;
  method: string;
  error_code: string;
  severity: "low" | "medium" | "high" | "critical";
  headline: string;
  summary: string;
  recommended_action: string;
  failure_rate: number;
  baseline_rate: number;
  status: "active" | "resolved";
  sparkline: number[];
  history: { date: string; resolved: boolean }[];
  created_at: string;
  resolved_at: string | null;
}

export interface RecoveryMessage {
  id: string;
  transaction_id: string;
  channel: "whatsapp" | "sms" | "email";
  body: string;
  created_at: string;
}

export type TransactionFilter = "all" | "declined" | "recovering" | "recovered";
