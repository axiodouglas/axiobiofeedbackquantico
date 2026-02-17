
-- Table for performance advice history
CREATE TABLE public.performance_advices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('trabalho', 'reunioes', 'relacionamentos')),
  transcription TEXT,
  frequency_score INTEGER,
  advice_text TEXT NOT NULL,
  tone_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.performance_advices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own advices"
ON public.performance_advices FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advices"
ON public.performance_advices FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own advices"
ON public.performance_advices FOR DELETE
USING (auth.uid() = user_id);
