import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Brain, Dna, Sparkles, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [hasFailed, setHasFailed] = useState(false);
  const analysisStarted = useRef(false);

  useEffect(() => {
    if (hasFailed) return;

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
  }, [hasFailed]);

  useEffect(() => {
    if (analysisStarted.current) return;
    analysisStarted.current = true;

    const runAnalysis = async () => {
      const audioBase64 = sessionStorage.getItem("axio_audio");

      // HARD STOP: No audio = no report
      if (!audioBase64) {
        handleGracefulFailure("Nenhum áudio foi encontrado para análise.");
        return;
      }

      try {
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

        // HARD STOP: Edge function error = no report (silent, graceful)
        if (error) {
          handleGracefulFailure();
          return;
        }

        // HARD STOP: API returned error = no report (silent, graceful)
        if (data?.error) {
          handleGracefulFailure();
          return;
        }

        // Graceful handling: Focus validation failed = redirect to recording (expected flow event)
        if (data?.diagnosis?.focus_valid === false) {
          sessionStorage.setItem("axio_focus_error", data.diagnosis.focus_message || "");
          cleanupAttempt();
          navigate(`/recording?area=${area}&focus_error=true`);
          return;
        }

        // HARD STOP: No valid diagnosis data = no report (silent, graceful)
        if (!data?.diagnosis || !data?.diagnosis?.title || !data?.diagnosis?.blocks?.length) {
          handleGracefulFailure();
          return;
        }

        // SUCCESS: Valid diagnosis - save and navigate
        sessionStorage.setItem("axio_result", JSON.stringify(data));
        sessionStorage.removeItem("axio_audio");
        setProgress(100);
        setTimeout(() => navigate(`/report?area=${area}`), 800);
      } catch {
        // Silent catch — treated as graceful failure, not a system error
        handleGracefulFailure();
      }
    };

    runAnalysis();
  }, [area, navigate]);

  const handleGracefulFailure = (message?: string) => {
    cleanupAttempt();
    setHasFailed(true);
    setErrorMsg(message || "O áudio enviado não foi audível ou o assunto está fora do tema deste card. Para um diagnóstico preciso, grave novamente focando exclusivamente no assunto selecionado.");
  };

  const cleanupAttempt = () => {
    sessionStorage.removeItem("axio_audio");
    sessionStorage.removeItem("axio_result");
    sessionStorage.removeItem("axio_area");
    sessionStorage.removeItem("axio_focus_error");
  };

  const handleRetry = () => {
    cleanupAttempt();
    navigate(`/recording?area=${area}`);
  };

  const handleGoHome = () => {
    cleanupAttempt();
    navigate("/area-selection");
  };

  // ERROR STATE - Hard stop, no report generated
  if (hasFailed) {
    return (
      <div className="min-h-screen bg-background noise flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>

            <h2 className="text-xl font-bold text-foreground mb-4">
              Diagnóstico Interrompido
            </h2>

            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              {errorMsg}
            </p>

            <div className="flex flex-col gap-3">
              <Button variant="cyan" size="lg" onClick={handleRetry}>
                Tentar Novamente
              </Button>
              <Button variant="ghost" size="sm" onClick={handleGoHome}>
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Processando análise quântica... {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Processing;
