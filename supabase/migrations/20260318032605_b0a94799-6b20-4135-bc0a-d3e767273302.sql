ALTER TABLE profiles DISABLE TRIGGER protect_subscription_fields_trigger;

UPDATE profiles 
SET is_premium = true, 
    subscription_type = 'semestral', 
    subscription_expires_at = NOW() + INTERVAL '180 days'
WHERE user_id = 'd06065e8-31f8-415b-a503-8cf17927c8ef';

ALTER TABLE profiles ENABLE TRIGGER protect_subscription_fields_trigger;