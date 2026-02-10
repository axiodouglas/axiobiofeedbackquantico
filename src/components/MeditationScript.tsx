import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  return `${name}, eu me conecto agora com o mais profundo do nosso ser. Eu me conecto com a nossa mente e com o nosso corpo. Corpo, ouça a minha voz: está tudo bem agora. Nós podemos relaxar. Nós podemos soltar as amarras, os bloqueios e tudo o que esteja nos impedindo de acessar o nosso subconsciente. Nós estamos em um lugar seguro agora. ${name}, você pode confiar em mim. Eu te amo, corpo, e estou aqui para te ajudar para que, juntos, possamos viver o mais incrível que a vida tem para nós. Mas, para isso, precisamos juntos baixar todas as nossas defesas.

${name}, eu olho agora para nós e valido cada trauma, cada medo e cada sentimento de ${traumas}. Eu reconheço essa dor sem qualquer julgamento. Eu te dou lugar, eu te vejo. Eu sei que nós sentimos ${sentiments} e está tudo bem. Ao validar o que sentimos, eu permito que a energia que prende esses sentimentos nas nossas células e tecidos comece a se soltar agora. Não precisamos mais lutar contra o que sentimos. Nós apenas reconhecemos e deixamos fluir. ${name}, acalme, está tudo bem, nós podemos ficar calmos agora.

Corpo, nós iniciamos agora o desligamento total. Eu ordeno o corte de todos os laços, vínculos, pactos e verdades absolutas que nos prendem ao passado. Eu desligo agora a energia de ${sentiments} dos nossos órgãos relacionados a esses sentimentos. Eu quebro toda lealdade invisível a familiares, pessoas ou situações. Eu me desassocio de toda energia que não é nossa. Eu devolvo o que é do outro com amor, mas recupero agora toda a nossa força vital. ${name}, nós estamos livres agora.

${name}, onde antes havia ${rootWound}, agora eu instalo segurança, amor próprio e confiança plena. Corpo, sinta essa nova verdade entrando em cada célula. Nós agora ocupamos o nosso lugar com segurança e alegria. Nós somos dignos de prosperidade, saúde e relacionamentos saudáveis. Essa é a nossa nova realidade e ela começa agora.

${name}, eu agradeço profundamente a cada pessoa, à nossa mãe, ao nosso pai e a todas as situações que nos moldaram, mas que agora deixamos ir. Agradeço ao nosso corpo, ao nosso cérebro, coração, pulmões, fígado, rins, estômago e a cada uma das nossas trilhões de células por sustentarem essa nova consciência. ${name}, nós vamos relembrar tudo isso de novo, corpo, porque já é real na nossa vida. Tudo está feito e consumado. ${name}, durma em paz agora, nós estamos seguros.`;
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

  const MAX_DURATION = 30 * 60;

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
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
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
    a.download = `meditacao-axio-${new Date().toISOString().slice(0, 10)}.webm`;
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
          Redija esta meditação em uma folha de papel antes de gravar. Isso faz parte do processo de limpeza emocional e fortalece seu córtex pré-frontal.
        </p>
      </div>

      <div className="bg-secondary/30 border border-border rounded-lg p-4 max-h-[400px] overflow-y-auto">
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {script}
        </p>
      </div>

      <div className="bg-secondary/20 border border-border rounded-lg p-4 space-y-3">
        <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Mic className="h-3.5 w-3.5 text-primary" />
          Gravação da Meditação (até 30 min)
        </p>

        <div className="flex items-center gap-3">
          {!isRecording && !audioUrl && (
            <Button variant="cyan" size="sm" onClick={startRecording} className="gap-1.5">
              <Mic className="h-4 w-4" />
              Iniciar Gravação
            </Button>
          )}

          {isRecording && (
            <>
              <Button variant="destructive" size="sm" onClick={stopRecording} className="gap-1.5">
                <Square className="h-4 w-4" />
                Parar
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm font-mono text-foreground">{formatTime(recordingTime)}</span>
              </div>
            </>
          )}

          {audioUrl && !isRecording && (
            <div className="flex items-center gap-2 flex-wrap">
              <audio src={audioUrl} controls className="h-8" />
              <Button variant="cyanOutline" size="sm" onClick={downloadAudio} className="gap-1.5">
                <Download className="h-4 w-4" />
                Baixar
              </Button>
              <Button variant="cyan" size="sm" onClick={saveToProfile} disabled={saving} className="gap-1.5">
                <Sparkles className="h-4 w-4" />
                {saving ? "Salvando..." : "Salvar no Perfil"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setAudioUrl(null); setRecordingTime(0); }}>
                Regravar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
