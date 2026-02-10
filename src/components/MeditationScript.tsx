import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Download, FileText, Play, Square, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MeditationScriptProps {
  userName: string;
  diagnosisResult: any;
  diagnosisId: string;
  userId: string;
}

function generateMeditationScript(userName: string, dr: any): string {
  const name = userName || "Querido(a)";
  const traumas = (dr?.blocks || []).map((b: any) => b.name).join(", ") || "dores do passado";
  const sentiments = (dr?.predominant_sentiments || []).map((s: any) => s.name).join(", ") || "sentimentos guardados";
  const rootWound = dr?.root_wound || "feridas de origem";
  const saude = dr?.secondary_impacts?.saude || "tensão acumulada no corpo";

  // PASSO 1 - ACESSO (Segurança Somática)
  const acesso = `${name}, eu agora fecho os meus olhos e dou um comando de paz à minha biologia. Eu falo com cada órgão que viveu em estado de alerta. Coração, acalme-se. Glândulas, descansem. É seguro relaxar. Eu informo ao meu sistema nervoso que o ambiente é seguro e que eu sou a sua proteção. Eu baixo a guarda agora, porque tudo o que faremos aqui é por amor a nós mesmos. ${name}, eu me conecto com o mais profundo do nosso ser. Corpo, ouça a minha voz: está tudo bem agora. Nós podemos soltar as amarras, os bloqueios e tudo o que esteja nos impedindo de acessar o nosso subconsciente.`;

  // PASSO 2 - VALIDAÇÃO (Olhar do Expert)
  const validacao = `${name}, eu olho agora para nós e reconheço a dor de ${rootWound}. Eu valido cada trauma, cada medo e cada sentimento de ${traumas}. Eu acolho essa ferida sem qualquer julgamento. Eu digo a essa dor: eu finalmente te vejo e nunca mais vou te abandonar. Eu sei que nós sentimos ${sentiments} e está tudo bem. Eu reconheço onde essa dor se instala no nosso corpo, ${saude}. Ao validar o que sentimos, eu permito que a energia que prende esses sentimentos nas nossas células e tecidos comece a se soltar agora. Não precisamos mais lutar contra o que sentimos. Nós apenas reconhecemos e deixamos fluir. ${name}, acalme, está tudo bem, nós podemos ficar calmos agora.`;

  // PASSO 3 - DESASSOCIAÇÃO (Corte de Vínculos)
  const desassociacao = `Corpo, nós iniciamos agora o desligamento total. Eu ordeno o corte de todos os vínculos, lealdades cegas e pactos que nos prendem ao sofrimento da nossa linhagem. Eu não sou a dor dos meus ancestrais. Eu rescindo todo contrato de codependência. Eu desligo agora a energia de ${sentiments} dos nossos órgãos relacionados a esses sentimentos. Eu quebro toda lealdade invisível a familiares, pessoas ou situações. Eu me desassocio de toda energia que não é nossa. Eu devolvo o lixo emocional aos seus donos originais com amor, mas recupero agora toda a minha força vital. Eu sou livre da aprovação deles. ${name}, nós estamos livres agora.`;

  // PASSO 4 - INSTALAÇÃO (Nova Identidade)
  const instalacao = `${name}, onde antes havia ${rootWound}, agora eu instalo segurança, amor próprio e confiança plena. Eu instalo a consciência da minha soberania. Eu sou digno e inteiro. Corpo, sinta essa nova verdade entrando em cada célula. Nós agora ocupamos o nosso lugar com segurança e alegria. Nós somos dignos de prosperidade, saúde e relacionamentos saudáveis. Eu retomo meu direito ao prazer, à alegria e à minha voz. Minha identidade é restaurada agora. Essa é a nossa nova realidade e ela começa agora.`;

  // PASSO 5 - GRATIDÃO (Selagem Somática)
  const gratidao = `${name}, eu agradeço profundamente a cada pessoa, à nossa mãe, ao nosso pai e a todas as situações que nos moldaram, mas que agora deixamos ir. Eu agradeço ao meu corpo por permitir essa limpeza. Agradeço ao nosso cérebro, coração, pulmões, fígado, rins, estômago e a cada uma das nossas trilhões de células por sustentarem essa nova consciência. Sinto a vida correndo livre, meus pulmões expandindo e meu ventre aquecido. ${name}, nós vamos relembrar tudo isso de novo, corpo, porque já é real na nossa vida. Está feito, está selado. Gratidão. ${name}, durma em paz agora, nós estamos seguros.`;

  return `${acesso}\n\n${validacao}\n\n${desassociacao}\n\n${instalacao}\n\n${gratidao}`;
}

export default function MeditationScript({ userName, diagnosisResult, diagnosisId, userId }: MeditationScriptProps) {
  const { toast } = useToast();
  const script = generateMeditationScript(userName, diagnosisResult);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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

  const saveToProfile = async () => {
    if (!audioUrl) return;
    setSaving(true);
    try {
      const { data: diag } = await supabase
        .from("diagnoses")
        .select("diagnosis_result")
        .eq("id", diagnosisId)
        .single();

      if (diag) {
        const updatedResult = {
          ...(diag.diagnosis_result as any),
          meditation_script: script,
          meditation_saved: true,
        };
        await supabase
          .from("diagnoses")
          .update({ diagnosis_result: updatedResult })
          .eq("id", diagnosisId);
      }

      toast({ title: "Meditação salva no perfil!" });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

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
