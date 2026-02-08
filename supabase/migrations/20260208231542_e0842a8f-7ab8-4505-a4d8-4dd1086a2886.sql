
ALTER TABLE public.diagnoses DROP CONSTRAINT diagnoses_area_check;

ALTER TABLE public.diagnoses ADD CONSTRAINT diagnoses_area_check 
CHECK (area = ANY (ARRAY['financeiro','relacionamento','saude','familiar','pai','mae','traumas']));
