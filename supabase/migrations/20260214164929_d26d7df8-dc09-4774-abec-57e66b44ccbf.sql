
-- Add column to track when a user's free diagnosis was reset (after premium expiry)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS free_diagnosis_reset_at timestamp with time zone DEFAULT NULL;
