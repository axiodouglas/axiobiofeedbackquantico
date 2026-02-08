import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Sparkles, Mic, AlertTriangle, TrendingUp, DollarSign, Stethoscope, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";

const areaLabels: Record<string, string> = {
  pai: "Pai",
  mae: "Mãe",
  traumas: "Traumas",
  relacionamentos: "Relacionamentos",
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

const DiagnosisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [commands, setCommands] = useState<QuantumCommand[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeSection, setActiveSection] = useState<"report" | "commands" | "meditation" | null>(null);

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
          <Button variant="ghost" onClick={() => navigate("/profile")}>Voltar ao Perfil</Button>
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

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar
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
        {/* Section Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {/* 1. Relatório */}
          <Card
            className={`cursor-pointer transition-all border-2 ${activeSection === "report" ? "border-primary/60" : "border-border hover:border-primary/30"}`}
            onClick={() => setActiveSection(activeSection === "report" ? null : "report")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Relatório A.X.I.O. Gerado
              </CardTitle>
            </CardHeader>
          </Card>

          {activeSection === "report" && dr && (
            <ReportSection diagnosis={dr} />
          )}

          {/* 2. Comandos Quânticos */}
          <Card
            className={`cursor-pointer transition-all border-2 ${activeSection === "commands" ? "border-primary/60" : "border-border hover:border-primary/30"} ${!isPremium ? "opacity-60" : ""}`}
            onClick={() => isPremium && setActiveSection(activeSection === "commands" ? null : "commands")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Comandos Quânticos da Semana
                {!isPremium && <Badge variant="secondary" className="text-[10px] ml-auto">Premium</Badge>}
              </CardTitle>
            </CardHeader>
          </Card>

          {activeSection === "commands" && isPremium && (
            <CommandsSection commands={commandsByType} />
          )}

          {/* 3. Meditação */}
          <Card
            className={`cursor-pointer transition-all border-2 ${activeSection === "meditation" ? "border-primary/60" : "border-border hover:border-primary/30"} ${!isPremium ? "opacity-60" : ""}`}
            onClick={() => isPremium && setActiveSection(activeSection === "meditation" ? null : "meditation")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Meditação da Semana
                {!isPremium && <Badge variant="secondary" className="text-[10px] ml-auto">Premium</Badge>}
              </CardTitle>
            </CardHeader>
          </Card>

          {activeSection === "meditation" && isPremium && (
            <MeditationSection />
          )}
        </div>
      </div>
    </div>
  );
};

/* ---- Sub-sections ---- */

function ReportSection({ diagnosis }: { diagnosis: any }) {
  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6 space-y-6">
        {/* Title & Summary */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">{diagnosis.title}</h2>
          <p className="text-sm text-muted-foreground">{diagnosis.summary}</p>
        </div>

        {/* Sentimento Predominante */}
        {diagnosis.predominant_sentiments?.length > 0 && (
          <div className="bg-secondary/50 rounded-xl p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">Sentimento Predominante</h3>
            {diagnosis.predominant_sentiments
              .sort((a: any, b: any) => b.intensity - a.intensity)
              .slice(0, 1)
              .map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <div className="flex items-center gap-2 flex-1 mx-4">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-to-r from-destructive via-yellow-500 to-primary h-3 rounded-full" style={{ width: `${s.intensity}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.intensity}%</span>
                </div>
              ))}
          </div>
        )}

        {/* Bloqueios */}
        {diagnosis.blocks?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Bloqueios Identificados
            </h3>
            {diagnosis.blocks.map((block: any, i: number) => (
              <div key={i} className="bg-secondary/30 border border-border rounded-xl p-4">
                <h4 className="text-sm font-semibold text-foreground mb-1">{i + 1}. {block.name}</h4>
                <p className="text-xs text-muted-foreground">{block.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Ferida Raiz */}
        {diagnosis.root_wound && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <h3 className="font-semibold text-foreground text-sm mb-1">🔍 Ferida Raiz</h3>
            <p className="text-sm text-muted-foreground italic">"{diagnosis.root_wound}"</p>
          </div>
        )}

        {/* Impactos Secundários */}
        {diagnosis.secondary_impacts && (
          <div className="space-y-2">
            <h3 className="text-base font-bold text-foreground">📊 Impacto nas 3 Áreas</h3>
            {diagnosis.secondary_impacts.financeiro && (
              <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-3">
                <DollarSign className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">💰 Financeiro</p>
                  <p className="text-xs text-muted-foreground">{diagnosis.secondary_impacts.financeiro}</p>
                </div>
              </div>
            )}
            {diagnosis.secondary_impacts.saude && (
              <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-3">
                <Stethoscope className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">🏥 Saúde</p>
                  <p className="text-xs text-muted-foreground">{diagnosis.secondary_impacts.saude}</p>
                </div>
              </div>
            )}
            {diagnosis.secondary_impacts.relacionamentos && (
              <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-3">
                <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">❤️ Relacionamentos</p>
                  <p className="text-xs text-muted-foreground">{diagnosis.secondary_impacts.relacionamentos}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CommandsSection({ commands }: { commands: { manha?: QuantumCommand; dia?: QuantumCommand; noite?: QuantumCommand } }) {
  const periods = [
    { key: "manha" as const, label: "☀️ Manhã", cmd: commands.manha },
    { key: "dia" as const, label: "🌤️ Dia", cmd: commands.dia },
    { key: "noite" as const, label: "🌙 Noite", cmd: commands.noite },
  ];

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6 space-y-4">
        {periods.map(p => (
          <div key={p.key} className="bg-secondary/30 border border-border rounded-xl p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">{p.label}</h4>
            {p.cmd ? (
              <p className="text-sm text-muted-foreground leading-relaxed">{p.cmd.command_text}</p>
            ) : (
              <p className="text-xs text-muted-foreground italic">Comando será gerado após o diagnóstico semanal.</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface QuantumCommand {
  id: string;
  command_text: string;
  command_type: string | null;
}

function MeditationSection() {
  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6">
        <div className="text-center py-8 space-y-3">
          <Mic className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-sm text-muted-foreground">
            A meditação gravada com sua própria voz ficará disponível aqui após a geração dos comandos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DiagnosisDetail;
