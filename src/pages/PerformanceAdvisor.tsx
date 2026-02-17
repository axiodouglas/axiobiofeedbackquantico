import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Square, ArrowLeft, Briefcase, Users, HeartHandshake, Loader2, Shield, BarChart3, Brain, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { PerformanceAdviceList } from "@/components/AreaReportsList";

const MAX_RECORDING_TIME = 30;

const categories = [
  { id: "trabalho", label: "Trabalho", icon: Briefcase, description: "Produtividade, carreira e reuniões" },
  { id: "relacionamentos", label: "Relacionamentos", icon: HeartHandshake, description: "Conexões interpessoais" },
  { id: "outros", label: "Outros", icon: Users, description: "Outros contextos" },
];

interface ToneAnalysis {
  dominant_emotion: string;
  confidence_level: number;
  stress_indicator: number;
  energy_level: number;
}

interface AdviceResult {
  transcription: string;
  tone_analysis: ToneAnalysis;
  frequency_score: number;
  advice: string;
  category: string;
}

const PerformanceAdvisor = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AdviceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isPremium = profile?.is_premium && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  const [pastAdvices, setPastAdvices] = useState<{ id: string; category: string; created_at: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("performance_advices")
      .select("id, category, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setPastAdvices(data ?? []));
  }, [user]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = useCallback(async () => {
    if (!selectedCategory) {
      toast({ title: "Selecione uma categoria", variant: "destructive" });
      return;
    }
    setError(null);
    setResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await analyzeAudio(blob);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            recorder.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      toast({ title: "Permita o acesso ao microfone", variant: "destructive" });
    }
  }, [selectedCategory, toast]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const analyzeAudio = async (blob: Blob) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", blob, "performance.webm");
      formData.append("category", selectedCategory!);

      const { data, error: fnError } = await supabase.functions.invoke("performance-advisor", {
        body: formData,
      });

      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
        if (data.blocked) {
          toast({ title: "Conteúdo bloqueado", description: data.error, variant: "destructive" });
        }
        return;
      }

      setResult(data as AdviceResult);
    } catch (err: any) {
      setError(err?.message || "Erro ao analisar áudio");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetState = () => {
    setResult(null);
    setError(null);
    setRecordingTime(0);
    setSelectedCategory(null);
  };

  const emotionLabels: Record<string, string> = {
    ansiedade: "Ansiedade",
    confiança: "Confiança",
    hesitação: "Hesitação",
    entusiasmo: "Entusiasmo",
    cansaço: "Cansaço",
    neutro: "Neutro",
    calma: "Calma",
    determinação: "Determinação",
    frustração: "Frustração",
  };

  return (
    <div className="min-h-screen bg-background noise">
      {/* Header */}
      <nav className="sticky top-0 z-20 py-3 bg-black/80 backdrop-blur-md border-b border-primary/5">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Conselheiro de Performance</h1>
            <p className="text-xs text-muted-foreground">Análise de tom vocal + biofeedback</p>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Result View */}
        {result ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Tone Analysis Card */}
            <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-foreground">Análise do Tom Vocal</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Emoção Dominante</span>
                  <span className="text-sm font-semibold text-primary">
                    {emotionLabels[result.tone_analysis?.dominant_emotion] || result.tone_analysis?.dominant_emotion || "—"}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Confiança</span>
                    <span className="text-foreground">{result.tone_analysis?.confidence_level || 0}/10</span>
                  </div>
                  <Progress value={(result.tone_analysis?.confidence_level || 0) * 10} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Estresse</span>
                    <span className="text-foreground">{result.tone_analysis?.stress_indicator || 0}/10</span>
                  </div>
                  <Progress value={(result.tone_analysis?.stress_indicator || 0) * 10} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Energia</span>
                    <span className="text-foreground">{result.tone_analysis?.energy_level || 0}/10</span>
                  </div>
                  <Progress value={(result.tone_analysis?.energy_level || 0) * 10} className="h-2" />
                </div>

                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Score de Frequência</span>
                    <span className="font-bold text-primary">{result.frequency_score}/100</span>
                  </div>
                  <Progress value={result.frequency_score} className="h-3" />
                </div>
              </div>
            </div>

            {/* Advice Card */}
            <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-foreground">Conselho de Performance</h2>
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {result.advice}
              </div>
            </div>

            {/* Transcription */}
            <div className="rounded-2xl border border-white/[0.06] bg-card/40 p-4">
              <p className="text-xs text-muted-foreground mb-1">Sua fala:</p>
              <p className="text-sm text-foreground/70 italic">"{result.transcription}"</p>
            </div>

            <Button variant="cyan" size="lg" className="w-full" onClick={resetState}>
              Nova Consulta
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Escolha o foco</h2>
              <p className="text-sm text-muted-foreground mb-4">Selecione a área para receber seu conselho personalizado</p>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(175,70%,50%,0.15)]"
                          : "border-white/[0.06] bg-card/40 hover:border-primary/20"
                      )}
                    >
                      <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-xs font-medium", isSelected ? "text-primary" : "text-muted-foreground")}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recording Area */}
            <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm p-6 text-center">
              {isAnalyzing ? (
                <div className="py-8 space-y-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground">Analisando tom vocal e gerando conselho...</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    Grave até <span className="text-primary font-semibold">30 segundos</span> de áudio falando sobre sua situação atual
                  </p>

                  {isRecording && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Gravando...</span>
                        <span>{recordingTime}s / {MAX_RECORDING_TIME}s</span>
                      </div>
                      <Progress value={(recordingTime / MAX_RECORDING_TIME) * 100} className="h-2" />
                    </div>
                  )}

                  {!isRecording ? (
                    <Button
                      variant="cyan"
                      size="xl"
                      className="w-full max-w-xs mx-auto"
                      onClick={startRecording}
                      disabled={!selectedCategory}
                    >
                      <Mic className="h-5 w-5" />
                      Gravar Áudio
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="lg"
                      className="w-full max-w-xs mx-auto"
                      onClick={stopRecording}
                    >
                      <Square className="h-4 w-4" />
                      Parar Gravação
                    </Button>
                  )}
                </>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setError(null)}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* Safety Notice */}
            <div className="flex items-start gap-2 rounded-xl bg-card/30 border border-white/[0.04] p-3">
              <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Este recurso possui filtro de segurança. Menções a violência, drogas ou atividades ilícitas serão bloqueadas automaticamente.
              </p>
            </div>
          </div>
        )}

        {/* Past advices */}
        {pastAdvices.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-2 text-sm">Relatórios anteriores</h3>
            <PerformanceAdviceList advices={pastAdvices} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAdvisor;
