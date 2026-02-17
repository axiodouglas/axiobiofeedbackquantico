import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Brain, Shield, Zap, Activity, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryLabels: Record<string, string> = {
  trabalho: "Trabalho",
  relacionamentos: "Relacionamentos",
  outros: "Outros",
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

const PerformanceAdviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("performance_advices")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          navigate("/conselheiro", { replace: true });
          return;
        }
        setAdvice(data);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const tone = advice.tone_analysis as any;

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 py-3 bg-black/80 backdrop-blur-md border-b border-primary/5">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/conselheiro")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Conselho de Performance</h1>
            <p className="text-xs text-muted-foreground">
              {categoryLabels[advice.category] || advice.category} — {format(new Date(advice.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-lg space-y-6">
        {/* Tone Analysis Card */}
        {tone && (
          <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-foreground">Análise do Tom Vocal</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Emoção Dominante</span>
                <span className="text-sm font-semibold text-primary">
                  {emotionLabels[tone.dominant_emotion] || tone.dominant_emotion || "—"}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Confiança</span>
                  <span className="text-foreground">{tone.confidence_level || 0}/10</span>
                </div>
                <Progress value={(tone.confidence_level || 0) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Estresse</span>
                  <span className="text-foreground">{tone.stress_indicator || 0}/10</span>
                </div>
                <Progress value={(tone.stress_indicator || 0) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Energia</span>
                  <span className="text-foreground">{tone.energy_level || 0}/10</span>
                </div>
                <Progress value={(tone.energy_level || 0) * 10} className="h-2" />
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Score de Frequência</span>
                  <span className="font-bold text-primary">{advice.frequency_score || 0}/100</span>
                </div>
                <Progress value={advice.frequency_score || 0} className="h-3" />
              </div>
            </div>
          </div>
        )}

        {/* Advice Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Conselho de Performance</h2>
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
            {advice.advice_text}
          </div>
        </div>

        {/* Transcription */}
        {advice.transcription && (
          <div className="rounded-2xl border border-white/[0.06] bg-card/40 p-4">
            <p className="text-xs text-muted-foreground mb-1">Sua fala:</p>
            <p className="text-sm text-foreground/70 italic">"{advice.transcription}"</p>
          </div>
        )}

        <Button variant="cyan" size="lg" className="w-full" onClick={() => navigate("/conselheiro")}>
          Voltar ao Conselheiro
        </Button>
      </div>
    </div>
  );
};

export default PerformanceAdviceDetail;
