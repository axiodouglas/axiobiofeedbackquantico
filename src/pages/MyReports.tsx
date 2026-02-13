import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AreaCard } from "@/components/AreaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Calendar, Activity } from "lucide-react";
import UserMenu from "@/components/UserMenu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Diagnosis {
  id: string;
  area: string;
  created_at: string;
}

export default function MyReports() {
  const { user, loading, refreshProfile } = useAuth();

  // Force profile refresh when accessing reports
  useEffect(() => {
    if (user) refreshProfile();
  }, [user]);
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("diagnoses")
        .select("id, area, created_at")
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

  // Group diagnoses by date (dd/MM/yyyy)
  const grouped = diagnoses.reduce<Record<string, Diagnosis[]>>((acc, d) => {
    const dateKey = format(new Date(d.created_at), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(d);
    return acc;
  }, {});

  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

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

        {dateKeys.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Activity className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">Nenhum relatório gerado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dateKeys.map((dateKey) => {
              const count = grouped[dateKey].length;
              return (
                <AreaCard
                  key={dateKey}
                  title={format(new Date(dateKey), "dd/MM/yyyy")}
                  description={`${count} diagnóstico${count > 1 ? "s" : ""} neste dia`}
                  icon={<Calendar className="h-7 w-7" />}
                  iconColor="bg-primary/20 text-primary"
                  onClick={() => navigate(`/meus-relatorios/${dateKey}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
