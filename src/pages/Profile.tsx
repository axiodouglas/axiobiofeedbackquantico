import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import UserMenu from "@/components/UserMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft, FileText, Calendar, Activity, Crown, Pencil, Check, X, AlertTriangle, FolderTree } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DiagnosisFolder from "@/components/DiagnosisFolder";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Diagnosis {
  id: string;
  area: string;
  frequency_score: number | null;
  created_at: string;
  diagnosis_result: any;
}

const areaLabels: Record<string, string> = {
  pai: "Pai",
  mae: "Mãe",
  ansiedade: "Ansiedade",
  medo: "Medo",
  financeiro: "Financeiro",
  saude: "Saúde",
  relacionamento: "Relacionamento",
};

const Profile = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loadingDiagnoses, setLoadingDiagnoses] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("diagnoses")
        .select("id, area, frequency_score, created_at, diagnosis_result")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setDiagnoses(data ?? []);
          setLoadingDiagnoses(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  const handleSaveName = async () => {
    if (!user || !nameValue.trim()) return;
    setSavingName(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: nameValue.trim() })
      .eq("user_id", user.id);
    setSavingName(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: "Tente novamente.", variant: "destructive" });
    } else {
      toast({ title: "Nome atualizado!" });
      await refreshProfile();
      setEditingName(false);
    }
  };

  const subscriptionActive =
    profile?.is_premium &&
    (!profile.subscription_expires_at ||
      new Date(profile.subscription_expires_at) > new Date());

  return (
    <div className="min-h-screen bg-background noise">
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <UserMenu />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary text-xl font-bold shrink-0">
            {(profile?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="h-9 text-sm max-w-[200px]"
                  placeholder="Seu nome completo"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={handleSaveName} disabled={savingName}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setEditingName(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground truncate">
                  {profile?.full_name || user?.email?.split("@")[0]}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary shrink-0"
                  onClick={() => {
                    setNameValue(profile?.full_name || "");
                    setEditingName(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Subscription Card */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Status da Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant={subscriptionActive ? "default" : "secondary"} className="text-xs">
                {subscriptionActive ? "Premium Ativo" : "Gratuito"}
              </Badge>
              {profile?.subscription_type && (
                <span className="text-sm text-muted-foreground capitalize">
                  Plano {profile.subscription_type}
                </span>
              )}
            </div>
            {subscriptionActive && profile?.subscription_expires_at && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Expira em{" "}
                {format(new Date(profile.subscription_expires_at), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            )}
            {!subscriptionActive && (
              <Button variant="cyan" size="sm" onClick={() => navigate("/checkout")} className="gap-1.5">
                <Sparkles className="h-4 w-4" />
                Assinar Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Meus Relatórios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-primary" />
              Meus Relatórios
              {diagnoses.length > 0 && (
                <Badge variant="secondary" className="text-xs ml-auto">
                  {diagnoses.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDiagnoses ? (
              <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
            ) : diagnoses.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Activity className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground">Nenhum relatório gerado ainda.</p>
                <p className="text-xs text-muted-foreground">Grave um áudio em qualquer pilar para gerar seu primeiro relatório.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {diagnoses.map((d) => (
                  <DiagnosisFolder
                    key={d.id}
                    diagnosis={d}
                    isPremium={true}
                    userId={user!.id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aviso de expiração */}
        {diagnoses.length > 0 && (
          <Alert className="border-yellow-500/30 bg-yellow-500/5">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-xs text-muted-foreground">
              Os relatórios e comandos são apagados automaticamente a cada 3 meses para garantir a atualização da sua jornada.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Profile;
