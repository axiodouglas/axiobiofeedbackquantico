
-- Drop the overly permissive policy and replace with authenticated-only read
DROP POLICY "Service role can manage subscriptions" ON public.assinaturas;
