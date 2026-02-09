import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AreaCard } from "@/components/AreaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Calendar, Activity } from "lucide-react";
import UserMenu from "@/components/UserMenu";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const areaLabels: Record<string, string> = {
  pai: "Pai",
  mae: "Mãe",
  traumas: "Traumas",
  relacionamento: "Relacionamentos",
  financeiro: "Financeiro",
  saude: "Saúde",
  familiar: "Familiar",
};

const areaIcons: Record<string, string> = {
  pai: "👨",
  mae: "👩",
  traumas: "🧠",
  relacionamento: "❤️",
  financeiro: "💰",
  saude: "🏥",
  familiar: "👨‍👩‍👧‍👦",
};

interface Diagnosis {
  id: string;
  area: string;
  frequency_score: number | null;
  created_at: string;
}

export default function MyReports() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("diagnoses")
        .select("id, area, frequency_score, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setDiagnoses(data ?? []);
          setLoadingData(false);
        });
    }
  }, [user]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Perfil
          </Button>
          <UserMenu />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Meus Relatórios</h1>

        {diagnoses.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Activity className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">Nenhum relatório gerado ainda.</p>
            <p className="text-sm text-muted-foreground">Grave um áudio em qualquer pilar para gerar seu primeiro relatório.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diagnoses.map((d) => {
              const daysLeft = 90 - differenceInDays(new Date(), new Date(d.created_at));
              const expiresLabel = daysLeft <= 0 ? "Expirado" : `Expira em ${daysLeft}d`;

              return (
                <AreaCard
                  key={d.id}
                  title={format(new Date(d.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  description={`${areaLabels[d.area] || d.area} — ${expiresLabel}`}
                  icon={<span className="text-2xl">{areaIcons[d.area] || "📋"}</span>}
                  iconColor="bg-primary/20 text-primary"
                  isPremium={false}
                  isLocked={false}
                  badge={areaLabels[d.area] || d.area}
                  onClick={() => navigate(`/diagnosis/${d.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
