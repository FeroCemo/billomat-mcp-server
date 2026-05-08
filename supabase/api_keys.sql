CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  stripe_customer_id TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
-- Service role only (kein anon access)
