import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mic, Square, ArrowLeft, Play, AlertTriangle, Clock, FileText } from "lucide-react";
import { AreaDiagnosisList } from "@/components/AreaReportsList";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAxioAnalysis } from "@/hooks/use-axio-analysis";
import { useAuth } from "@/hooks/use-auth";
import { useFreeDiagnosisUsed } from "@/hooks/use-free-diagnosis";
import { useAreaLock } from "@/hooks/use-area-lock";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAX_RECORDING_TIME_DEFAULT = 120;
const MAX_RECORDING_TIME_ADMIN = 600; // 10 minutes for admin
const MAX_AUDIO_SIZE_MB = 10;
const VALID_AREAS = ["pai", "mae", "traumas", "relacionamento", "crencas_limitantes"];

const areaNames: Record<string, string> = {
  pai: "Pai", mae: "Mãe", traumas: "Traumas Adicionais", relacionamento: "Relacionamentos",
  crencas_limitantes: "Crenças Limitantes",
};

const Recording = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawArea = searchParams.get("area") || "crencas_limitantes";
  const area = VALID_AREAS.includes(rawArea) ? rawArea : "crencas_limitantes";

  const { user, profile, loading: authLoading } = useAuth();
  const { freeDiagnosisUsed, loading: freeLoading } = useFreeDiagnosisUsed(user?.id);
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsAdmin(false); setAdminLoading(false); return; }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => { setIsAdmin(!!data); setAdminLoading(false); });
  }, [user]);

  const { lockedAreas, loading: lockLoading } = useAreaLock(user?.id, isAdmin);

  const isPremium = profile?.is_premium && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef(false);

  const { isAnalyzing } = useAxioAnalysis();

  const audioUrl = useMemo(() => {
    if (!audioBlob) return null;
    return URL.createObjectURL(audioBlob);
  }, [audioBlob]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const isAreaLocked = isPremium && !isAdmin && lockedAreas[area]?.locked;

  const [areaDiagnoses, setAreaDiagnoses] = useState<{ id: string; area: string; created_at: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("diagnoses")
      .select("id, area, created_at, diagnosis_result")
      .eq("user_id", user.id)
      .eq("area", area)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setAreaDiagnoses((data ?? []).map(d => ({ id: d.id, area: d.area, created_at: d.created_at })));
      });
  }, [user, area]);

  useEffect(() => {
    if (accessChecked) return;
    if (authLoading || freeLoading || lockLoading || adminLoading) return;
    setAccessChecked(true);

    if (isPremium || isAdmin) return;

    // Non-premium already used free diagnosis
    if (freeDiagnosisUsed) {
      toast({
        title: "Diagnóstico gratuito já utilizado",
        description: "Você já utilizou seu diagnóstico gratuito. Assine um plano para continuar.",
        variant: "destructive",
      });
      navigate("/planos", { replace: true });
    }
  }, [authLoading, freeLoading, lockLoading, adminLoading, isPremium, isAdmin, area, freeDiagnosisUsed, navigate, toast, accessChecked]);

  if (authLoading || freeLoading || lockLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Mic className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  const getSupportedMimeType = (): string => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
      });
      const mimeType = getSupportedMimeType();
      const recorderOptions = mimeType ? { mimeType } : {};
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, recorderOptions);
      } catch {
        // Fallback: let browser choose the format
        mediaRecorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
          setAudioBlob(blob);
        } catch (e) {
          console.error("Error creating audio blob:", e);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = (event: any) => {
        console.error("MediaRecorder error:", event?.error);
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        isRecordingRef.current = false;
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        toast({ title: "Erro na gravação", description: "Tente novamente.", variant: "destructive" });
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordingTime(0);
      setConfirmed(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxTime - 1) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
              mediaRecorderRef.current.stop();
              isRecordingRef.current = false;
              if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
            }
            setIsRecording(false);
            return maxTime;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error("Error accessing microphone:", error);
      const isPermissionDenied = error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError";
      const isNotFound = error?.name === "NotFoundError" || error?.name === "DevicesNotFoundError";
      toast({
        title: isPermissionDenied ? "Permissão Negada" : isNotFound ? "Microfone Não Encontrado" : "Erro Ao Acessar Microfone",
        description: isPermissionDenied
          ? "Permita o acesso ao microfone nas configurações do navegador e tente novamente."
          : isNotFound
          ? "Nenhum microfone foi detectado no seu dispositivo."
          : "Não foi possível iniciar a gravação. Verifique se outro app está usando o microfone e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (isRecordingRef.current || mediaRecorderRef.current.state === "recording")) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;
    if (recordingTime < 10) {
      alert("Grave pelo menos 10 segundos para um diagnóstico válido.");
      return;
    }

    const maxBytes = MAX_AUDIO_SIZE_MB * 1024 * 1024;
    if (audioBlob.size > maxBytes) {
      alert(`O áudio é muito grande (máximo ${MAX_AUDIO_SIZE_MB}MB). Grave um áudio mais curto.`);
      return;
    }

    if (!audioBlob.type.startsWith("audio/")) {
      alert("Formato de áudio inválido. Tente gravar novamente.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const reader = new FileReader();
    reader.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      alert("Erro ao enviar áudio. Verifique sua conexão.");
    };
    reader.onloadend = () => {
      try {
        const base64 = reader.result as string;
        if (!base64 || base64.length < 100) throw new Error("Audio data too small");
        setUploadProgress(100);
        navigate(`/processing?area=${area}`, {
          state: { audioBase64: base64 },
        });
      } catch {
        setIsUploading(false);
        setUploadProgress(0);
        alert("Erro ao enviar áudio. Verifique sua conexão.");
      }
    };
    reader.readAsDataURL(audioBlob);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const maxTime = isAdmin ? MAX_RECORDING_TIME_ADMIN : MAX_RECORDING_TIME_DEFAULT;
  const progressPercent = (recordingTime / maxTime) * 100;

  return (
    <div className="min-h-screen bg-background noise flex flex-col">
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <span className="text-sm font-medium text-primary">
              {areaNames[area] || "Crenças Limitantes"}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-foreground">Grave seu Áudio</h1>
          <p className="text-muted-foreground mb-8">
            Fale sobre seus sentimentos, bloqueios e padrões que percebe em relação à sua mãe, pai, traumas e relacionamentos. 
            O que te limita? O que se repete na sua vida?
          </p>

          <div className="bg-card border border-border rounded-2xl p-8 mb-6">
            <div className="text-5xl font-mono font-bold text-foreground mb-4">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-muted-foreground mb-6">Máximo: {isAdmin ? "10" : "2"} minutos</div>

            <div className="mb-8">
              <Progress value={progressPercent} className="h-2" />
            </div>

            {isAreaLocked && (
              <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 mb-4 text-left">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Protocolo ativo. Aguarde mais <span className="font-semibold text-primary">{lockedAreas[area]?.daysRemaining} dia(s)</span> para regravar. Foque na sua meditação atual.
                </p>
              </div>
            )}

            {!audioBlob ? (
              <Button
                variant={isRecording ? "destructive" : "cyan"}
                size="xl"
                onClick={isRecording ? stopRecording : startRecording}
                className="w-full"
                disabled={isAreaLocked}
              >
                {isRecording ? (
                  <><Square className="h-5 w-5" /> Parar Gravação</>
                ) : (
                  <><Mic className="h-5 w-5" /> {isAreaLocked ? "Gravação Bloqueada" : "Iniciar Gravação"}</>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-primary font-medium">✓ Áudio gravado com sucesso!</p>

                {audioUrl && (
                  <div className="bg-secondary/30 border border-border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Play className="h-3.5 w-3.5" />
                      Ouça seu áudio antes de enviar:
                    </p>
                    <audio src={audioUrl} controls className="w-full h-10" />
                  </div>
                )}

                {!confirmed && !isUploading && !isAnalyzing && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setAudioBlob(null);
                        setRecordingTime(0);
                      }}
                    >
                      Regravar
                    </Button>
                    <Button variant="cyan" className="flex-1" onClick={() => setConfirmed(true)}>
                      Confirmar e Gerar Relatório
                    </Button>
                  </div>
                )}

                {confirmed && !isUploading && !isAnalyzing && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Tem certeza? Clique para gerar seu relatório.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setConfirmed(false)}>
                        Voltar
                      </Button>
                      <Button variant="cyan" className="flex-1" onClick={handleSubmit}>
                        Sim, Gerar Relatório
                      </Button>
                    </div>
                  </div>
                )}

                {(isUploading || isAnalyzing) && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground">Enviando... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-primary mb-1">⚠️ IMPORTANTE</p>
            <p className="text-sm text-foreground leading-relaxed">
              Seja o mais detalhista possível. Fale sobre sentimentos, memórias e fatos sobre sua mãe, pai, traumas e relacionamentos.{" "}
              <strong className="text-primary">Grave em silêncio absoluto, sem música de fundo.</strong>{" "}
              Sua voz é o único comando e autoridade sobre seu corpo.
            </p>
          </div>

          <div className="text-left bg-card/50 border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-2">Dicas para um bom diagnóstico:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Fale em um ambiente silencioso</li>
              <li>• Aborde todos os pilares: mãe, pai, traumas e relacionamentos</li>
              <li>• Seja honesto sobre seus sentimentos</li>
              <li>• Descreva situações específicas</li>
            </ul>
          </div>

          {areaDiagnoses.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Relatórios anteriores</h3>
              <AreaDiagnosisList diagnoses={areaDiagnoses} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recording;
