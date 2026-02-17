import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Download, FileText, Play, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MeditationScriptProps {
  userName: string;
  diagnosisResult: any;
  diagnosisId: string;
  userId: string;
}

function generateMeditationScript(userName: string, dr: any): string {
  const name = userName || "Querido (Diga seu nome)";
  const blocks = (dr?.blocks || []).map((b: any) => b.name);
  const traumas = blocks.length > 0 ? blocks.join(", ") : "dores do passado";
  const sentiments = (dr?.predominant_sentiments || []).map((s: any) => s.name);
  const sentimentText = sentiments.length > 0 ? sentiments.join(", ") : "sentimentos guardados";
  const rootWound = dr?.root_wound || "feridas de origem";

  // PASSO 1 - ACESSO
  const acesso = `${name}, eu agora fecho os meus olhos e dou um comando de paz ao meu corpo. Eu falo com cada parte de mim que viveu em estado de alerta. Coração, acalme-se. É seguro relaxar. Eu baixo a guarda agora, porque tudo o que faremos aqui é por amor a nós mesmos. Eu me conecto com o mais profundo do nosso ser. Corpo, ouça a minha voz: está tudo bem agora. Nós podemos soltar as amarras e tudo o que nos impede de acessar a nossa verdade.`;

  // PASSO 2 - VALIDAÇÃO
  const validacao = `Eu olho agora para nós e reconheço a dor de ${rootWound}. Eu valido cada sentimento de ${traumas}. Eu acolho essa ferida sem qualquer julgamento. Eu digo a essa dor: eu finalmente te vejo e nunca mais vou te abandonar. Eu sei que sentimos ${sentimentText} e está tudo bem. Eu reconheço onde essa dor se instala no meu corpo e, neste momento, eu dou permissão para que cada tensão se dissolva. Eu solto o peso dos meus ombros, relaxo o meu pescoço e acalmo o meu ventre. Ao validar o que sinto, eu permito que essa energia flua livremente, sem resistência. Eu estou seguro em meu próprio corpo. Não precisamos mais lutar contra o que sentimos. Nós apenas reconhecemos e deixamos fluir.`;

  // PASSO 3 - DESASSOCIAÇÃO
  const desassociacao = `Corpo, nós iniciamos agora o desligamento total. Eu ordeno o corte de todos os vínculos, lealdades cegas e pactos que nos prendem ao sofrimento da nossa linhagem. Eu não sou a dor dos meus ancestrais. Eu rescindo todo contrato de codependência. Eu libero agora toda tensão acumulada. Eu permito que meus órgãos relaxem. Eu solto a necessidade de me defender. Eu quebro toda lealdade invisível a familiares, pessoas ou situações. Eu me desassocio de toda energia que não é nossa. Eu devolvo o que não me pertence com amor, mas recupero agora toda a minha força vital. Eu sou livre da aprovação deles. Nós estamos livres agora.`;

  // PASSO 4 - INSTALAÇÃO
  const instalacao = `Onde antes havia ${rootWound}, agora eu instalo segurança, amor próprio e confiança plena. Eu instalo a consciência da minha soberania. Eu sou digno e inteiro. Corpo, sinta essa nova verdade entrando em cada parte de mim. Nós agora ocupamos o nosso lugar com segurança e alegria. Nós somos dignos de prosperidade, saúde e relacionamentos saudáveis. Eu retomo meu direito ao prazer, à alegria e à minha voz. Minha identidade é restaurada agora. ${name}, essa é a nossa nova realidade e ela começa agora.`;

  // PASSO 5 - GRATIDÃO
  const gratidao = `Eu agradeço profundamente a cada pessoa, à nossa mãe, ao nosso pai e a todas as situações que nos moldaram, mas que agora deixamos ir. Eu agradeço ao meu corpo por permitir essa limpeza. Sinto a vida correndo livre, meus pulmões expandindo e meu ventre aquecido. Nós vamos relembrar tudo isso de novo, corpo, porque já é real na nossa vida. Está feito, está selado. Gratidão. ${name}, durma em paz agora, nós estamos seguros.`;

  return `${acesso}\n\n${validacao}\n\n${desassociacao}\n\n${instalacao}\n\n${gratidao}`;
}

export default function MeditationScript({ userName, diagnosisResult, diagnosisId, userId }: MeditationScriptProps) {
  const { toast } = useToast();
  const script = generateMeditationScript(userName, diagnosisResult);

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
          Redija esta meditação em uma folha de papel antes de gravar. Isso faz parte do processo de limpeza emocional e fortalece seu córtex pré-frontal. Depois, grave com calma lendo o roteiro. Ouça em loop durante o sono por 7 noites.
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
          Gravação da Meditação
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
