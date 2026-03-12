
CREATE OR REPLACE FUNCTION public.protect_subscription_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium
     OR NEW.subscription_expires_at IS DISTINCT FROM OLD.subscription_expires_at
     OR NEW.subscription_type IS DISTINCT FROM OLD.subscription_type
     OR NEW.free_diagnosis_reset_at IS DISTINCT FROM OLD.free_diagnosis_reset_at
  THEN
    RAISE EXCEPTION 'Não é permitido alterar campos de assinatura diretamente.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_subscription_fields_trigger ON public.profiles;
CREATE TRIGGER protect_subscription_fields_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_subscription_fields();
