import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Brain, Lock, Sparkles, TrendingUp, DollarSign, Stethoscope, Users, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";
import type { DiagnosisResult } from "@/hooks/use-axio-analysis";
import { useAuth } from "@/hooks/use-auth";

interface SecondaryImpacts {
  financeiro?: string;
  saude?: string;
  relacionamentos?: string;
}

interface ExtendedDiagnosis extends DiagnosisResult {
  secondary_impacts?: SecondaryImpacts;
}

const Report = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area") || "mae";
  const { profile } = useAuth();
  const isPremium = profile?.is_premium && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  const aiDiagnosis = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("axio_result");
      if (stored) {
        const parsed = JSON.parse(stored);
        const diagnosis = parsed.diagnosis as ExtendedDiagnosis;
        if (diagnosis?.title && diagnosis?.blocks?.length > 0 && diagnosis?.summary) {
          return diagnosis;
        }
      }
    } catch {}
    return null;
  }, []);

  useEffect(() => {
    if (!aiDiagnosis) {
      sessionStorage.removeItem("axio_result");
      sessionStorage.removeItem("axio_audio");
      navigate(`/recording?area=${area}`, { replace: true });
    }
  }, [aiDiagnosis, area, navigate]);

  if (!aiDiagnosis) return null;

  return (
    <div className="min-h-screen bg-background noise">
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </header>

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

              {/* Sentimentos Predominantes */}
              {aiDiagnosis.predominant_sentiments?.length > 0 && (
                <div className="bg-secondary/50 rounded-xl p-5 mb-8">
                  <h3 className="font-semibold text-foreground text-sm mb-3">Sentimentos Predominantes</h3>
                  <div className="space-y-2">
                    {aiDiagnosis.predominant_sentiments
                      .sort((a, b) => b.intensity - a.intensity)
                      .slice(0, 1)
                      .map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{s.name}</span>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-destructive via-yellow-500 to-primary h-3 rounded-full"
                              style={{ width: `${s.intensity}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

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

              {/* Secondary Impacts - How trauma affects the 3 areas */}
              {aiDiagnosis.secondary_impacts && (
                <div className="mb-10">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    📊 Relatório de Impacto nas 3 Áreas da Vida
                  </h2>
                  <div className="space-y-3">
                    {aiDiagnosis.secondary_impacts.financeiro && (
                      <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-4">
                        <DollarSign className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">💰 Financeiro</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {aiDiagnosis.secondary_impacts.financeiro}
                          </p>
                        </div>
                      </div>
                    )}
                    {aiDiagnosis.secondary_impacts.saude && (
                      <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-4">
                        <Stethoscope className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">🏥 Saúde</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {aiDiagnosis.secondary_impacts.saude}
                          </p>
                        </div>
                      </div>
                    )}
                    {aiDiagnosis.secondary_impacts.relacionamentos && (
                      <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-4">
                        <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">❤️ Relacionamentos</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {aiDiagnosis.secondary_impacts.relacionamentos}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* CTA - Premium Unlock (only for non-premium) */}
              {!isPremium && (
              <div className="bg-gradient-to-br from-primary/15 via-card to-card border-2 border-primary/40 rounded-xl p-6 text-center mb-8">
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                  <Lock className="h-6 w-6 text-primary" />
                </div>

                <h2 className="text-xl font-bold text-foreground mb-3">
                  Adquira o Plano Completo
                </h2>

                <p className="text-sm text-muted-foreground mb-5 max-w-xl mx-auto">
                  Comandos quânticos para cura, meditações exclusivas para o seu caso e acesso à comunidade com depoimentos reais de transformação.
                </p>

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
              )}

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
