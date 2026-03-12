
CREATE TABLE public.ai_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  estimated_cost numeric(10,4) NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to ai_usage_logs"
  ON public.ai_usage_logs
  FOR SELECT
  TO public
  USING (false);

CREATE POLICY "No public insert on ai_usage_logs"
  ON public.ai_usage_logs
  FOR INSERT
  TO public
  WITH CHECK (false);

CREATE POLICY "No public update on ai_usage_logs"
  ON public.ai_usage_logs
  FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "No public delete on ai_usage_logs"
  ON public.ai_usage_logs
  FOR DELETE
  TO public
  USING (false);

CREATE INDEX idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at);
