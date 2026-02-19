import { useState, useEffect } from "react";
import { Brain, Mic, MessageSquare, Moon, Eye, Lock, Crown, Sparkles, BarChart3, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useFreeDiagnosisUsed } from "@/hooks/use-free-diagnosis";
import { useAreaLock } from "@/hooks/use-area-lock";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";
import axioLogoX from "@/assets/axio-logo-x.png";


const Index = () => {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile } = useAuth();

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
  const isFullAccess = isAdmin || (isPremium && (profile?.subscription_type === "trimestral" || profile?.subscription_type === "semestral"));

  const { lockedAreas } = useAreaLock(user?.id, isAdmin);
  const isLocked = lockedAreas["crencas_limitantes"]?.locked;
  const daysRemaining = lockedAreas["crencas_limitantes"]?.daysRemaining;

  const handleDiagnosis = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isLocked) {
      toast({
        title: "Protocolo ativo",
        description: `Aguarde ${daysRemaining} dia(s) para realizar um novo diagnóstico. Foque na sua meditação atual.`,
        variant: "destructive",
      });
      return;
    }
    if (!isPremium && freeDiagnosisUsed) {
      toast({
        title: "Diagnóstico cortesia já utilizado",
        description: "Você já utilizou seu diagnóstico gratuito. Assine um plano para continuar.",
        variant: "destructive",
      });
      navigate("/planos");
      return;
    }
    navigate("/recording?area=crencas_limitantes");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise">
      {/* Top Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 py-3 bg-black/80 backdrop-blur-md border-b border-primary/5">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={axioLogoX}
              alt="A.X.I.O."
              className="h-[42px] w-auto object-contain shrink-0"
              draggable={false}
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm sm:text-base font-bold tracking-widest text-gradient-brand">
                A.X.I.O.
              </span>
            </div>
          </div>
          <UserMenu />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 w-full">
          <img
            src={neuralWavesCyan}
            alt="Neural waves"
            className="w-full h-[700px] sm:h-[600px] object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-5 sm:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center bg-card/30 backdrop-blur-[10px] border border-white/[0.08] rounded-2xl px-6 py-10 sm:px-10 sm:py-14 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight px-2">
              <span className="text-foreground">Bem-vindo ao </span>
              <span className="text-gradient-brand">A.X.I.O.</span>
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
                onClick={handleDiagnosis}
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
        <div className="relative mb-8 flex justify-center">
          <svg viewBox="0 0 600 120" className="w-full max-w-3xl h-24 sm:h-32" preserveAspectRatio="xMidYMid meet" style={{ filter: 'drop-shadow(0 0 8px hsl(175,70%,50%,0.5)) drop-shadow(0 0 20px hsl(260,60%,65%,0.3))' }}>
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(160,80%,65%)" stopOpacity="0.1" />
                <stop offset="20%" stopColor="hsl(175,70%,55%)" stopOpacity="0.9" />
                <stop offset="50%" stopColor="hsl(220,70%,65%)" stopOpacity="1" />
                <stop offset="80%" stopColor="hsl(260,65%,70%)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="hsl(260,60%,65%)" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(260,65%,70%)" stopOpacity="0.1" />
                <stop offset="25%" stopColor="hsl(260,65%,70%)" stopOpacity="0.8" />
                <stop offset="55%" stopColor="hsl(175,75%,55%)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="hsl(175,70%,50%)" stopOpacity="0.1" />
              </linearGradient>
              <filter id="waveGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d="M0,60 Q75,20 150,60 T300,60 T450,60 T600,60" fill="none" stroke="url(#waveGrad)" strokeWidth="2.5" filter="url(#waveGlow)">
              <animate attributeName="d" dur="4s" repeatCount="indefinite" values="M0,60 Q75,20 150,60 T300,60 T450,60 T600,60;M0,60 Q75,100 150,60 T300,60 T450,60 T600,60;M0,60 Q75,20 150,60 T300,60 T450,60 T600,60" />
            </path>
            <path d="M0,60 Q75,100 150,60 T300,60 T450,60 T600,60" fill="none" stroke="url(#waveGrad2)" strokeWidth="2" filter="url(#waveGlow)">
              <animate attributeName="d" dur="5s" repeatCount="indefinite" values="M0,60 Q75,100 150,60 T300,60 T450,60 T600,60;M0,60 Q75,20 150,60 T300,60 T450,60 T600,60;M0,60 Q75,100 150,60 T300,60 T450,60 T600,60" />
            </path>
            <circle cx="300" cy="60" r="6" fill="hsl(175,70%,55%)" opacity="0.8" filter="url(#waveGlow)">
              <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="0.5;1;0.5" />
              <animate attributeName="r" dur="3s" repeatCount="indefinite" values="4;7;4" />
            </circle>
            <circle cx="300" cy="60" r="18" fill="none" stroke="hsl(175,70%,55%)" strokeWidth="0.8" opacity="0.4">
              <animate attributeName="r" dur="4s" repeatCount="indefinite" values="14;24;14" />
              <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.25;0.5;0.25" />
            </circle>
          </svg>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3 sm:gap-4">
          {/* Crenças Limitantes - Central Card */}
          <div
            className="col-span-2 group relative overflow-hidden rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300 p-4 sm:p-6"
          >
            {isLocked && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 z-20">
                <Clock className="h-2.5 w-2.5 text-primary" />
                <span className="text-[10px] font-semibold text-primary">{daysRemaining} dias</span>
              </div>
            )}
            {!isPremium && freeDiagnosisUsed && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-[hsl(175,70%,50%)] to-[hsl(260,60%,65%)] px-2 py-0.5 z-20">
                <Lock className="h-2.5 w-2.5 text-[hsl(220,15%,4%)]" />
                <span className="text-[10px] font-semibold text-[hsl(220,15%,4%)]">Premium</span>
              </div>
            )}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-12 w-12 sm:h-14 sm:w-14 shrink-0">
                <Brain className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base sm:text-xl leading-tight">Crenças Limitantes</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Diagnóstico completo: Mãe, Pai, Traumas e Relacionamentos em uma única análise
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="cyan"
                size="sm"
                className="flex-1 text-xs sm:text-sm"
                onClick={handleDiagnosis}
                disabled={isLocked}
              >
                <Mic className="h-3.5 w-3.5" />
                {isLocked ? `Aguarde ${daysRemaining}d` : !isPremium && !freeDiagnosisUsed ? "Análise Gratuita" : "Novo Diagnóstico"}
              </Button>
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => navigate("/meus-relatorios")}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Ver Relatórios
                </Button>
              )}
            </div>
          </div>

          {/* Comunidade Card */}
          <div
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/30 hover:shadow-[0_4px_30px_hsl(175,70%,50%,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer p-4 sm:p-6 flex flex-col items-start gap-2.5 sm:flex-row sm:items-start sm:gap-4 ${!isPremium ? 'opacity-80' : ''}`}
            onClick={() => isPremium ? navigate("/community") : navigate("/planos")}
          >
            {!isPremium && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-[hsl(175,70%,50%)] to-[hsl(260,60%,65%)] px-2 py-0.5 z-20">
                <Lock className="h-2.5 w-2.5 text-[hsl(220,15%,4%)]" />
                <span className="text-[10px] font-semibold text-[hsl(220,15%,4%)]">Premium</span>
              </div>
            )}
            <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-10 w-10 sm:h-12 sm:w-12 shrink-0">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="relative z-10 min-w-0">
              <h3 className="font-bold text-foreground text-sm sm:text-xl leading-tight">Comunidade</h3>
              <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5">Relatos de transformação</p>
            </div>
          </div>

          {/* Meditação Card */}
          <div
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/30 hover:shadow-[0_4px_30px_hsl(175,70%,50%,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer p-4 sm:p-6 flex flex-col items-start gap-2.5 sm:flex-row sm:items-start sm:gap-4 ${!isPremium ? 'opacity-80' : ''}`}
            onClick={() => isPremium ? navigate("/meditation-structure") : navigate("/planos")}
          >
            {!isPremium && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-[hsl(175,70%,50%)] to-[hsl(260,60%,65%)] px-2 py-0.5 z-20">
                <Lock className="h-2.5 w-2.5 text-[hsl(220,15%,4%)]" />
                <span className="text-[10px] font-semibold text-[hsl(220,15%,4%)]">Premium</span>
              </div>
            )}
            <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-10 w-10 sm:h-12 sm:w-12 shrink-0">
              <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="relative z-10 min-w-0">
              <h3 className="font-bold text-foreground text-sm sm:text-xl leading-tight">Meditação A.X.I.O.</h3>
              <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5">5 etapas da reprogramação</p>
            </div>
          </div>

          {/* Oráculo Card - Trimestral+ */}
          <div
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/30 hover:shadow-[0_4px_30px_hsl(175,70%,50%,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer p-4 sm:p-6 flex flex-col items-start gap-2.5 sm:flex-row sm:items-start sm:gap-4 ${!isFullAccess ? 'opacity-80' : ''}`}
            onClick={() => isFullAccess ? navigate("/oraculo") : navigate("/planos")}
          >
            {!isFullAccess && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-[hsl(175,70%,50%)] to-[hsl(260,60%,65%)] px-2 py-0.5 z-20">
                <Lock className="h-2.5 w-2.5 text-[hsl(220,15%,4%)]" />
                <span className="text-[10px] font-semibold text-[hsl(220,15%,4%)]">Trimestral+</span>
              </div>
            )}
            <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-10 w-10 sm:h-12 sm:w-12 shrink-0">
              <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="relative z-10 min-w-0">
              <h3 className="font-bold text-foreground text-sm sm:text-xl leading-tight">Oráculo A.X.I.O.</h3>
              <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5">Dúvidas sobre crenças</p>
            </div>
          </div>

          {/* Conselheiro de Performance Card - Trimestral+ */}
          <div
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/30 hover:shadow-[0_4px_30px_hsl(175,70%,50%,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer p-4 sm:p-6 flex flex-col items-start gap-2.5 sm:flex-row sm:items-start sm:gap-4 ${!isFullAccess ? 'opacity-80' : ''}`}
            onClick={() => isFullAccess ? navigate("/conselheiro") : navigate("/planos")}
          >
            {!isFullAccess && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-[hsl(175,70%,50%)] to-[hsl(260,60%,65%)] px-2 py-0.5 z-20">
                <Lock className="h-2.5 w-2.5 text-[hsl(220,15%,4%)]" />
                <span className="text-[10px] font-semibold text-[hsl(220,15%,4%)]">Trimestral+</span>
              </div>
            )}
            <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-10 w-10 sm:h-12 sm:w-12 shrink-0">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="relative z-10 min-w-0">
              <h3 className="font-bold text-foreground text-sm sm:text-xl leading-tight">Conselheiro de Performance</h3>
              <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5">Análise vocal profissional</p>
            </div>
          </div>

          {/* Livros Indicados Card */}
          <div
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/30 hover:shadow-[0_4px_30px_hsl(175,70%,50%,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer p-4 sm:p-6 flex flex-col items-start gap-2.5 sm:flex-row sm:items-start sm:gap-4"
              onClick={() => navigate("/livros")}
            >
              <div className="flex items-center justify-center rounded-2xl bg-primary/20 text-primary h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="relative z-10 min-w-0">
                <h3 className="font-bold text-foreground text-sm sm:text-xl leading-tight">Livros Indicados</h3>
                <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5">Leituras para sua evolução</p>
              </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-card/30 backdrop-blur-sm py-10 mt-16">
        <div className="container mx-auto px-5 sm:px-8 text-center">
          <p className="text-gradient-brand font-semibold text-lg mb-2">A.X.I.O.</p>
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
