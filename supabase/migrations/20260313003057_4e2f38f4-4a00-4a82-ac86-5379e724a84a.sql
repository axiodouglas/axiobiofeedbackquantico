-- Temporarily disable trigger to fix pending payment
ALTER TABLE public.profiles DISABLE TRIGGER ALL;
UPDATE public.profiles SET is_premium = true, subscription_type = 'trimestral', subscription_expires_at = (NOW() + INTERVAL '90 days')::timestamptz WHERE user_id = 'e65051f9-c694-4b20-b453-2ad09b09bf3a';
ALTER TABLE public.profiles ENABLE TRIGGER ALL;