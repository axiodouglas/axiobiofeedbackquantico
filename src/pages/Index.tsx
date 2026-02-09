import { Heart, UserCheck, Flame, Sparkles, Mic, Lock, Brain, MessageSquare, FileText, Moon, HeartHandshake } from "lucide-react";
import quantumCosmos from "@/assets/quantum-cosmos.jpg";
import { Button } from "@/components/ui/button";
import { AreaCard } from "@/components/AreaCard";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";

const Index = () => {
  const navigate = useNavigate();

  const areas = [
    {
      title: "Mãe",
      description: "Bloqueios na relação materna",
      icon: <Heart className="h-5 w-5" />,
      iconColor: "bg-axio-relationship/20 text-axio-relationship",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=mae"),
    },
    {
      title: "Pai",
      description: "Força paterna e ação no mundo",
      icon: <UserCheck className="h-5 w-5" />,
      iconColor: "bg-primary/20 text-primary",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=pai"),
    },
    {
      title: "Traumas",
      description: "Perdas, abusos e eventos externos",
      icon: <Flame className="h-5 w-5" />,
      iconColor: "bg-axio-family/20 text-axio-family",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=traumas"),
    },
    {
      title: "Relacionamentos",
      description: "Projeções no parceiro",
      icon: <HeartHandshake className="h-5 w-5" />,
      iconColor: "bg-axio-relationship/20 text-axio-relationship",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=relacionamento"),
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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-foreground">Bem-vindo ao </span>
              <span className="text-gradient-cyan">A.X.I.O.</span>
            </h1>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[hsl(185,75%,40%)] px-5 py-2.5 shadow-[0_4px_15px_hsl(175,70%,50%,0.3)]">
              <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
              <span className="text-sm font-bold text-primary-foreground">Biofeedback Quântico</span>
            </div>
            
            <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8 leading-relaxed">
              Sistema de Biofeedback Quântico para reprogramação de padrões limitantes. 
              Descubra a raiz dos seus bloqueios e cure sua linhagem.
            </p>

            <Button 
              variant="cyan" 
              size="xl" 
              className="group"
              onClick={() => navigate("/recording?area=mae")}
            >
              <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
              Iniciar Diagnóstico Gratuito
            </Button>

          </div>
        </div>
      </div>

      {/* Main Content - Cards over Cosmic Image */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Os 4 Pilares do Diagnóstico</h2>
          <p className="text-muted-foreground">Mãe, Pai, Traumas e Relacionamentos — as sementes de todos os bloqueios</p>
        </div>

        <div className="relative max-w-lg mx-auto rounded-2xl overflow-hidden border border-border shadow-[0_0_30px_hsl(175,70%,50%,0.1)]">
          <img
            src={quantumCosmos}
            alt="Cosmos quântico"
            className="w-full h-auto min-h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col p-4 gap-3">
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
                className="flex-1 group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.15)] transition-all duration-300 cursor-pointer p-4 flex items-center gap-3"
                onClick={() => navigate("/community")}
              >
                <div className="flex items-center justify-center rounded-xl bg-primary/20 text-primary h-10 w-10 shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-foreground text-lg leading-tight">Comunidade</h3>
                  <p className="text-xs text-muted-foreground">Relatos de transformação</p>
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5">
                  <span className="text-[10px] font-semibold text-primary-foreground">Gratuito</span>
                </div>
                {/* Floating chat bubbles */}
                <span className="absolute text-lg opacity-20 animate-bounce" style={{ right: '15%', bottom: '10%', animationDuration: '3s', animationDelay: '0s' }}>💬</span>
                <span className="absolute text-sm opacity-15 animate-bounce" style={{ right: '35%', bottom: '5%', animationDuration: '4s', animationDelay: '1s' }}>🗨️</span>
                <span className="absolute text-base opacity-20 animate-bounce" style={{ right: '55%', bottom: '15%', animationDuration: '3.5s', animationDelay: '0.5s' }}>💬</span>
                <span className="absolute text-xs opacity-10 animate-bounce" style={{ right: '25%', bottom: '20%', animationDuration: '5s', animationDelay: '2s' }}>🗨️</span>
              </div>

              {/* Meditação Card */}
              <div
                className="flex-1 group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.15)] transition-all duration-300 cursor-pointer p-4 flex items-center gap-3"
                onClick={() => navigate("/meditation-structure")}
              >
                <div className="flex items-center justify-center rounded-xl bg-primary/20 text-primary h-10 w-10 shrink-0">
                  <Moon className="h-5 w-5" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-foreground text-lg leading-tight">Meditação</h3>
                  <p className="text-xs text-muted-foreground">5 etapas da reprogramação</p>
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5">
                  <span className="text-[10px] font-semibold text-primary-foreground">Método</span>
                </div>
                {/* Floating lotus & monks */}
                <span className="absolute text-lg opacity-20 animate-bounce" style={{ right: '15%', bottom: '10%', animationDuration: '3s', animationDelay: '0s' }}>🪷</span>
                <span className="absolute text-sm opacity-15 animate-bounce" style={{ right: '40%', bottom: '5%', animationDuration: '4.5s', animationDelay: '1.5s' }}>🧘</span>
                <span className="absolute text-base opacity-20 animate-bounce" style={{ right: '60%', bottom: '15%', animationDuration: '3.5s', animationDelay: '0.5s' }}>🪷</span>
                <span className="absolute text-xs opacity-10 animate-bounce" style={{ right: '25%', bottom: '20%', animationDuration: '5s', animationDelay: '2s' }}>🧘</span>
              </div>
            </div>
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
