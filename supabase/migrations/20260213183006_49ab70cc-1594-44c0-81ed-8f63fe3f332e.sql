-- Make error-reports bucket private
UPDATE storage.buckets SET public = false WHERE id = 'error-reports';

-- Drop any existing public read policy
DROP POLICY IF EXISTS "Public read access for error reports" ON storage.objects;

-- Add policy: users can only read their own error reports
CREATE POLICY "Users can read their own error reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'error-reports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);