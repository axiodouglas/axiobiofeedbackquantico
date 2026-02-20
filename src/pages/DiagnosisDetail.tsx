import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AreaCard } from "@/components/AreaCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Sparkles, Mic, AlertTriangle, DollarSign, Stethoscope, Users, Activity, Lock, Crown } from "lucide-react";
import MeditationScript from "@/components/MeditationScript";
import SomatizationBodyMap from "@/components/SomatizationBodyMap";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const areaLabels: Record<string, string> = {
  pai: "Pai",
  mae: "Mãe",
  traumas: "Traumas",
  relacionamento: "Relacionamentos",
  crencas_limitantes: "Crenças Limitantes",
};

interface DiagnosisData {
  id: string;
  area: string;
  frequency_score: number | null;
  created_at: string;
  diagnosis_result: any;
}

interface QuantumCommand {
  id: string;
  command_text: string;
  command_type: string | null;
}

const RITUAL_INTRO = `A cura AXIO exige que sua mente lógica se cale para que seu corpo aprenda. Siga este ritual antes de cada comando para induzir o estado de transe e alta sugestão:

1. Feche os olhos e, mesmo de olhos fechados, direcione seu olhar para o topo da cabeça (olhe para cima internamente, em direção à testa).
2. Faça 5 respirações profundas: inspire pelo nariz e solte pela boca suavemente.
3. Na 5ª vez que soltar o ar, esvazie os pulmões completamente e segure sem ar pelo máximo de tempo que conseguir, sentindo o silêncio absoluto do seu corpo.
4. Quando não aguentar mais e precisar respirar, deixe o ar entrar naturalmente, sinta a calma profunda e inicie a fala do comando abaixo.

✨ Instrução de Ouro: Se conseguir lembrar de cabeça, fale o comando de olhos fechados. Repita cada comando 3 vezes seguidas com convicção, conversando diretamente com seu corpo e sua mente.`;

const DiagnosisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [commands, setCommands] = useState<QuantumCommand[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeSection, setActiveSection] = useState<"report" | "commands" | "meditation" | "somatization" | null>(null);

  const isPremium = profile?.is_premium && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    if (!user || !id) return;

    const fetchData = async () => {
      const [diagRes, cmdRes] = await Promise.all([
        supabase.from("diagnoses").select("*").eq("id", id).eq("user_id", user.id).single(),
        isPremium
          ? supabase.from("quantum_commands").select("*").eq("diagnosis_id", id).eq("user_id", user.id)
          : Promise.resolve({ data: [] }),
      ]);

      if (diagRes.data) setDiagnosis(diagRes.data as DiagnosisData);
      if (cmdRes.data) setCommands(cmdRes.data as QuantumCommand[]);
      setLoadingData(false);
    };

    fetchData();
  }, [user, id, loading, isPremium]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Diagnóstico não encontrado.</p>
          <Button variant="ghost" onClick={() => navigate("/meus-relatorios")}>Voltar</Button>
        </div>
      </div>
    );
  }

  const dr = diagnosis.diagnosis_result;
  const commandsByType = {
    manha: commands.find(c => c.command_type === "manha"),
    dia: commands.find(c => c.command_type === "dia"),
    noite: commands.find(c => c.command_type === "noite"),
  };

  const toggleSection = (section: typeof activeSection) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Free users see partial report (first half of blocks only)
  const isPartial = !isPremium;
  const visibleBlocks = isPartial && dr?.blocks?.length > 0
    ? dr.blocks.slice(0, Math.ceil(dr.blocks.length / 2))
    : dr?.blocks || [];

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Relatórios
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{areaLabels[diagnosis.area] || diagnosis.area}</Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(diagnosis.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
        {/* Partial report banner for free users */}
        {isPartial && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
            <Crown className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Relatório Parcial</p>
              <p className="text-xs text-muted-foreground mt-1">
                Você está vendo apenas metade da análise. Assine um plano para acessar o relatório completo, meditação e comandos quânticos.
              </p>
              <Button variant="cyan" size="sm" className="mt-3" onClick={() => navigate("/planos")}>
                <Crown className="h-3.5 w-3.5" /> Desbloquear Completo
              </Button>
            </div>
          </div>
        )}

        {/* Relatório */}
        <AreaCard
          title={isPartial ? "Relatório A.X.I.O. (Parcial)" : "Relatório A.X.I.O."}
          description="Visualize seu diagnóstico com bloqueios e sentimentos identificados"
          icon={<Brain className="h-7 w-7" />}
          iconColor="bg-primary/20 text-primary"
          onClick={() => toggleSection("report")}
        />

        {activeSection === "report" && dr && (
          <Card className="border-primary/20 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <CardContent className="pt-6 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground mb-2">{dr.title}</h2>
                <p className="text-sm text-muted-foreground">{dr.summary}</p>
              </div>

              {dr.predominant_sentiments?.length > 0 && (
                <div className="bg-secondary/50 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground text-sm mb-3">Sentimento Predominante</h3>
                  {dr.predominant_sentiments
                    .sort((a: any, b: any) => b.intensity - a.intensity)
                    .slice(0, 1)
                    .map((s: any, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{s.name}</span>
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div className="bg-gradient-to-r from-destructive via-yellow-500 to-primary h-3 rounded-full" style={{ width: `${s.intensity}%` }} />
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {visibleBlocks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Bloqueios Identificados {isPartial && <span className="text-xs text-muted-foreground font-normal">(parcial)</span>}
                  </h3>
                  {visibleBlocks.map((block: any, i: number) => (
                    <div key={i} className="bg-secondary/30 border border-border rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-foreground mb-1">{i + 1}. {block.name}</h4>
                      <p className="text-xs text-muted-foreground">{block.description}</p>
                    </div>
                  ))}
                  {isPartial && dr.blocks?.length > visibleBlocks.length && (
                    <div className="relative rounded-xl border border-dashed border-primary/20 bg-card/30 p-4 text-center">
                      <Lock className="h-5 w-5 text-primary/50 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">+{dr.blocks.length - visibleBlocks.length} bloqueios ocultos no plano gratuito</p>
                    </div>
                  )}
                </div>
              )}

              {/* Root wound and secondary impacts - premium only */}
              {!isPartial && dr.root_wound && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground text-sm mb-1">🔍 Ferida Raiz</h3>
                  <p className="text-sm text-muted-foreground italic">"{dr.root_wound}"</p>
                </div>
              )}

              {isPartial && dr.root_wound && (
                <div className="relative rounded-xl border border-dashed border-primary/20 bg-card/30 p-4 text-center">
                  <Lock className="h-5 w-5 text-primary/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Ferida Raiz disponível no plano Premium</p>
                </div>
              )}

              {!isPartial && dr.secondary_impacts && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground">📊 Impacto nas 3 Áreas</h3>
                  {dr.secondary_impacts.financeiro && (
                    <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-3">
                      <DollarSign className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">💰 Financeiro</p>
                        <p className="text-xs text-muted-foreground">{dr.secondary_impacts.financeiro}</p>
                      </div>
                    </div>
                  )}
                  {dr.secondary_impacts.saude && (
                    <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-3">
                      <Stethoscope className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">🏥 Saúde</p>
                        <p className="text-xs text-muted-foreground">{dr.secondary_impacts.saude}</p>
                      </div>
                    </div>
                  )}
                  {dr.secondary_impacts.relacionamentos && (
                    <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-3">
                      <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">❤️ Relacionamentos</p>
                        <p className="text-xs text-muted-foreground">{dr.secondary_impacts.relacionamentos}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isPartial && dr.secondary_impacts && (
                <div className="relative rounded-xl border border-dashed border-primary/20 bg-card/30 p-4 text-center">
                  <Lock className="h-5 w-5 text-primary/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Impacto nas 3 Áreas disponível no plano Premium</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Somatização - premium only */}
        <AreaCard
          title="Somatização"
          description={isPremium ? "Mapa corporal das emoções reprimidas identificadas no seu diagnóstico" : "Disponível apenas nos Planos Premium"}
          icon={<Activity className="h-7 w-7" />}
          iconColor="bg-primary/20 text-primary"
          isPremium={!isPremium}
          isLocked={!isPremium}
          onClick={() => isPremium ? toggleSection("somatization") : navigate("/planos")}
        />

        {activeSection === "somatization" && isPremium && dr && (
          <Card className="border-primary/20 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <CardContent className="pt-6">
              <SomatizationBodyMap somatizationMap={dr.somatization_map || []} />
            </CardContent>
          </Card>
        )}

        {/* Comandos - premium only */}
        <AreaCard
          title="Comandos Quânticos"
          description={isPremium ? "Seus comandos personalizados para manhã, tarde e noite" : "Disponível apenas nos Planos Premium"}
          icon={<Sparkles className="h-7 w-7" />}
          iconColor="bg-primary/20 text-primary"
          isPremium={!isPremium}
          isLocked={!isPremium}
          onClick={() => isPremium ? toggleSection("commands") : navigate("/planos")}
        />

        {activeSection === "commands" && isPremium && (
          <Card className="border-primary/20 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <CardContent className="pt-6 space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Protocolo de Preparo Fisiológico
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line">
                  {RITUAL_INTRO}
                </p>
              </div>
              {[
                { key: "manha", label: "🌅 Manhã — Identidade e Segurança", cmd: commandsByType.manha },
                { key: "dia", label: "☀️ Tarde — Merecimento e Ação", cmd: commandsByType.dia },
                { key: "noite", label: "🌙 Noite — Limpeza e Entrega", cmd: commandsByType.noite },
              ].map((p) => (
                <div key={p.key} className="bg-secondary/30 border border-border rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">{p.label}</h4>
                  {p.cmd ? (
                    <>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.cmd.command_text}</p>
                      <p className="text-[10px] text-primary/70 mt-2 italic">Repita 3 vezes com convicção.</p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Comando será gerado após o diagnóstico.</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Meditação - premium only */}
        <AreaCard
          title="Meditação da Semana"
          description={isPremium ? "Roteiro personalizado com gravação da sua própria voz" : "Disponível apenas nos Planos Premium"}
          icon={<Mic className="h-7 w-7" />}
          iconColor="bg-primary/20 text-primary"
          isPremium={!isPremium}
          isLocked={!isPremium}
          onClick={() => isPremium ? toggleSection("meditation") : navigate("/planos")}
        />

        {activeSection === "meditation" && isPremium && diagnosis && (
          <Card className="border-primary/20 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <CardContent className="pt-6">
              <MeditationScript
                userName={profile?.full_name || user?.email?.split("@")[0] || ""}
                diagnosisResult={dr}
                diagnosisId={diagnosis.id}
                userId={user!.id}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiagnosisDetail;
