import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceKey) return null;
  return createClient<Database>(supabaseUrl, serviceKey);
}

// In-memory store for demo when Supabase is not configured
export const demoStore = {
  users: new Map<string, DemoUser>(),
  transactions: new Map<string, DemoTransaction>(),
  declineEvents: [] as DemoDeclineEvent[],
  agentActions: [] as DemoAgentAction[],
  routeClusters: [] as DemoRouteCluster[],
  recoveryMessages: [] as DemoRecoveryMessage[],
};

export interface DemoUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  onboarded_at: string | null;
  workspace_name: string;
  razorpay_key_id: string | null;
  razorpay_key_secret_enc: string | null;
  whatsapp_key_enc: string | null;
  sms_key_enc: string | null;
  email_key_enc: string | null;
  created_at: string;
}

export interface DemoTransaction {
  id: string;
  user_id: string;
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

export interface DemoDeclineEvent {
  id: string;
  transaction_id: string;
  decline_code: string;
  decline_reason: string;
  created_at: string;
}

export interface DemoAgentAction {
  id: string;
  transaction_id: string;
  decision: "retry_now" | "retry_delayed" | "suggest_alt_method" | "escalate_human";
  delay_seconds: number | null;
  alt_method: string | null;
  reasoning: string;
  confidence: number;
  created_at: string;
}

export interface DemoRouteCluster {
  id: string;
  user_id: string;
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

export interface DemoRecoveryMessage {
  id: string;
  transaction_id: string;
  channel: "whatsapp" | "sms" | "email";
  body: string;
  created_at: string;
}
