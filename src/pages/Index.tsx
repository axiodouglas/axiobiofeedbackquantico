import { DollarSign, Heart, Dna, Users, Sparkles, Mic, Brain, AlertTriangle, UserCheck, MessageSquare, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaCard } from "@/components/AreaCard";
import { EvolutionChart } from "@/components/EvolutionChart";
import { HawkinsScale } from "@/components/HawkinsScale";
import { useNavigate } from "react-router-dom";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";

const Index = () => {
  const navigate = useNavigate();

  const areas = [
    {
      title: "Pai",
      description: "Descubra os bloqueios relacionados ao Pai.",
      icon: <UserCheck className="h-7 w-7" />,
      iconColor: "bg-primary/20 text-primary",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=pai"),
    },
    {
      title: "Mãe",
      description: "Descubra os bloqueios relacionados à Mãe.",
      icon: <Heart className="h-7 w-7" />,
      iconColor: "bg-axio-relationship/20 text-axio-relationship",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=mae"),
    },
    {
      title: "Ansiedade",
      description: "Descubra os bloqueios relacionados à Ansiedade.",
      icon: <Brain className="h-7 w-7" />,
      iconColor: "bg-axio-health/20 text-axio-health",
      isPremium: true,
      isLocked: false,
      onClick: () => navigate("/recording?area=ansiedade"),
    },
    {
      title: "Medo",
      description: "Descubra os bloqueios relacionados ao Medo.",
      icon: <AlertTriangle className="h-7 w-7" />,
      iconColor: "bg-axio-family/20 text-axio-family",
      isPremium: true,
      isLocked: false,
      onClick: () => navigate("/recording?area=medo"),
    },
    {
      title: "Financeiro",
      description: "Descubra os bloqueios relacionados ao Financeiro.",
      icon: <DollarSign className="h-7 w-7" />,
      iconColor: "bg-primary/20 text-primary",
      isPremium: true,
      isLocked: false,
      onClick: () => navigate("/recording?area=financeiro"),
    },
    {
      title: "Saúde",
      description: "Descubra os bloqueios relacionados à Saúde.",
      icon: <Dna className="h-7 w-7" />,
      iconColor: "bg-axio-health/20 text-axio-health",
      isPremium: true,
      isLocked: false,
      onClick: () => navigate("/recording?area=saude"),
    },
    {
      title: "Relacionamento",
      description: "Descubra os bloqueios relacionados ao Relacionamento.",
      icon: <Users className="h-7 w-7" />,
      iconColor: "bg-axio-relationship/20 text-axio-relationship",
      isPremium: true,
      isLocked: false,
      onClick: () => navigate("/recording?area=relacionamento"),
    },
  ];

  return (
    <div className="min-h-screen bg-background noise">
      {/* Hero Section with Neural Waves */}
      <div className="relative overflow-hidden">
        {/* Neural waves background */}
        <div className="absolute inset-0 w-full">
          <img
            src={neuralWavesCyan}
            alt="Neural waves"
            className="w-full h-[400px] object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-6 pb-12">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo/Title */}
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Biofeedback Quântico</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-foreground">Bem-vindo ao </span>
              <span className="text-gradient-cyan">A.X.I.O.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8 leading-relaxed">
              Sistema de Biofeedback Quântico para reprogramação de padrões limitantes. 
              Analise sua frequência vibracional e eleve sua consciência.
            </p>

            {/* CTA Button */}
            <Button 
              variant="cyan" 
              size="xl" 
              className="group"
              onClick={() => navigate("/area-selection")}
            >
              <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
              Iniciar Diagnóstico Gratuito
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">
              Escolha entre Pai ou Mãe para começar
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Áreas de Diagnóstico</h2>
          <p className="text-muted-foreground">Escolha uma área para iniciar sua análise de frequência</p>
        </div>

        {/* Cards Grid - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
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
            />
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evolution Chart */}
          <div className="lg:col-span-2">
            <EvolutionChart />
          </div>

          {/* Hawkins Scale */}
          <div className="lg:col-span-1">
            <HawkinsScale currentLevel={310} />
          </div>
        </div>

        {/* Community Card */}
        <div className="mt-12 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-8 cursor-pointer hover:border-primary/50 transition-all" onClick={() => navigate("/community")}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                Comunidade de Elevação de Frequência
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  <Lock className="h-2.5 w-2.5" />
                  Premium
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Relatos reais de transformação para elevar sua frequência
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Leia histórias de sucesso de pessoas que transformaram suas vidas com o A.X.I.O. 
            Assinantes Premium podem compartilhar seus próprios relatos e inspirar a comunidade 
            nas áreas de Saúde, Financeiro, Relacionamento e Conquistas.
          </p>
        </div>

        {/* Premium CTA */}
        <div className="mt-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Desbloqueie Todas as Áreas
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Acesse diagnósticos completos, comandos de reprogramação quântica 
            e a comunidade de elevação de frequência.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="rounded-xl border border-border bg-card px-6 py-4 min-w-[140px] cursor-pointer hover:border-primary/30 transition-all" onClick={() => navigate("/checkout")}>
              <div className="text-sm text-muted-foreground mb-1">Mensal</div>
              <div className="text-2xl font-bold text-foreground">R$ 29,90</div>
              <div className="text-xs text-muted-foreground">/mês</div>
            </div>
            <div className="rounded-xl border border-border bg-card px-6 py-4 min-w-[140px] cursor-pointer hover:border-primary/30 transition-all" onClick={() => navigate("/checkout")}>
              <div className="text-sm text-muted-foreground mb-1">Trimestral</div>
              <div className="text-2xl font-bold text-foreground">R$ 24,99</div>
              <div className="text-xs text-muted-foreground">/mês</div>
              <div className="text-[10px] text-destructive font-bold mt-1">17% OFF</div>
            </div>
            <div className="rounded-xl border-2 border-primary bg-card px-6 py-4 min-w-[140px] relative cursor-pointer hover:shadow-[0_0_20px_hsl(175,70%,50%,0.2)] transition-all" onClick={() => navigate("/checkout")}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                Popular
              </div>
              <div className="text-sm text-muted-foreground mb-1">Semestral</div>
              <div className="text-2xl font-bold text-primary">R$ 19,99</div>
              <div className="text-xs text-muted-foreground">/mês</div>
              <div className="text-[10px] text-destructive font-bold mt-1">33% OFF</div>
            </div>
          </div>

          <Button variant="premium" size="lg" onClick={() => navigate("/checkout")}>
            <Sparkles className="h-5 w-5" />
            Desbloquear Premium
          </Button>
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
