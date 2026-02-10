import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mic, Square, ArrowLeft, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAxioAnalysis } from "@/hooks/use-axio-analysis";
import { useAuth } from "@/hooks/use-auth";
import { useAreaLock } from "@/hooks/use-area-lock";

const MAX_RECORDING_TIME = 120;
const MAX_AUDIO_SIZE_MB = 10;
const VALID_AREAS = ["pai", "mae", "traumas", "relacionamento"];

const areaNames: Record<string, string> = {
  pai: "Pai", mae: "Mãe", traumas: "Traumas Adicionais", relacionamento: "Relacionamentos",
};

const Recording = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawArea = searchParams.get("area") || "pai";
  const area = VALID_AREAS.includes(rawArea) ? rawArea : "pai";

  const { user } = useAuth();
  const { lockedAreas, loading: lockLoading } = useAreaLock(user?.id);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

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

  // Check area lock
  const lock = lockedAreas[area];
  const isAreaLocked = lock?.locked;

  if (!lockLoading && isAreaLocked) {
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
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Diagnóstico já realizado</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Pilar {areaNames[area]} em protocolo</h1>
            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Você já gravou o diagnóstico deste pilar. Para que a reprogramação funcione, é essencial seguir o protocolo:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  Pratique os <strong className="text-foreground">comandos quânticos</strong> diariamente (manhã, tarde e noite)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  Ouça sua <strong className="text-foreground">meditação gravada</strong> todas as noites ao dormir
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  Aguarde pelo menos <strong className="text-primary">{lock.daysRemaining} dia(s)</strong> antes de refazer
                </li>
              </ul>
              <p className="text-xs text-muted-foreground italic">
                A repetição é o que cria novos caminhos neurais. Sem o protocolo, o diagnóstico perde eficácia.
              </p>
            </div>
            <Button variant="cyan" onClick={() => navigate("/")}>
              Voltar para o Início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordingTime(0);
      setConfirmed(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
              mediaRecorderRef.current.stop();
              isRecordingRef.current = false;
              if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
            }
            setIsRecording(false);
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Não foi possível acessar o microfone. Por favor, permita o acesso.");
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

    // Validate audio size
    const maxBytes = MAX_AUDIO_SIZE_MB * 1024 * 1024;
    if (audioBlob.size > maxBytes) {
      alert(`O áudio é muito grande (máximo ${MAX_AUDIO_SIZE_MB}MB). Grave um áudio mais curto.`);
      return;
    }

    // Validate audio type
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

  const progressPercent = (recordingTime / MAX_RECORDING_TIME) * 100;

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
              Diagnóstico {areaNames[area]}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-foreground">Grave seu Áudio</h1>
          <p className="text-muted-foreground mb-8">
            Fale sobre sua situação atual na área {areaNames[area]?.toLowerCase()}.
            O que você sente? Quais são seus desafios?
          </p>

          <div className="bg-card border border-border rounded-2xl p-8 mb-6">
            <div className="text-5xl font-mono font-bold text-foreground mb-4">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-muted-foreground mb-6">Máximo: 2 minutos</div>

            <div className="mb-8">
              <Progress value={progressPercent} className="h-2" />
            </div>

            {!audioBlob ? (
              <Button
                variant={isRecording ? "destructive" : "cyan"}
                size="xl"
                onClick={isRecording ? stopRecording : startRecording}
                className="w-full"
              >
                {isRecording ? (
                  <><Square className="h-5 w-5" /> Parar Gravação</>
                ) : (
                  <><Mic className="h-5 w-5" /> Iniciar Gravação</>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-primary font-medium">✓ Áudio gravado com sucesso!</p>

                {/* Audio preview */}
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
                  <>
                    {/* 7-day warning */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 text-left">
                      <p className="text-xs text-destructive font-semibold mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Atenção
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Ao gerar o relatório, você não poderá gravar outro diagnóstico para o pilar <strong className="text-foreground">{areaNames[area]}</strong> durante <strong className="text-primary">7 dias</strong>. 
                        Nesse período, você deverá praticar os comandos quânticos e ouvir a meditação diariamente para que a reprogramação funcione.
                      </p>
                    </div>

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
                  </>
                )}

                {confirmed && !isUploading && !isAnalyzing && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Tem certeza? Após gerar, o pilar ficará bloqueado por 7 dias.
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

          <div className="text-left bg-card/50 border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-2">Dicas para um bom diagnóstico:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Fale em um ambiente silencioso</li>
              <li>• Seja honesto sobre seus sentimentos</li>
              <li>• Descreva situações específicas</li>
              <li>• Não se preocupe com a perfeição</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recording;
