import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Download, FileText, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { generateMeditationScript } from "@/lib/meditation-script";

interface MeditationScriptProps {
  userName: string;
  diagnosisResult: any;
  diagnosisId: string;
  userId: string;
}

export default function MeditationScript({
  userName: _userName,
  diagnosisResult,
  diagnosisId: _diagnosisId,
  userId: _userId,
}: MeditationScriptProps) {
  const { toast } = useToast();
  const script = generateMeditationScript(diagnosisResult);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      setAudioUrl(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      toast({ title: "Erro ao acessar microfone", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `meditacao-axio-${new Date().toISOString().slice(0, 10)}.mp3`;
    a.click();
    // Libera o blob da memória após o download ser iniciado
    setTimeout(() => {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setRecordingTime(0);
    }, 1000);
  };

  // saveToProfile removed — only Download and Regravar available

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
        <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          Instrução Importante
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Redija Esta Meditação Em Uma Folha De Papel Antes De Gravar. Isso Faz Parte Do Processo De Limpeza Emocional E Fortalece Seu Córtex Pré-Frontal. Depois, Grave Com Calma Lendo O Roteiro. Ouça Em Loop Durante O Sono Por 7 Noites.
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">
          Se Tiver Alguma Dúvida Acesse E Entenda{" "}
          <Link to="/" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium">
            Nossa Meditação Na Home
          </Link>
          .
        </p>
      </div>

      <div className="bg-secondary/30 border border-border rounded-lg p-4 max-h-[400px] overflow-y-auto">
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {script}
        </p>
      </div>

      <div className="bg-secondary/20 border border-border rounded-lg p-3 space-y-2">
        <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Mic className="h-3.5 w-3.5 text-primary" />
          Gravação Da Meditação
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {!isRecording && !audioUrl && (
            <Button variant="cyan" size="sm" onClick={startRecording} className="gap-1.5 h-8 text-xs">
              <Mic className="h-3.5 w-3.5" />
              Iniciar Gravação
            </Button>
          )}

          {isRecording && (
            <>
              <Button variant="destructive" size="sm" onClick={stopRecording} className="gap-1.5 h-8 text-xs">
                <Square className="h-3.5 w-3.5" />
                Parar
              </Button>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs font-mono text-foreground">{formatTime(recordingTime)}</span>
              </div>
            </>
          )}

          {audioUrl && !isRecording && (
            <div className="flex items-center gap-2 flex-wrap w-full">
              <audio src={audioUrl} controls className="h-7 max-w-[180px]" />
              <Button variant="cyanOutline" size="sm" onClick={downloadAudio} className="gap-1 h-7 text-[11px] px-2">
                <Download className="h-3 w-3" />
                Baixar MP3
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setAudioUrl(null); setRecordingTime(0); }} className="h-7 text-[11px] px-2">
                Regravar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
