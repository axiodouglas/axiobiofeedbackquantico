-- Profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  is_premium BOOLEAN DEFAULT false,
  subscription_type TEXT, -- 'monthly', 'annual', 'lifetime'
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Diagnoses table for storing audio analysis results
CREATE TABLE public.diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  area TEXT NOT NULL CHECK (area IN ('financeiro', 'relacionamento', 'saude', 'familiar')),
  audio_url TEXT,
  transcription TEXT,
  diagnosis_result JSONB,
  frequency_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for diagnoses
CREATE POLICY "Users can view their own diagnoses"
  ON public.diagnoses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
  ON public.diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Free diagnosis tracking (by device fingerprint for unauthenticated users)
CREATE TABLE public.free_diagnosis_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_fingerprint TEXT NOT NULL,
  ip_address TEXT,
  area TEXT NOT NULL DEFAULT 'financeiro',
  used_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(device_fingerprint)
);

-- Enable RLS (public read/write for tracking)
ALTER TABLE public.free_diagnosis_usage ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check and insert (for unauthenticated free diagnosis)
CREATE POLICY "Anyone can check free diagnosis usage"
  ON public.free_diagnosis_usage FOR SELECT
  USING (true);

CREATE POLICY "Anyone can record free diagnosis usage"
  ON public.free_diagnosis_usage FOR INSERT
  WITH CHECK (true);

-- Quantum commands table (premium content)
CREATE TABLE public.quantum_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id UUID REFERENCES public.diagnoses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  command_text TEXT NOT NULL,
  command_type TEXT, -- 'reprogramming', 'meditation', 'affirmation'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.quantum_commands ENABLE ROW LEVEL SECURITY;

-- Only premium users can view their commands
CREATE POLICY "Premium users can view their commands"
  ON public.quantum_commands FOR SELECT
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_premium = true
    )
  );

CREATE POLICY "System can insert commands"
  ON public.quantum_commands FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-recordings', 'audio-recordings', false);

-- Storage policies for audio recordings
CREATE POLICY "Users can upload their own audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'audio-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'audio-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();