
-- Block all INSERT on user_roles for authenticated users (only service role can insert)
CREATE POLICY "Block all inserts on user_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Block all UPDATE on user_roles for authenticated users
CREATE POLICY "Block all updates on user_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

-- Block all DELETE on user_roles for authenticated users
CREATE POLICY "Block all deletes on user_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);
