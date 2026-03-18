
DROP POLICY IF EXISTS "Premium users can view their commands" ON public.quantum_commands;
CREATE POLICY "Premium or admin users can view their commands"
ON public.quantum_commands
FOR SELECT
TO public
USING (
  (auth.uid() = user_id)
  AND (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_premium = true)
    OR public.has_role(auth.uid(), 'admin')
  )
);
