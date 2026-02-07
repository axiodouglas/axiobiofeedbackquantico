import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Brain, Dna, Sparkles, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const processingSteps = [
  { icon: Brain, text: "Analisando padrões de fala..." },
  { icon: Dna, text: "Rastreando heranças hereditárias..." },
  { icon: Activity, text: "Identificando frequências emocionais..." },
  { icon: Sparkles, text: "Gerando diagnóstico quântico..." },
];

const Processing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area") || "pai";

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const analysisStarted = useRef(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 0.5));
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev >= processingSteps.length - 1 ? prev : prev + 1));
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  useEffect(() => {
    if (analysisStarted.current) return;
    analysisStarted.current = true;

    const runAnalysis = async () => {
      const audioBase64 = sessionStorage.getItem("axio_audio");

      try {
        if (audioBase64) {
          // Convert base64 data URL back to blob
          const res = await fetch(audioBase64);
          const blob = await res.blob();

          const formData = new FormData();
          formData.append("audio", blob, "recording.webm");
          formData.append("area", area);
          formData.append("is_premium", "false");

          const { data, error } = await supabase.functions.invoke("axio-transcribe", {
            body: formData,
          });

          if (error) throw error;
          if (data?.error) throw new Error(data.error);

          // Check focus validation
          if (data?.diagnosis?.focus_valid === false) {
            sessionStorage.setItem("axio_focus_error", data.diagnosis.focus_message || "");
            sessionStorage.removeItem("axio_audio");
            navigate(`/recording?area=${area}&focus_error=true`);
            return;
          }

          sessionStorage.setItem("axio_result", JSON.stringify(data));
          sessionStorage.removeItem("axio_audio");
          setProgress(100);

          setTimeout(() => navigate(`/report?area=${area}`), 800);
        } else {
          // No audio - use mock fallback (navigate after animation)
          setTimeout(() => {
            setProgress(100);
            setTimeout(() => navigate(`/report?area=${area}`), 800);
          }, 5000);
        }
      } catch (err: any) {
        console.error("Processing error:", err);
        setErrorMsg(err?.message || "Erro no processamento");
        // Fallback to mock report after error
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => navigate(`/report?area=${area}`), 800);
        }, 2000);
      }
    };

    runAnalysis();
  }, [area, navigate]);

  return (
    <div className="min-h-screen bg-background noise flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-lg mx-auto">
          {/* Quantum Animation */}
          <div className="relative w-48 h-48 mx-auto mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/30 animate-quantum-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-primary animate-quantum-orbit" />
            </div>
            <div className="absolute inset-0" style={{ animationDelay: "1s" }}>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-cyan-light animate-quantum-orbit" style={{ animationDelay: "-1.3s" }} />
            </div>
            <div className="absolute inset-0" style={{ animationDelay: "2s" }}>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-cyan-dark animate-quantum-orbit" style={{ animationDelay: "-2.6s" }} />
            </div>
            <div className="absolute inset-4 rounded-full border border-primary/30 animate-spin" style={{ animationDuration: "8s" }} />
            <div className="absolute inset-8 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
            <div className="absolute inset-12 rounded-full border border-primary/10 animate-spin" style={{ animationDuration: "4s" }} />
          </div>

          {/* Processing Steps */}
          <div className="space-y-4 mb-8">
            {processingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isActive ? "text-primary scale-105" : isCompleted ? "text-primary/60" : "text-muted-foreground/40"
                  }`}
                >
                  <StepIcon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                  <span className="text-left">{step.text}</span>
                  {isCompleted && <span className="ml-auto text-primary">✓</span>}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-primary to-cyan-light h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-muted-foreground text-sm">
            {errorMsg
              ? `⚠️ ${errorMsg} — Usando análise padrão...`
              : `Processando análise quântica... ${Math.round(progress)}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Processing;
