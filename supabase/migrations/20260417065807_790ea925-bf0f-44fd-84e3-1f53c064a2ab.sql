-- Bucket privado para áudios quânticos (admin-only)
INSERT INTO storage.buckets (id, name, public)
VALUES ('axio-quantum-core', 'axio-quantum-core', false)
ON CONFLICT (id) DO NOTHING;

-- Apenas admins podem listar/ler arquivos do bucket
CREATE POLICY "Admins can read quantum core audio"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'axio-quantum-core'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can upload quantum core audio"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'axio-quantum-core'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update quantum core audio"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'axio-quantum-core'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete quantum core audio"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'axio-quantum-core'
  AND public.has_role(auth.uid(), 'admin')
);