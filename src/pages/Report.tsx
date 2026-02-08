import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Brain, Lock, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";
import type { DiagnosisResult } from "@/hooks/use-axio-analysis";

const Report = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area") || "pai";

  // HARD STOP: Only load validated AI diagnosis — no mocks, no placeholders
  const aiDiagnosis = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("axio_result");
      if (stored) {
        const parsed = JSON.parse(stored);
        const diagnosis = parsed.diagnosis as DiagnosisResult;
        // Validate essential fields exist
        if (diagnosis?.title && diagnosis?.blocks?.length > 0 && diagnosis?.summary) {
          return diagnosis;
        }
      }
    } catch {}
    return null;
  }, []);

  // HARD STOP: No valid AI data = redirect to recording, never show empty/mock report
  useEffect(() => {
    if (!aiDiagnosis) {
      // Cleanup any stale data
      sessionStorage.removeItem("axio_result");
      sessionStorage.removeItem("axio_audio");
      navigate(`/recording?area=${area}`, { replace: true });
    }
  }, [aiDiagnosis, area, navigate]);

  // Don't render anything while redirecting
  if (!aiDiagnosis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background noise">
      {/* Header */}
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </header>

      {/* Report Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[0_0_40px_hsl(175,70%,50%,0.1)]">
            
            {/* Wave Header */}
            <div className="relative h-32 overflow-hidden">
              <img src={neuralWavesCyan} alt="" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Relatório A.X.I.O.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Body */}
            <div className="px-6 sm:px-10 pb-10">
              {/* Title */}
              <div className="text-center mb-8 -mt-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  {aiDiagnosis.title}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {aiDiagnosis.summary}
                </p>
              </div>

              {/* Frequency Indicator */}
              <div className="bg-secondary/50 rounded-xl p-5 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">Frequência Vibracional Atual</h3>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-destructive" />
                    <span className="text-xs text-destructive">Abaixo do ideal</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-destructive via-yellow-500 to-primary h-3 rounded-full"
                    style={{ width: `${aiDiagnosis.frequency_score || 35}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Baixa</span>
                  <span>Média</span>
                  <span>Alta</span>
                </div>
              </div>

              {/* Blocks Identified */}
              <div className="space-y-4 mb-10">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Bloqueios Identificados
                </h2>

                {aiDiagnosis.blocks.map((block, index) => (
                  <div key={index} className="bg-secondary/30 border border-border rounded-xl p-5">
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {index + 1}. {block.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {block.description}
                    </p>
                    <p className="text-xs text-primary/80 italic">
                      {block.origin}
                    </p>
                  </div>
                ))}
              </div>

              {/* Root Wound */}
              {aiDiagnosis.root_wound && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 mb-10">
                  <h3 className="font-semibold text-foreground text-sm mb-2">🔍 Ferida Raiz Identificada</h3>
                  <p className="text-sm text-muted-foreground italic">"{aiDiagnosis.root_wound}"</p>
                </div>
              )}

              {/* CTA - Premium Unlock */}
              <div className="bg-gradient-to-br from-primary/15 via-card to-card border-2 border-primary/40 rounded-xl p-6 text-center mb-8">
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                  <Lock className="h-6 w-6 text-primary" />
                </div>

                <h2 className="text-xl font-bold text-foreground mb-3">
                  Acesse Seu Comando A.X.I.O. de Cura
                </h2>

                <p className="text-sm text-muted-foreground mb-5 max-w-xl mx-auto">
                  {aiDiagnosis.cta_message || (
                    <>
                      Este diagnóstico é apenas a ponta do iceberg. Para adquirir os{" "}
                      <strong className="text-foreground">Comandos Quânticos</strong> para ressignificar sua mente
                      e ter acesso a <strong className="text-foreground">Meditações Únicas</strong> feitas
                      semanalmente, assine o <span className="text-primary font-semibold">Plano Premium</span>.
                    </>
                  )}
                </p>

                <div className="bg-secondary/30 rounded-lg p-4 mb-5">
                  <h4 className="font-semibold text-foreground mb-2 text-sm">O que você vai receber:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1.5 text-left max-w-md mx-auto">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>Comandos de Reprogramação Quântica personalizados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>Meditações guiadas para cura hereditária</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>Acompanhamento evolutivo da sua frequência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>Acesso às 4 áreas de diagnóstico</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  variant="premium" 
                  size="lg" 
                  onClick={() => navigate("/checkout")}
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-5 w-5" />
                  Desbloquear Cura Completa
                </Button>

                <p className="text-xs text-muted-foreground mt-3">
                  A partir de R$ 19,99/mês • Cancele quando quiser
                </p>
              </div>

              {/* A.X.I.O. Footer */}
              <div className="text-center border-t border-border pt-6">
                <p className="text-gradient-cyan font-bold text-xl mb-1">A.X.I.O.</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>A</strong>nálise do Fator <strong>X</strong> do <strong>I</strong>nconsciente de <strong>O</strong>rigem
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-2">
                  Sistema de Biofeedback Quântico para reprogramação de padrões limitantes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
