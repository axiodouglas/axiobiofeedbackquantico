
-- Allow admins to read ai_usage_logs (needed for realtime subscription)
CREATE POLICY "Admins can view ai_usage_logs"
  ON public.ai_usage_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
