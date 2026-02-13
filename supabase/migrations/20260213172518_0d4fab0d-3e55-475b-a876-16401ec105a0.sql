
-- Create storage bucket for error report screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('error-reports', 'error-reports', true);

-- Allow authenticated users to upload to error-reports bucket
CREATE POLICY "Authenticated users can upload error reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'error-reports' AND auth.uid() IS NOT NULL);

-- Allow public read access for error report images
CREATE POLICY "Public read access for error reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'error-reports');
