import { useState, useEffect } from "react";
import { Heart, UserCheck, Flame, Mic, Brain, MessageSquare, Moon, HeartHandshake, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaCard } from "@/components/AreaCard";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useFreeDiagnosisUsed } from "@/hooks/use-free-diagnosis";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";
import OnboardingBanner from "@/components/OnboardingBanner";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { freeDiagnosisUsed } = useFreeDiagnosisUsed(user?.id);
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { setIsAdmin(false); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  const isPremium = isAdmin || (profile?.is_premium && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date()));

  const handleFreeArea = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isPremium && freeDiagnosisUsed) {
      toast({
        title: "Diagnóstico cortesia já utilizado",
        description: "Você já utilizou seu diagnóstico cortesia. Assine um plano para liberar todos os pilares.",
        variant: "destructive",
      });
      navigate("/planos");
      return;
    }
    navigate("/recording?area=mae");
  };

  const handlePremiumArea = (area: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isPremium) {
      if (freeDiagnosisUsed) {
        toast({
          title: "Diagnóstico cortesia já utilizado",
          description: "Você já utilizou seu diagnóstico cortesia. Assine um plano para liberar todos os pilares.",
          variant: "destructive",
        });
      }
      navigate("/planos");
      return;
    }
    navigate(`/recording?area=${area}`);
  };

  const areas = [
    {
      title: "Mãe",
      description: "Bloqueios na relação materna",
      icon: <Heart className="h-5 w-5" />,
      iconColor: "bg-axio-relationship/20 text-axio-relationship",
      isPremium: false,
      isLocked: !isPremium && freeDiagnosisUsed,
      badge: isPremium ? undefined : freeDiagnosisUsed ? "Já utilizado" : "Gratuito",
      onClick: handleFreeArea,
    },
    {
      title: "Pai",
      description: "Força paterna e ação no mundo",
      icon: <UserCheck className="h-5 w-5" />,
      iconColor: "bg-primary/20 text-primary",
      isPremium: !isPremium,
      isLocked: !isPremium,
      onClick: () => handlePremiumArea("pai"),
    },
    {
      title: "Traumas",
      description: "Perdas, abusos e eventos externos",
      icon: <Flame className="h-5 w-5" />,
      iconColor: "bg-axio-family/20 text-axio-family",
      isPremium: !isPremium,
      isLocked: !isPremium,
      onClick: () => handlePremiumArea("traumas"),
    },
    {
      title: "Relacionamentos",
      description: "Projeções dos seus traumas nas pessoas",
      icon: <HeartHandshake className="h-5 w-5" />,
      iconColor: "bg-axio-relationship/20 text-axio-relationship",
      isPremium: !isPremium,
      isLocked: !isPremium,
      onClick: () => handlePremiumArea("relacionamento"),
    },
  ];

  return (
    <div className="min-h-screen bg-background noise">
      {/* Top Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span className="text-gradient-cyan font-bold text-lg">A.X.I.O.</span>
          <UserMenu />
        </div>
      </nav>

      {/* Hero Section with Neural Waves */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 w-full">
          <img
            src={neuralWavesCyan}
            alt="Neural waves"
            className="w-full h-[400px] object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
          <OnboardingBanner />
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight px-2">
              <span className="text-foreground">Bem-vindo ao </span>
              <span className="text-gradient-cyan">A.X.I.O.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto mb-8 leading-relaxed px-2">
              Sistema de Biofeedback Quântico para reprogramação de padrões limitantes. 
              Descubra a raiz dos seus bloqueios e cure sua linhagem.
            </p>

            <Button 
              variant="cyan" 
              size="xl" 
              className="group"
              onClick={handleFreeArea}
            >
              <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
              {isPremium ? "Iniciar Diagnóstico" : freeDiagnosisUsed ? "Assinar Plano Premium" : "Iniciar Diagnóstico Gratuito"}
            </Button>

          </div>
        </div>
      </div>

      {/* Main Content - Cards over Cosmic Image */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Os 4 Pilares da Crença</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            O método A.X.I.O. investiga as 4 raízes inconscientes que moldam seus padrões de vida: Mãe, Pai, Traumas e Relacionamentos. Através da análise vocal, identificamos os bloqueios emocionais de origem e geramos comandos quânticos personalizados para reprogramar sua linhagem.
          </p>
        </div>

        <div className="max-w-lg mx-auto flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {areas.map((area) => (
                <AreaCard
                  key={area.title}
                  title={area.title}
                  description={area.description}
                  icon={area.icon}
                  iconColor={area.iconColor}
                  isPremium={area.isPremium}
                  isLocked={area.isLocked}
                  badge={area.badge}
                  onClick={area.onClick}
                  compact
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {/* Comunidade Card */}
              <div
                className={`flex-1 group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.15)] transition-all duration-300 cursor-pointer p-5 flex items-start gap-3 ${!isPremium ? 'opacity-80' : ''}`}
                onClick={() => isPremium ? navigate("/community") : navigate("/planos")}
              >
                {!isPremium && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 z-20">
                    <Lock className="h-2.5 w-2.5 text-primary-foreground" />
                    <span className="text-[10px] font-semibold text-primary-foreground">Premium</span>
                  </div>
                )}
                <div className="flex items-center justify-center rounded-xl bg-primary/20 text-primary h-12 w-12 shrink-0">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-foreground text-xl leading-tight">Comunidade</h3>
                  <p className="text-sm text-muted-foreground">Relatos de transformação</p>
                </div>
                <span className="absolute text-2xl opacity-25 animate-bounce" style={{ right: '8%', bottom: '8%', animationDuration: '3s' }}>💬</span>
                <span className="absolute text-xl opacity-20 animate-bounce" style={{ right: '22%', bottom: '18%', animationDuration: '4s', animationDelay: '1s' }}>🗨️</span>
                <span className="absolute text-2xl opacity-20 animate-bounce" style={{ right: '5%', bottom: '28%', animationDuration: '3.5s', animationDelay: '0.5s' }}>💬</span>
              </div>

              {/* Meditação Card */}
              <div
                className={`flex-1 group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.15)] transition-all duration-300 cursor-pointer p-5 flex items-start gap-3 ${!isPremium ? 'opacity-80' : ''}`}
                onClick={() => isPremium ? navigate("/meditation-structure") : navigate("/planos")}
              >
                {!isPremium && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 z-20">
                    <Lock className="h-2.5 w-2.5 text-primary-foreground" />
                    <span className="text-[10px] font-semibold text-primary-foreground">Premium</span>
                  </div>
                )}
                <div className="flex items-center justify-center rounded-xl bg-primary/20 text-primary h-12 w-12 shrink-0">
                  <Moon className="h-6 w-6" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-foreground text-xl leading-tight">Entenda a Meditação A.X.I.O.</h3>
                  <p className="text-sm text-muted-foreground">5 etapas da reprogramação</p>
                </div>
                <span className="absolute text-2xl opacity-25 animate-bounce" style={{ right: '8%', bottom: '8%', animationDuration: '3s' }}>🪷</span>
                <span className="absolute text-xl opacity-20 animate-bounce" style={{ right: '22%', bottom: '18%', animationDuration: '4.5s', animationDelay: '1.5s' }}>🧘</span>
                <span className="absolute text-2xl opacity-20 animate-bounce" style={{ right: '5%', bottom: '28%', animationDuration: '3.5s', animationDelay: '0.5s' }}>🪷</span>
              </div>
        </div>

        {/* Oráculo Card */}
        <div
          className={`group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.15)] transition-all duration-300 cursor-pointer p-5 flex items-start gap-3 ${!isPremium ? 'opacity-80' : ''}`}
          onClick={() => isPremium ? navigate("/oraculo") : navigate("/planos")}
        >
          {!isPremium && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 z-20">
              <Lock className="h-2.5 w-2.5 text-primary-foreground" />
              <span className="text-[10px] font-semibold text-primary-foreground">Premium</span>
            </div>
          )}
          <div className="flex items-center justify-center rounded-xl bg-primary/20 text-primary h-12 w-12 shrink-0">
            <Eye className="h-6 w-6" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-foreground text-xl leading-tight">Oráculo A.X.I.O.</h3>
            <p className="text-sm text-muted-foreground">Tire dúvidas sobre crenças e comportamento</p>
          </div>
          <span className="absolute text-2xl opacity-25 animate-bounce" style={{ right: '8%', bottom: '8%', animationDuration: '3s' }}>🔮</span>
          <span className="absolute text-xl opacity-20 animate-bounce" style={{ right: '22%', bottom: '18%', animationDuration: '4s', animationDelay: '1s' }}>✨</span>
          <span className="absolute text-2xl opacity-20 animate-bounce" style={{ right: '5%', bottom: '28%', animationDuration: '3.5s', animationDelay: '0.5s' }}>👁️</span>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gradient-cyan font-semibold text-lg mb-2">A.X.I.O.</p>
          <p className="text-sm text-muted-foreground">
            Análise do Fator X do Inconsciente de Origem
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © 2025 A.X.I.O. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
