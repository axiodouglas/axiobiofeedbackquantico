import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mic, Square, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const MAX_RECORDING_TIME = 120; // 2 minutes

const Recording = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area") || "financeiro";

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const areaNames: Record<string, string> = {
    financeiro: "Financeiro",
    relacionamento: "Relacionamento",
    saude: "Saúde",
    familiar: "Familiar",
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
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
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setUploadProgress(100);
    clearInterval(progressInterval);

    // Navigate to processing screen
    setTimeout(() => {
      navigate(`/processing?area=${area}`);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = (recordingTime / MAX_RECORDING_TIME) * 100;

  return (
    <div className="min-h-screen bg-background noise flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          {/* Area Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <span className="text-sm font-medium text-primary">
              Diagnóstico {areaNames[area]}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-foreground">
            Grave seu Áudio
          </h1>
          <p className="text-muted-foreground mb-8">
            Fale sobre sua situação atual na área {areaNames[area]?.toLowerCase()}. 
            O que você sente? Quais são seus desafios?
          </p>

          {/* Recording Interface */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-6">
            {/* Timer */}
            <div className="text-5xl font-mono font-bold text-foreground mb-4">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-muted-foreground mb-6">
              Máximo: 2 minutos
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Recording Button */}
            {!audioBlob ? (
              <Button
                variant={isRecording ? "destructive" : "cyan"}
                size="xl"
                onClick={isRecording ? stopRecording : startRecording}
                className="w-full"
              >
                {isRecording ? (
                  <>
                    <Square className="h-5 w-5" />
                    Parar Gravação
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Iniciar Gravação
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-primary font-medium">
                  ✓ Áudio gravado com sucesso!
                </p>
                
                {isUploading ? (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      Enviando... {uploadProgress}%
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setAudioBlob(null);
                        setRecordingTime(0);
                      }}
                    >
                      Gravar Novamente
                    </Button>
                    <Button
                      variant="cyan"
                      className="flex-1"
                      onClick={handleSubmit}
                    >
                      Enviar Áudio
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tips */}
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
