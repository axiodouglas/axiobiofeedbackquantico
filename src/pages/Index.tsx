import { useState, useEffect } from "react";
import { Heart, UserCheck, Flame, Mic, Brain, MessageSquare, Moon, HeartHandshake, Eye, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaCard } from "@/components/AreaCard";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useFreeDiagnosisUsed } from "@/hooks/use-free-diagnosis";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";
import axioIcon from "@/assets/axio-icon.png";
import OnboardingBanner from "@/components/OnboardingBanner";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  // Force profile refresh on every app open
  useEffect(() => {
    if (user) refreshProfile();
  }, [user]);
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
      <nav className="absolute top-0 left-0 right-0 z-20 py-3 bg-black/80 backdrop-blur-md border-b border-primary/5">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3" style={{ background: "transparent" }}>
            <img
              src={axioIcon}
              alt="A.X.I.O."
              className="h-[48px] w-auto object-contain shrink-0"
              style={{
                background: "transparent",
                border: "none",
                boxShadow: "none",
                mixBlendMode: "screen",
                filter: "brightness(1.3) contrast(1.1)",
              }}
              draggable={false}
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm sm:text-base font-bold tracking-widest text-white">
                <span className="text-primary">A.</span>X.I.O.
              </span>
            </div>
          </div>
          <UserMenu />
        </div>
      </nav>

      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 w-full">
          <img
            src={neuralWavesCyan}
            alt="Neural waves"
            className="w-full h-[480px] object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-5 sm:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20">
          <OnboardingBanner />
          <div className="max-w-3xl mx-auto text-center bg-card/30 backdrop-blur-[10px] border border-white/[0.08] rounded-2xl px-6 py-10 sm:px-10 sm:py-14 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight px-2">
              <span className="text-foreground">Bem-vindo ao </span>
              <span className="text-gradient-cyan">A.X.I.O.</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium tracking-wider mb-5">
              Análise do Fator X do Inconsciente de Origem
            </p>

            <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed px-2">
              Sistema de Biofeedback Quântico para reprogramação de padrões limitantes. 
              Descubra a raiz dos seus bloqueios e cure sua linhagem.
            </p>

            {!isPremium && !freeDiagnosisUsed && (
              <Button 
                variant="cyan" 
                size="lg" 
                className="group transition-transform duration-200 hover:scale-[1.03] max-w-xs w-full"
                onClick={handleFreeArea}
              >
                <Mic className="h-4 w-4 transition-transform group-hover:scale-110" />
                Iniciar Diagnóstico Gratuito
              </Button>
            )}
            {!isPremium && freeDiagnosisUsed && (
              <Button 
                variant="cyan" 
                size="lg" 
                className="group transition-transform duration-200 hover:scale-[1.03] max-w-xs w-full"
                onClick={() => navigate("/planos")}
              >
                <Crown className="h-4 w-4 transition-transform group-hover:scale-110" />
                Adquirir Premium
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-5 sm:px-8 py-14 sm:py-16">
        {/* Quantum Wave Decoration */}
        <div className="relative mb-6 flex justify-center">
          <svg viewBox="0 0 400 60" className="w-full max-w-md h-auto opacity-40" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(175,70%,50%)" stopOpacity="0" />
                <stop offset="30%" stopColor="hsl(175,70%,50%)" stopOpacity="0.6" />
                <stop offset="50%" stopColor="hsl(185,75%,55%)" stopOpacity="0.8" />
                <stop offset="70%" stopColor="hsl(175,70%,50%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(175,70%,50%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30" fill="none" stroke="url(#waveGrad)" strokeWidth="1.5">
              <animate attributeName="d" dur="4s" repeatCount="indefinite" values="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30;M0,30 Q50,50 100,30 T200,30 T300,30 T400,30;M0,30 Q50,10 100,30 T200,30 T300,30 T400,30" />
            </path>
            <path d="M0,30 Q50,50 100,30 T200,30 T300,30 T400,30" fill="none" stroke="url(#waveGrad)" strokeWidth="1" opacity="0.5">
              <animate attributeName="d" dur="5s" repeatCount="indefinite" values="M0,30 Q50,50 100,30 T200,30 T300,30 T400,30;M0,30 Q50,10 100,30 T200,30 T300,30 T400,30;M0,30 Q50,50 100,30 T200,30 T300,30 T400,30" />
            </path>
            <circle cx="200" cy="30" r="3" fill="hsl(175,70%,50%)" opacity="0.6">
              <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="0.3;0.8;0.3" />
            </circle>
          </svg>
        </div>

        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Os 4 Pilares da Crença</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            O método A.X.I.O. investiga as 4 raízes inconscientes que moldam seus padrões de vida: Mãe, Pai, Traumas e Relacionamentos. Através da análise vocal, identificamos os bloqueios emocionais de origem e geramos comandos quânticos personalizados para reprogramar sua linhagem.
          </p>
        </div>

        <div className="max-w-lg mx-auto flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex flex-col gap-4 flex-1">
            {/* Comunidade Card */}
            <div
              className={`flex-1 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/30 hover:shadow-[0_4px_30px_hsl(175,70%,50%,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer p-6 flex items-start gap-4 ${!isPremium ? 'opacity-80' : ''}`}
              onClick={() => isPremium ? navigate("/community") : navigate("/planos")}
            >
              {!isPremium && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 z-20">
                  <Lock className="h-2.5 w-2.5 text-primary-foreground" />
                  <span className="text-[10px] font-semibold text-primary-foreground">Premium</span>
                </div>
              )}
              <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-12 w-12 shrink-0">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-foreground text-xl leading-tight">Comunidade</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Relatos de transformação</p>
              </div>
            </div>

            {/* Meditação Card */}
            <div
              className={`flex-1 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/30 hover:shadow-[0_4px_30px_hsl(175,70%,50%,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer p-6 flex items-start gap-4 ${!isPremium ? 'opacity-80' : ''}`}
              onClick={() => isPremium ? navigate("/meditation-structure") : navigate("/planos")}
            >
              {!isPremium && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 z-20">
                  <Lock className="h-2.5 w-2.5 text-primary-foreground" />
                  <span className="text-[10px] font-semibold text-primary-foreground">Premium</span>
                </div>
              )}
              <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-12 w-12 shrink-0">
                <Moon className="h-6 w-6" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-foreground text-xl leading-tight">Entenda a Meditação A.X.I.O.</h3>
                <p className="text-sm text-muted-foreground mt-0.5">5 etapas da reprogramação</p>
              </div>
            </div>
          </div>

          {/* Oráculo Card */}
          <div
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/30 hover:shadow-[0_4px_30px_hsl(175,70%,50%,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer p-6 flex items-start gap-4 ${!isPremium ? 'opacity-80' : ''}`}
            onClick={() => isPremium ? navigate("/oraculo") : navigate("/planos")}
          >
            {!isPremium && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 z-20">
                <Lock className="h-2.5 w-2.5 text-primary-foreground" />
                <span className="text-[10px] font-semibold text-primary-foreground">Premium</span>
              </div>
            )}
            <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-12 w-12 shrink-0">
              <Eye className="h-6 w-6" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-foreground text-xl leading-tight">Oráculo A.X.I.O.</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Tire dúvidas sobre crenças e comportamento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-card/30 backdrop-blur-sm py-10 mt-16">
        <div className="container mx-auto px-5 sm:px-8 text-center">
          <p className="text-gradient-cyan font-semibold text-lg mb-2">A.X.I.O.</p>
          <p className="text-sm text-muted-foreground">
            Análise do Fator X do Inconsciente de Origem
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © 2026 A.X.I.O. Todos os direitos reservados. Marca e Método em processo de registro.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
