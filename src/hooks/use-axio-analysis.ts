import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DiagnosisBlock {
  name: string;
  description: string;
  origin: string;
}

export interface SecondaryImpacts {
  financeiro?: string;
  saude?: string;
  relacionamentos?: string;
}

export interface DiagnosisResult {
  focus_valid: boolean;
  focus_message?: string;
  detected_area?: string;
  title: string;
  frequency_score: number;
  blocks: DiagnosisBlock[];
  summary: string;
  root_wound: string;
  predominant_sentiments: { name: string; intensity: number }[];
  secondary_impacts?: SecondaryImpacts;
  cta_message: string;
  is_premium: boolean;
  deep_analysis?: string;
  quantum_command?: string;
  meditation_focus?: string;
}

export interface TranscriptionResult {
  transcription: string;
  diagnosis: DiagnosisResult;
}

export function useAxioAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);

  const analyzeAudio = async (audioBlob: Blob, area: string, isPremium = false) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("area", area);
      formData.append("is_premium", isPremium.toString());

      const { data, error: fnError } = await supabase.functions.invoke("axio-transcribe", {
        body: formData,
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data as TranscriptionResult);
      return data as TranscriptionResult;
    } catch (err: any) {
      const message = err?.message || "Erro ao analisar áudio";
      setError(message);
      console.error("Analysis error:", err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeText = async (transcription: string, area: string, isPremium = false) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("axio-analyze", {
        body: { transcription, area, is_premium: isPremium },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      const diagResult: TranscriptionResult = {
        transcription,
        diagnosis: data as DiagnosisResult,
      };
      setResult(diagResult);
      return diagResult;
    } catch (err: any) {
      const message = err?.message || "Erro ao analisar";
      setError(message);
      console.error("Analysis error:", err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeAudio, analyzeText, isAnalyzing, error, result };
}
