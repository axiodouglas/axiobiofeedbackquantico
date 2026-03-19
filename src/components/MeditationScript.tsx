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

// Meditation v3 - personalized 5-step format (updated wording)
// Positive sentiments to filter out from the wound/pain section
const POSITIVE_SENTIMENTS = new Set([
  "esperança", "desejo de superação", "gratidão", "alegria", "amor",
  "confiança", "coragem", "otimismo", "determinação", "fé",
  "resiliência", "força", "motivação", "entusiasmo", "paz",
]);

function isNegativeSentiment(s: string): boolean {
  return !POSITIVE_SENTIMENTS.has(s.toLowerCase().trim());
}

// Simplify block names: remove awkward article clashes, make language flow naturally
function simplifyBlockName(name: string): string {
  return name
    .replace(/^[Oo]\s+/g, "")
    .replace(/^[Aa]\s+/g, "")
    .replace(/'/g, "'")
    .trim();
}

function generateMeditationScript(_userName: string, dr: any): string {
  const blocks = (dr?.blocks || []).map((b: any) => b.name);
  const sentiments = (dr?.predominant_sentiments || []).map((s: any) => s.name);
  const negativeSentiments = sentiments.filter(isNegativeSentiment);
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

  // Only negative sentiments for the wound section
  const woundSentiments = negativeSentiments.length > 0 ? negativeSentiments : ["dores guardadas"];

  // Block phrases
  const blockList = blocks.length > 0 ? blocks.map(simplifyBlockName) : ["dores do passado"];

  // Build somatization cut phrases for step 3
  const somatCutPhrases = bodyParts.length > 0
    ? bodyParts.map((p: any) => `problemas em ${p.organ.toLowerCase()}`).join(", ")
    : "desconfortos, doenças, dores de cabeça, problemas de intestino, problemas de pele";

  // Build activation phrases for step 4 from somatization
  const activationPhrases = bodyParts.length > 0
    ? bodyParts.map((p: any) => {
        const emotions = (p.emotion || "").split(",").map((e: string) => e.trim());
        const negEmotion = emotions[0] || "dor";
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
          "escassez": "abundância e prosperidade plena",
          "frustração": "realização e plenitude",
        };
        const negLower = negEmotion.toLowerCase();
        const positive = Object.entries(positiveMap).find(([k]) => negLower.includes(k))?.[1]
          || "paz e restauração completa";
        return `Onde havia ${negLower} em ${p.organ.toLowerCase()}, agora sentimos ${positive}.`;
      }).join("\n")
    : `Onde havia dor, agora sentimos alívio e restauração.\nOnde havia medo, agora sentimos coragem e confiança.\nOnde havia peso, agora sentimos leveza e liberdade.`;

  // PASSO 1 — Relaxamento (intro fixa + transição personalizada)
  const relaxamento = `Querido(a) (diga seu nome), eu agora me conecto com meu subconsciente e com o meu corpo, e agora em um estado profundo de paz eu relaxo totalmente cada parte do meu ser.

Eu falo com cada parte de mim que viveu em estado de alerta. Coração, acalme-se, é seguro relaxar agora. Pulmões, deixem o ar entrar e sair de um jeito bem leve, sem pressa, só fluindo. É hora de soltar as defesas, tirar o peso dos ombros e deixar a mente aberta.

Nossos órgãos, que trabalharam tanto, recebem esse descanso agora. ${organRelax}... podem relaxar. Estamos seguros(as) e não precisamos mais lutar contra nada.`;

  // PASSO 2 — Reconhecimento e Validação (um por um, sem sentimentos positivos, sem "eu te vejo e nunca vou te abandonar")
  const validacaoIndividual = woundSentiments.map((sent: string) => {
    const sentLower = sent.toLowerCase();
    return `Eu acolho e valido a dor da ${sentLower} e entendo que o que eu sentia era a verdade que eu entendia sobre ela naquele momento. Hoje eu não preciso mais ver dessa forma. Eu solto todo o julgamento sobre esse sentimento.`;
  }).join("\n\n");

  const blocksValidation = blockList.map((block: string) => {
    const blockLower = block.charAt(0).toLowerCase() + block.slice(1);
    return `Eu me conecto com a crença da ${blockLower} e reconheço que ela fez parte da minha história. Eu acolho essa dor sem julgamento e compreendo que ela não precisa mais me definir.`;
  }).join("\n\n");

  const validacao = `Agora eu me conecto com todas as crenças que eu carrego e reconheço a dor da ${rootWound.charAt(0).toLowerCase() + rootWound.slice(1)}.

${blocksValidation}

${validacaoIndividual}

Enquanto olho para essas lembranças, sinto que essa energia pesada já começa a se descolar de mim. Eu reconheço onde essa dor se instalou no meu corpo e dou permissão para que ela comece a se dissolver agora.`;

  // PASSO 3 — Limpeza e Corte
  const limpeza = `Tudo o que eu esteja inconscientemente ativando no meu corpo para manter viva a dor da ${rootWound.charAt(0).toLowerCase() + rootWound.slice(1)}, como ${somatCutPhrases}, travando minha prosperidade e o meu crescimento, eu corto, desligo e cancelo agora instantaneamente.

Agora, em cima de mim, surge uma bola de luz perolada. Esta luz é a energia da criação, que tem o poder de criar e desfazer qualquer coisa nesse universo. Ela começa a descer pelo meu corpo, limpando todo sentimento de ${woundSentiments.map((s: string) => s.toLowerCase()).join(" e ")}, dissolvendo todo bloqueio que esteja me impedindo de viver plenamente. Essa luz passa por cada órgão, cada nervo e cada parte do meu corpo, desintegrando tudo o que não me pertence. Sinto a limpeza em ${organRelax} e em toda a minha estrutura. Tudo o que estava travado agora se dissolve nessa luz.`;

  // PASSO 4 — Ativação e Instalação
  const ativacao = `${activationPhrases}

Eu mando no meu corpo. Sou digno(a) de receber o melhor da vida agora. O sucesso já está vindo. A cura já aconteceu. Cada célula minha vibra nessa nova frequência. Eu ocupo o meu lugar com segurança e alegria.`;

  // PASSO 5 — Gratidão e Sono
  const gratidao = `Agradeço ao meu corpo por ser tão forte e por me trazer de volta para casa. Obrigado(a) a cada órgão meu por trabalhar com tanto amor. Aos meus pais, gratidão pela vida, e deixo eles seguirem o caminho deles enquanto sigo o meu.

Obrigado(a) a cada pessoa que passou pela minha vida, porque tudo me trouxe até essa paz de agora. Meu corpo vibra saúde, meu sangue corre limpo e meu coração bate calmo. Tudo o que foi dito já é verdade. Está feito. Está selado. A paz é total. Vou dormir agora com a certeza de que estou seguro(a). Tudo está bem.`;

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
