export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          image?: string | null;
          onboarded_at?: string | null;
          workspace_name?: string;
          razorpay_key_id?: string | null;
          razorpay_key_secret_enc?: string | null;
          whatsapp_key_enc?: string | null;
          sms_key_enc?: string | null;
          email_key_enc?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          razorpay_payment_id: string;
          amount: number;
          currency: string;
          method: string;
          issuer: string;
          status: string;
          decline_code: string | null;
          decline_reason: string | null;
          merchant_name: string;
          created_at: string;
          recovered_at: string | null;
        };
      };
      agent_actions: {
        Row: {
          id: string;
          transaction_id: string;
          decision: string;
          delay_seconds: number | null;
          alt_method: string | null;
          reasoning: string;
          confidence: number;
          created_at: string;
        };
      };
      route_clusters: {
        Row: {
          id: string;
          user_id: string;
          issuer: string;
          method: string;
          error_code: string;
          severity: string;
          headline: string;
          summary: string;
          recommended_action: string;
          failure_rate: number;
          baseline_rate: number;
          status: string;
          sparkline: number[];
          history: Json;
          created_at: string;
          resolved_at: string | null;
        };
      };
      recovery_messages: {
        Row: {
          id: string;
          transaction_id: string;
          channel: string;
          body: string;
          created_at: string;
        };
      };
    };
  };
}
