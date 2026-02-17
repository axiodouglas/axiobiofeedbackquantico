import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, UserCheck, Flame, HeartHandshake, Info, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFreeDiagnosisUsed } from "@/hooks/use-free-diagnosis";
import { useAreaLock } from "@/hooks/use-area-lock";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OnboardingBanner from "@/components/OnboardingBanner";

const areas = [
  {
    id: "mae",
    title: "Mãe",
    description: "A mãe é a base da segurança e prosperidade. Entenda como essa conexão molda suas crenças hoje.",
    icon: <Heart className="h-8 w-8" />,
    iconColor: "bg-axio-relationship/20 text-axio-relationship",
  },
  {
    id: "pai",
    title: "Pai",
    description: "Desbloqueie a força paterna e sua capacidade de agir.",
    icon: <UserCheck className="h-8 w-8" />,
    iconColor: "bg-primary/20 text-primary",
  },
  {
    id: "traumas",
    title: "Traumas",
    description: "Bullying, acidentes, perdas e abusos externos.",
    icon: <Flame className="h-8 w-8" />,
    iconColor: "bg-axio-family/20 text-axio-family",
  },
  {
    id: "relacionamento",
    title: "Relacionamentos",
    description: "Descubra as projeções de Pai e Mãe no seu parceiro.",
    icon: <HeartHandshake className="h-8 w-8" />,
    iconColor: "bg-axio-relationship/20 text-axio-relationship",
  },
];

const AreaSelection = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { freeDiagnosisUsed } = useFreeDiagnosisUsed(user?.id);
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const { lockedAreas } = useAreaLock(user?.id, isAdmin);

  const isPremium = profile?.is_premium && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  const handleSelect = (area: typeof areas[number]) => {
    if (isPremium) {
      navigate(`/recording?area=${area.id}`);
      return;
    }

    // Non-premium: only "mae" and only if free diagnosis not used
    if (area.id !== "mae") {
      navigate("/planos");
      return;
    }

    if (freeDiagnosisUsed) {
      toast({
        title: "Diagnóstico cortesia já utilizado",
        description: "Você já utilizou seu diagnóstico cortesia. Assine um plano para liberar todos os pilares.",
        variant: "destructive",
      });
      navigate("/planos");
      return;
    }

    navigate(`/recording?area=${area.id}`);
  };

  return (
    <div className="min-h-screen bg-background noise flex flex-col">
      <OnboardingBanner />
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Escolha o Pilar</h1>
          <p className="text-muted-foreground mb-8">
            Selecione qual área deseja trabalhar agora.
          </p>

          {isPremium && (
            <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 text-left">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Você tem acesso <span className="font-semibold text-primary">Premium</span>. Todos os pilares estão liberados.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {areas.map((area) => {
              const isPremiumLocked = !isPremium && area.id !== "mae";
              const isFreeUsed = !isPremium && area.id === "mae" && freeDiagnosisUsed;
              const isAreaLocked = isPremium && !isAdmin && lockedAreas[area.id]?.locked;

              return (
                <div
                  key={area.id}
                  onClick={() => handleSelect(area)}
                  className={`group relative overflow-hidden rounded-xl border-2 bg-card cursor-pointer p-6 transition-all duration-300 ${
                    isPremiumLocked || isFreeUsed || isAreaLocked
                      ? "border-border/50 opacity-60"
                      : "border-border hover:border-primary/60 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.2)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${area.iconColor} transition-transform group-hover:scale-110`}>
                      {isPremiumLocked || isFreeUsed ? <Lock className="h-8 w-8" /> : isAreaLocked ? <Clock className="h-8 w-8" /> : area.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-foreground">{area.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isAreaLocked
                          ? `Aguarde ${lockedAreas[area.id].daysRemaining} dia(s) — protocolo ativo`
                          : isFreeUsed
                          ? "Diagnóstico gratuito já utilizado"
                          : isPremiumLocked
                          ? "Premium"
                          : area.description}
                      </p>
                      {!isPremiumLocked && !isFreeUsed && !isPremium && (
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                          Gratuito
                        </span>
                      )}
                      {(isPremiumLocked || isFreeUsed) && (
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaSelection;
