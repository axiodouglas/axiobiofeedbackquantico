import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AreaCard } from "@/components/AreaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Activity } from "lucide-react";
import UserMenu from "@/components/UserMenu";
import { format } from "date-fns";

const areaLabels: Record<string, string> = {
  pai: "Pai",
  mae: "Mãe",
  traumas: "Traumas",
  relacionamento: "Relacionamentos",
};

const areaIcons: Record<string, string> = {
  pai: "👨",
  mae: "👩",
  traumas: "🧠",
  relacionamento: "❤️",
};

interface Diagnosis {
  id: string;
  area: string;
  created_at: string;
}

export default function ReportsByDate() {
  const { date } = useParams<{ date: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && date) {
      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;

      supabase
        .from("diagnoses")
        .select("id, area, created_at")
        .eq("user_id", user.id)
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setDiagnoses(data ?? []);
          setLoadingData(false);
        });
    }
  }, [user, date]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  const displayDate = date ? format(new Date(date), "dd/MM/yyyy") : "";

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/meus-relatorios")} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Relatórios
          </Button>
          <UserMenu />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{displayDate}</h1>

        {diagnoses.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Activity className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">Nenhum relatório nesta data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diagnoses.map((d) => (
              <AreaCard
                key={d.id}
                title={areaLabels[d.area] || d.area}
                description="Toque para ver relatório, comandos e meditação"
                icon={<span className="text-2xl">{areaIcons[d.area] || "📋"}</span>}
                iconColor="bg-primary/20 text-primary"
                badge={areaLabels[d.area] || d.area}
                onClick={() => navigate(`/diagnosis/${d.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
