import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Download, FileText, Play, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface MeditationScriptProps {
  userName: string;
  diagnosisResult: any;
  diagnosisId: string;
  userId: string;
}

function generateMeditationScript(_userName: string, dr: any): string {
  const blocks = (dr?.blocks || []).map((b: any) => b.name);
  const sentiments = (dr?.predominant_sentiments || []).map((s: any) => s.name);
  const rootWound = dr?.root_wound || "feridas de origem";
  const somatMap = dr?.somatization_map || [];

  // Build personalized body references from somatization map
  const bodyParts = somatMap.map((s: any) => ({
    organ: s.organ_or_area || s.body_region,
    emotion: s.emotion,
  }));

  // Organ relaxation phrases from somatization
  const organRelax = bodyParts.length > 0
    ? bodyParts.map((p: any) => p.organ).join(", ")
    : "estômago, intestinos, fígado, rins";

  // Sentiment phrases for step 2
  const sentimentList = sentiments.length > 0 ? sentiments : ["dores guardadas"];
  const firstSentiment = sentimentList[0];
  const otherSentiments = sentimentList.slice(1);

  // Block phrases for step 2
  const blockList = blocks.length > 0 ? blocks : ["dores do passado"];

  // Build somatization cut phrases for step 3
  const somatCutPhrases = bodyParts.length > 0
    ? bodyParts.map((p: any) => `problemas em ${p.organ.toLowerCase()}`).join(", ")
    : "desconfortos, doenças, dores de cabeça, problemas de intestino, problemas de pele";

  // Build activation phrases for step 4 from somatization
  const activationPhrases = bodyParts.length > 0
    ? bodyParts.map((p: any) => {
        const emotions = (p.emotion || "").split(",").map((e: string) => e.trim());
        const negEmotion = emotions[0] || "dor";
        // Map negative to positive
        const positiveMap: Record<string, string> = {
          "vergonha": "orgulho de ser quem somos",
          "medo": "coragem e confiança plena",
          "ansiedade": "calma e serenidade profunda",
          "culpa": "perdão e leveza",
          "raiva": "paz e aceitação",
          "tristeza": "alegria genuína",
          "insegurança": "certeza do nosso valor",
          "rejeição": "acolhimento e pertencimento",
          "abandono": "segurança de que nunca mais estaremos sozinhos(as)",
          "indignidade": "dignidade e merecimento",
          "humilhação": "respeito próprio e honra",
          "dependência": "autonomia e liberdade",
          "autossabotagem": "confiança e prosperidade natural",
          "impotência": "poder pessoal restaurado",
        };
        const negLower = negEmotion.toLowerCase();
        const positive = Object.entries(positiveMap).find(([k]) => negLower.includes(k))?.[1]
          || "paz e restauração completa";
        return `Onde havia ${negLower} em ${p.organ.toLowerCase()}, agora sentimos ${positive}.`;
      }).join("\n")
    : `Onde havia dor, agora sentimos alívio e restauração.\nOnde havia medo, agora sentimos coragem e confiança.\nOnde havia peso, agora sentimos leveza e liberdade.`;

  // PASSO 1 — Relaxamento
  const relaxamento = `Querido(a) corpo, agora que o dia acabou, vamos aproveitar esse momento juntos. Vamos dar uma ordem de paz para cada parte de nós. Coração, agora você pode descansar, pode relaxar e tirar todo o peso que carrega. Você agora está seguro(a) e pode liberar toda a tensão que guarda. Pulmões, deixem o ar entrar e sair de um jeito bem leve, sem pressa, só fluindo. É hora de soltar as defesas, tirar o peso dos ombros e deixar a mente aberta para ouvir uma história nova.

Nossa mente descansa agora. Nossos órgãos, que trabalharam tanto, recebem esse descanso. ${organRelax}... podem relaxar agora. Estamos em casa, estamos seguros(as) e não precisamos mais lutar contra nada.`;

  // PASSO 2 — Reconhecimento e Validação
  const validacao = `Olhamos agora para dentro de nós com muito carinho e reconhecemos cada dor e cada trava que guardamos. ${firstSentiment.charAt(0).toUpperCase() + firstSentiment.slice(1)}, eu te vejo. Eu sei que sentimos ${firstSentiment} desde muito cedo, mesmo que na época a gente não entendesse o que aquilo significava. Eu solto agora todo o julgamento sobre esse sentimento. Eu reconheço que sentimos ${firstSentiment}, mas também compreendo que isso ficou no passado. Nós não precisamos mais carregar esse peso conosco e soltamos agora esse sentimento.

${otherSentiments.length > 0 ? `Eu vejo também ${otherSentiments.join(", ")} e cada marca de ${blockList.join(", ")}. ` : `Eu vejo cada marca de ${blockList.join(", ")}. `}Eu compreendo cada um desses sentimentos em nós. Eu aceito a nossa história e reconheço a dor de ${rootWound}. Eu digo para a nossa criança interior: "Está tudo bem, nós finalmente te vemos e você nunca mais vai passar por isso sozinho(a)". Enquanto olhamos para essas lembranças, sentimos que essa energia pesada já começa a se descolar de nós. Nós reconhecemos onde essa dor se instalou no corpo e damos permissão para que ela comece a se dissolver agora.`;

  // PASSO 3 — Limpeza e Corte
  const limpeza = `Tudo o que eu esteja inconscientemente ativando em nosso corpo para manter viva a dor de ${rootWound}, como ${somatCutPhrases}, travando nossa prosperidade e o nosso crescimento, eu corto, desligo e cancelo agora instantaneamente.

Agora, em cima de nós, surge uma bola de luz perolada. Esta luz é a energia da criação, que tem o poder de criar e desfazer qualquer coisa nesse universo. Ela começa a descer pelo nosso corpo, limpando todo sentimento de ${sentimentList.join(" e ")}, dissolvendo todo bloqueio que esteja nos impedindo de viver plenamente. Essa luz passa por cada órgão, cada nervo e cada parte do nosso corpo, desintegrando tudo o que não nos pertence. Sentimos a limpeza em ${organRelax} e em toda a nossa estrutura. Tudo o que estava travado agora se dissolve nessa luz.`;

  // PASSO 4 — Ativação e Instalação
  const ativacao = `${activationPhrases}

Nós mandamos no nosso corpo. Somos dignos(as) de receber o melhor da vida agora. O sucesso já está vindo. A cura já aconteceu. Cada célula nossa vibra nessa nova frequência. Nós ocupamos o nosso lugar com segurança e alegria.`;

  // PASSO 5 — Gratidão e Sono
  const gratidao = `Agradecemos ao nosso corpo por ser tão forte e por nos trazer de volta para casa. Obrigado(a) a cada órgão nosso por trabalhar com tanto amor. Aos nossos pais, gratidão pela vida, e deixamos eles seguirem o caminho deles enquanto seguimos o nosso.

Obrigado(a) a cada pessoa que passou pela nossa vida, porque tudo nos trouxe até essa paz de agora. Nosso corpo vibra saúde, nosso sangue corre limpo e nosso coração bate calmo. Tudo o que foi dito já é verdade. Está feito. Está selado. A paz é total. Vamos dormir agora com a certeza de que estamos seguros(as). Tudo está bem.`;

  return `${relaxamento}\n\n${validacao}\n\n${limpeza}\n\n${ativacao}\n\n${gratidao}`;
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
