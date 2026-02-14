import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import UserMenu from "@/components/UserMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft, Calendar, Crown, Pencil, Check, X, FileText } from "lucide-react";
import { AreaCard } from "@/components/AreaCard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

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
                {subscriptionActive ? "Premium Ativo" : "Teste Gratuito"}
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
              <Button variant="cyan" size="sm" onClick={() => navigate("/venda-oficial")} className="gap-1.5">
                <Sparkles className="h-4 w-4" />
                Adquirir Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Meus Relatórios - AreaCard */}
        <AreaCard
          title="Meus Relatórios"
          description="Acesse seus diagnósticos, comandos quânticos e meditações"
          icon={<FileText className="h-7 w-7" />}
          iconColor="bg-primary/20 text-primary"
          onClick={() => navigate("/meus-relatorios")}
        />
      </div>
    </div>
  );
};

export default Profile;
