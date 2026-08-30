-- Undrop Supabase schema
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  image TEXT,
  onboarded_at TIMESTAMPTZ,
  workspace_name TEXT DEFAULT 'My Workspace',
  razorpay_key_id TEXT,
  razorpay_key_secret_enc TEXT,
  razorpay_webhook_secret_enc TEXT,
  whatsapp_key_enc TEXT,
  sms_key_enc TEXT,
  email_key_enc TEXT,
  telegram_key_enc TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  method TEXT NOT NULL,
  issuer TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('declined', 'recovering', 'recovered', 'failed', 'escalated')),
  decline_code TEXT,
  decline_reason TEXT,
  merchant_name TEXT NOT NULL,
  customer_email TEXT,
  customer_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  recovered_at TIMESTAMPTZ
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

CREATE TABLE IF NOT EXISTS decline_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  decline_code TEXT NOT NULL,
  decline_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_actions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  decision TEXT NOT NULL CHECK (decision IN ('retry_now', 'retry_delayed', 'suggest_alt_method', 'escalate_human')),
  delay_seconds INTEGER,
  alt_method TEXT,
  reasoning TEXT NOT NULL,
  confidence REAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS route_clusters (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issuer TEXT NOT NULL,
  method TEXT NOT NULL,
  error_code TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  failure_rate REAL NOT NULL,
  baseline_rate REAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved')),
  sparkline JSONB NOT NULL DEFAULT '[]',
  history JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS recovery_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'email')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can read own clusters" ON route_clusters FOR SELECT USING (auth.uid()::text = user_id);
