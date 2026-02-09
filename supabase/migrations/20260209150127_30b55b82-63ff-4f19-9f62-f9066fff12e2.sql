-- Remove the overly permissive SELECT policy that exposes PII (device fingerprints, IP addresses)
DROP POLICY IF EXISTS "Anyone can check free diagnosis usage" ON public.free_diagnosis_usage;

-- Replace with a restrictive policy: no public reads allowed
-- If validation is needed, it should be done server-side via edge functions using service role key
CREATE POLICY "No public read access"
  ON public.free_diagnosis_usage FOR SELECT
  USING (false);
