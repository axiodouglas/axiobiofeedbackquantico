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
          <h2 className="text-2xl font-bold text-foreground mb-2">Os 3 Pilares do Diagnóstico</h2>
          <p className="text-muted-foreground">Mãe, Pai e Traumas — as sementes de todos os bloqueios</p>
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

            {/* 3. Meditação */}
            <div className="bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary/40 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Moon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">3. A Meditação com Sua Própria Voz</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
                Esta é a inovação criada pelo fundador do A.X.I.O.:
              </p>
              <div className="bg-secondary/30 rounded-xl p-5 mb-6 max-w-xl mx-auto">
                <p className="text-foreground font-medium leading-relaxed">
               Você grava a meditação com comandos quânticos <strong>com a sua própria voz</strong>. 
                   Isso burla as defesas do cérebro — o fator crítico da mente — porque 
                   o subconsciente aceita muito mais facilmente a própria voz do que uma voz estranha.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
                A meditação é montada para ser ouvida à noite, enquanto você dorme, reprogramando 
                sua mente durante o estado de maior receptividade do subconsciente.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Enquanto meditações tradicionais usam vozes de terceiros (que o cérebro filtra e resiste), 
                o método A.X.I.O. utiliza o reconhecimento vocal nativo do sistema límbico para 
                acelerar a ressignificação em até 3x mais rápido.
              </p>
              <p className="text-sm text-primary font-semibold mt-6">
                "A mente não discute consigo mesma — ela obedece."
              </p>
            </div>

            {/* 4. Estrutura da Meditação A.X.I.O. */}
            <div className="bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary/30 rounded-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-6 text-center">4. Estrutura da Meditação A.X.I.O.</h3>
              
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="bg-secondary/30 border border-border rounded-xl p-4">
                  <h4 className="text-sm font-bold text-foreground mb-1">1. Acesso ao Subconsciente</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Serve para acalmar a mente e baixar a guarda do subconsciente. É o contato com o lugar onde tudo está guardado: medos, sonhos e traumas. Sem isso, a mente racional bloqueia o acesso à cura.
                  </p>
                </div>

                <div className="bg-secondary/30 border border-border rounded-xl p-4">
                  <h4 className="text-sm font-bold text-foreground mb-1">2. Validação Somática e Reconhecimento</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reconhecer e validar as dores e traumas sem julgamentos. É olhar para a ferida e dar lugar a ela, o que permite soltar a energia que prende esses sentimentos no corpo.
                  </p>
                </div>

                <div className="bg-secondary/30 border border-border rounded-xl p-4">
                  <h4 className="text-sm font-bold text-foreground mb-1">3. Desassociação</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Processo de libertação onde você comunica ao seu ser que aquela dor não é sua e esse sentimento não te pertence mais. É o corte das dependências físicas, emocionais e energéticas.
                  </p>
                </div>

                <div className="bg-secondary/30 border border-border rounded-xl p-4">
                  <h4 className="text-sm font-bold text-foreground mb-1">4. Instalação de Novas Crenças</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Momento de implantar o oposto de tudo o que foi desassociado, ocupando o espaço com novas verdades de segurança e prosperidade.
                  </p>
                </div>

                <div className="bg-secondary/30 border border-border rounded-xl p-4">
                  <h4 className="text-sm font-bold text-foreground mb-1">5. Gratidão Sistêmica</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Agradecimento profundo ao corpo, órgãos e células para selar a cura no físico.
                  </p>
                </div>

                {/* Gravar com a própria voz */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-primary mb-1 flex items-center gap-1.5">
                    <Mic className="h-4 w-4" />
                    Gravar com a Própria Voz
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    É expressamente necessário gravar com a própria voz. O nosso corpo reconhece nossa própria voz como autoridade máxima, e isso é a parte principal do processo para conseguir burlar o subconsciente e o fator crítico da mente.
                  </p>
                </div>

                {/* Escrita Manual */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-primary mb-1 flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    Escrita Manual
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Redigir a meditação em uma folha é parte vital da limpeza emocional, fortalecendo o córtex pré-frontal para organizar o processo de cura.
                  </p>
                </div>
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
