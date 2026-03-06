
-- Admin sessions table for tracking active logins
CREATE TABLE public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token text NOT NULL,
  device_type text DEFAULT 'desktop',
  browser text DEFAULT '',
  os text DEFAULT '',
  ip_address text DEFAULT '',
  location text DEFAULT '',
  login_time timestamptz NOT NULL DEFAULT now(),
  last_active timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  terminated_at timestamptz,
  terminated_reason text DEFAULT ''
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth manage own sessions" ON public.admin_sessions
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Login history table
CREATE TABLE public.login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_type text DEFAULT 'desktop',
  browser text DEFAULT '',
  os text DEFAULT '',
  ip_address text DEFAULT '',
  location text DEFAULT '',
  login_time timestamptz NOT NULL DEFAULT now(),
  success boolean NOT NULL DEFAULT true,
  failure_reason text DEFAULT ''
);

ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth manage own login history" ON public.login_history
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin settings table for recovery email etc.
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  recovery_email text DEFAULT '',
  recovery_email_verified boolean NOT NULL DEFAULT false,
  recovery_verification_code text DEFAULT '',
  recovery_code_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth manage own settings" ON public.admin_settings
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
