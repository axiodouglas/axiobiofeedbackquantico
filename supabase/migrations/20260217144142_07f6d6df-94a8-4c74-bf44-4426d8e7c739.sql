
CREATE TABLE public.assinaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  status_pagamento TEXT NOT NULL DEFAULT 'pending',
  kiwify_order_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
ON public.assinaturas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
ON public.assinaturas FOR ALL
USING (true)
WITH CHECK (true);

-- Only allow service_role (edge functions) to insert/update, block regular users
CREATE POLICY "Block user inserts on assinaturas"
ON public.assinaturas FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block user updates on assinaturas"
ON public.assinaturas FOR UPDATE
USING (false);

CREATE POLICY "Block user deletes on assinaturas"
ON public.assinaturas FOR DELETE
USING (false);

CREATE TRIGGER update_assinaturas_updated_at
BEFORE UPDATE ON public.assinaturas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
