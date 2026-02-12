import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Brain, Dna, Sparkles, Activity, AlertCircle, CloudUpload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const processingSteps = [
  { icon: Brain, text: "Analisando padrões de fala..." },
  { icon: Dna, text: "Rastreando heranças hereditárias..." },
  { icon: Activity, text: "Identificando frequências emocionais..." },
  { icon: Sparkles, text: "Gerando diagnóstico quântico..." },
];

type Phase = "analyzing" | "saving" | "saved" | "error";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area") || "pai";
  const { user } = useAuth();
  const audioFromState = useRef<string | null>(location.state?.audioBase64 || null);

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("analyzing");
  const [saveRetries, setSaveRetries] = useState(0);
  const analysisStarted = useRef(false);
  const analysisDataRef = useRef<any>(null);
  const userRef = useRef(user);

  // Keep userRef always up-to-date so saveToDB never uses stale user
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Progress animation (only during analyzing phase)
  useEffect(() => {
    if (phase !== "analyzing") return;

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
  }, [phase]);

  const cleanupAttempt = useCallback(() => {
    audioFromState.current = null;
  }, []);

  const handleGracefulFailure = useCallback((message?: string) => {
    cleanupAttempt();
    setPhase("error");
    setErrorMsg(message || "O áudio enviado não foi audível ou o assunto está fora do tema deste card. Para um diagnóstico preciso, grave novamente focando exclusivamente no assunto selecionado.");
  }, [cleanupAttempt]);

  // Save to database and generate quantum commands
  const saveToDB = useCallback(async (data: any): Promise<boolean> => {
    // Use ref to always get the latest user (avoids stale closure)
    let currentUser = userRef.current;
    if (!currentUser) {
      // Auth may still be loading — wait and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      currentUser = userRef.current;
      if (!currentUser) {
        setErrorMsg("Sessão expirada. Faça login novamente.");
        return false;
      }
    }

    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data: existing } = await supabase
        .from("diagnoses")
        .select("id")
        .eq("user_id", currentUser.id)
        .eq("area", area)
        .gte("created_at", `${today}T00:00:00Z`)
        .lte("created_at", `${today}T23:59:59Z`)
        .limit(1);

      let diagnosisId: string | null = null;

      if (existing && existing.length > 0) {
        diagnosisId = existing[0].id;
        diagnosisIdRef.current = diagnosisId;
        const { error } = await supabase.from("diagnoses").update({
          transcription: data.transcription || null,
          diagnosis_result: data.diagnosis,
          frequency_score: data.diagnosis.frequency_score || null,
        }).eq("id", diagnosisId);

        if (error) {
          console.error("DB update error:", error);
          setErrorMsg("Não foi possível salvar o diagnóstico. Tente novamente.");
          return false;
        }

        await supabase.from("quantum_commands").delete().eq("diagnosis_id", diagnosisId);
      } else {
        const { data: insertedRows, error } = await supabase.from("diagnoses").insert({
          user_id: currentUser.id,
          area,
          transcription: data.transcription || null,
          diagnosis_result: data.diagnosis,
          frequency_score: data.diagnosis.frequency_score || null,
        }).select("id");

        if (error) {
          console.error("DB save error:", error);
          setErrorMsg("Não foi possível salvar o diagnóstico. Tente novamente.");
          return false;
        }
        diagnosisId = insertedRows?.[0]?.id || null;
        diagnosisIdRef.current = diagnosisId;
      }

      if (diagnosisId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", currentUser.id)
          .single();
        const userName = profile?.full_name || null;

        try {
          await supabase.functions.invoke("generate-quantum-commands", {
            body: {
              diagnosis_id: diagnosisId,
              diagnosis_result: data.diagnosis,
              user_name: userName,
            },
          });
        } catch (cmdErr) {
          console.warn("Quantum commands generation failed (non-blocking):", cmdErr);
        }
      }

      return true;
    } catch (err) {
      console.error("DB save exception:", err);
      return false;
    }
  }, [area]);

  // Main analysis effect
  useEffect(() => {
    if (analysisStarted.current) return;
    analysisStarted.current = true;

    const runAnalysis = async () => {
      const audioBase64 = audioFromState.current;
      const _dbg = import.meta.env.DEV;
      if (_dbg) console.log("[AXIO-DEBUG] Starting analysis. Audio exists:", !!audioBase64, "Length:", audioBase64?.length || 0);

      if (!audioBase64) {
        handleGracefulFailure("Nenhum áudio foi encontrado para análise.");
        return;
      }

      try {
        if (_dbg) console.log("[AXIO-DEBUG] Converting audio to blob...");
        const res = await fetch(audioBase64);
        const blob = await res.blob();
        if (_dbg) console.log("[AXIO-DEBUG] Blob created. Size:", blob.size, "Type:", blob.type);

        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");
        formData.append("area", area);
        formData.append("is_premium", "false");

        if (_dbg) console.log("[AXIO-DEBUG] Calling axio-transcribe with area:", area);
        const { data, error } = await supabase.functions.invoke("axio-transcribe", {
          body: formData,
        });

        if (_dbg) console.log("[AXIO-DEBUG] axio-transcribe response:", JSON.stringify({ error: error?.message || error, dataKeys: data ? Object.keys(data) : null, dataError: data?.error }));

        if (error || data?.error) {
          if (_dbg) console.error("[AXIO-DEBUG] Transcribe failed:", error?.message || data?.error);
          handleGracefulFailure();
          return;
        }

        if (data?.diagnosis?.focus_valid === false) {
          const focusMsg = data.diagnosis.focus_message ||
            "O áudio enviado não está relacionado ao tema deste card. Para um diagnóstico preciso, grave novamente focando exclusivamente no assunto selecionado.";
          if (_dbg) console.warn("[AXIO-DEBUG] Focus invalid:", focusMsg);
          handleGracefulFailure(focusMsg);
          return;
        }

        if (!data?.diagnosis?.title || !data?.diagnosis?.blocks?.length) {
          if (_dbg) console.error("[AXIO-DEBUG] Invalid diagnosis structure:", JSON.stringify({ title: data?.diagnosis?.title, blocksLen: data?.diagnosis?.blocks?.length }));
          handleGracefulFailure();
          return;
        }

        if (_dbg) console.log("[AXIO-DEBUG] Analysis succeeded. Saving...");
        analysisDataRef.current = data;
        setProgress(100);
        setPhase("saving");

        const saved = await saveToDB(data);
        if (_dbg) console.log("[AXIO-DEBUG] Save result:", saved);
        if (saved) {
          audioFromState.current = null;
          setPhase("saved");
        } else {
          setSaveRetries(1);
          setPhase("error");
          setErrorMsg("Erro ao salvar o diagnóstico na nuvem. Tente novamente.");
        }
      } catch (err) {
        if (_dbg) console.error("[AXIO-DEBUG] Uncaught error:", err);
        handleGracefulFailure();
      }
    };

    runAnalysis();
  }, [area, handleGracefulFailure, saveToDB]);

  const handleRetrySave = async () => {
    if (!analysisDataRef.current) return;
    setPhase("saving");
    const saved = await saveToDB(analysisDataRef.current);
    if (saved) {
      audioFromState.current = null;
      setPhase("saved");
    } else {
      setSaveRetries((r) => r + 1);
      setPhase("error");
      setErrorMsg(
        saveRetries >= 2
          ? "Falha persistente ao salvar. O relatório está disponível, mas pode não aparecer no seu histórico."
          : "Erro ao salvar o diagnóstico na nuvem. Tentando novamente..."
      );
    }
  };

  const handleRetry = () => {
    cleanupAttempt();
    navigate(`/recording?area=${area}`);
  };

  const handleGoHome = () => {
    cleanupAttempt();
    navigate("/area-selection");
  };

  const diagnosisIdRef = useRef<string | null>(null);

  const handleFinish = () => {
    if (diagnosisIdRef.current) {
      navigate(`/diagnosis/${diagnosisIdRef.current}`);
    } else {
      navigate(`/report?area=${area}`);
    }
  };

  // SAVING STATE
  if (phase === "saving") {
    return (
      <div className="min-h-screen bg-background noise flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <CloudUpload className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Salvando seu diagnóstico na nuvem...
            </h2>
            <p className="text-muted-foreground text-sm">
              Aguarde enquanto salvamos seus resultados com segurança.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SAVED STATE — show "Finish" button
  if (phase === "saved") {
    return (
      <div className="min-h-screen bg-background noise flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Diagnóstico salvo com sucesso!
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Seu relatório está pronto e disponível no seu histórico.
            </p>
            <Button variant="cyan" size="lg" onClick={handleFinish}>
              Finalizar e Ver Relatório
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (phase === "error") {
    const isSaveError = !!analysisDataRef.current;
    return (
      <div className="min-h-screen bg-background noise flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>

            <h2 className="text-xl font-bold text-foreground mb-4">
              {isSaveError ? "Erro ao Salvar" : "Diagnóstico Interrompido"}
            </h2>

            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              {errorMsg}
            </p>

            <div className="flex flex-col gap-3">
              {isSaveError ? (
                <>
                  <Button variant="cyan" size="lg" onClick={handleRetrySave}>
                    Tentar Salvar Novamente
                  </Button>
                  {saveRetries >= 2 && (
                    <Button variant="cyanOutline" size="sm" onClick={handleFinish}>
                      Ver Relatório Mesmo Assim
                    </Button>
                  )}
                </>
              ) : (
                <Button variant="cyan" size="lg" onClick={handleRetry}>
                  Tentar Novamente
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleGoHome}>
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ANALYZING STATE
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
            Processando análise quântica...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Processing;
