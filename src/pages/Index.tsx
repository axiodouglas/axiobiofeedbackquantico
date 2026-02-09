import { Heart, UserCheck, Flame, Sparkles, Mic, Lock, Brain, MessageSquare, FileText, Moon, HeartHandshake } from "lucide-react";
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
      description: "Descubra a raiz dos seus bloqueios na relação com a Mãe.",
      icon: <Heart className="h-7 w-7" />,
      iconColor: "bg-axio-relationship/20 text-axio-relationship",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=mae"),
    },
    {
      title: "Pai",
      description: "Desbloqueie a força paterna e sua capacidade de agir no mundo.",
      icon: <UserCheck className="h-7 w-7" />,
      iconColor: "bg-primary/20 text-primary",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=pai"),
    },
    {
      title: "Traumas",
      description: "Bullying, acidentes, perdas e abusos externos à família.",
      icon: <Flame className="h-7 w-7" />,
      iconColor: "bg-axio-family/20 text-axio-family",
      isPremium: false,
      isLocked: false,
      badge: "Gratuito",
      onClick: () => navigate("/recording?area=traumas"),
    },
    {
      title: "Relacionamentos",
      description: "Descubra as projeções de Pai e Mãe no seu parceiro.",
      icon: <HeartHandshake className="h-7 w-7" />,
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

        <div className="relative z-10 container mx-auto px-4 pt-10 pb-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Biofeedback Quântico</span>
            </div>
            <div className="mb-8">
              <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary/80 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                Acesso Premium Liberado
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-foreground">Bem-vindo ao </span>
              <span className="text-gradient-cyan">A.X.I.O.</span>
            </h1>
            
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Os 4 Pilares do Diagnóstico</h2>
          <p className="text-muted-foreground">Mãe, Pai, Traumas e Relacionamentos — as sementes de todos os bloqueios</p>
        </div>

        {/* Cards Grid 2x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
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
          {/* Community Card */}
          <AreaCard
            title="Comunidade de Elevação de Frequência"
            description="Relatos reais de transformação para elevar sua frequência"
            icon={<MessageSquare className="h-7 w-7" />}
            iconColor="bg-primary/20 text-primary"
            isPremium={false}
            isLocked={false}
            badge="Gratuito"
            onClick={() => navigate("/community")}
          />
          {/* Estrutura da Meditação Card */}
          <AreaCard
            title="Estrutura da Meditação A.X.I.O."
            description="Conheça as 5 etapas da reprogramação quântica e o poder da sua própria voz"
            icon={<Moon className="h-7 w-7" />}
            iconColor="bg-primary/20 text-primary"
            isPremium={false}
            isLocked={false}
            badge="Método"
            onClick={() => navigate("/meditation-structure")}
          />
        </div>

        {/* Como Funciona - Inline */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">O Método</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Como Funciona o <span className="text-gradient-cyan">A.X.I.O.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Entenda cada etapa do processo de reprogramação quântica do seu inconsciente de origem.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Gravação */}
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">1. Gravação do Áudio</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Você escolhe qual pilar deseja trabalhar — <strong className="text-foreground">Mãe</strong>, <strong className="text-foreground">Pai</strong> ou <strong className="text-foreground">Traumas</strong> — 
                e grava um áudio de 2 minutos contando sua história. A inteligência do A.X.I.O. analisa seu relato 
                para localizar as crenças limitantes que estão travando suas 3 áreas da vida: 
                <strong className="text-foreground"> Relacionamento</strong>, <strong className="text-foreground">Saúde</strong> e <strong className="text-foreground">Financeiro</strong>.
              </p>
            </div>

            {/* 2. Relatório */}
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">2. Relatório Semanal e Comandos Quânticos</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
                Após a análise, o A.X.I.O. entrega um relatório semanal completo para acompanhamento 
                da sua evolução, junto com <strong className="text-foreground">Comandos Quânticos</strong> personalizados.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Os Comandos são frases de reprogramação pensadas e estudadas para agir diretamente 
                dentro do subconsciente do cliente, utilizando técnicas avançadas de 
                <strong className="text-foreground"> PNL</strong>, <strong className="text-foreground">Neurociência</strong> e 
                <strong className="text-foreground"> Física Quântica</strong>.
              </p>
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
