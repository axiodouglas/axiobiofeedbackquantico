import { useNavigate } from "react-router-dom";
import { Crown, Check, Sparkles, Brain, Mic, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const sharedFeatures = [
  "Desbloqueio de todos os pilares (Pai, Traumas, Relacionamentos)",
  "Diagnósticos ilimitados",
  "Comandos Quânticos personalizados",
  "Meditação personalizada",
  "Acesso ao Oráculo AXIO",
  "Acesso à Comunidade AXIO",
  "Relatórios de evolução",
];

const plans = [
  { name: "Mensal", price: "29,90", period: "/mês", badge: null, highlight: false, features: sharedFeatures },
  { name: "Trimestral", price: "24,99", period: "/mês", badge: "16% OFF", highlight: false, features: [...sharedFeatures, "Economia de R$ 14,73 no trimestre"] },
  { name: "Semestral", price: "19,90", period: "/mês", badge: "33% OFF", highlight: true, features: [...sharedFeatures, "Economia de R$ 60 no semestre"] },
];

const benefits = [
  {
    icon: Mic,
    title: "Diagnóstico por Biofeedback de Áudio",
    description: "Sua voz carrega padrões emocionais invisíveis. Nossa IA analisa frequências, micro-hesitações e entonação para revelar traumas ocultos no subconsciente.",
  },
  {
    icon: Brain,
    title: "Meditações Personalizadas com sua Voz",
    description: "Reprograme crenças limitantes com meditações geradas a partir da SUA própria voz — a frequência que seu cérebro mais reconhece e aceita.",
  },
  {
    icon: MessageCircle,
    title: "Oráculo AXIO para Dúvidas Profundas",
    description: "Um conselheiro quântico treinado em PNL, Neurociência e Física Quântica para guiar você nas decisões mais difíceis da sua vida.",
  },
];

const VendaOficial = () => {
  const navigate = useNavigate();

  const scrollToPlans = () => {
    document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectPlan = (planName: string) => {
    toast({
      title: "Redirecionando para o Checkout Seguro...",
      description: `Você selecionou o plano ${planName}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background noise relative overflow-hidden">
      {/* Ambient nebula effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[60%] h-[50%] top-[5%] left-[-10%] rounded-full opacity-10 blur-[100px] bg-[radial-gradient(ellipse,hsl(175_70%_50%/0.6),transparent_70%)] animate-pulse-glow" />
        <div className="absolute w-[40%] h-[40%] bottom-[10%] right-[-5%] rounded-full opacity-10 blur-[100px] bg-[radial-gradient(ellipse,hsl(270_50%_55%/0.5),transparent_70%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide">MÉTODO A.X.I.O.</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground px-2">
            Reprograme seu Subconsciente com a{" "}
            <span className="text-gradient-cyan">Autoridade da sua própria Voz.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
            Conheça o Método AXIO: uma fusão de{" "}
            <span className="text-foreground font-medium">Neurociência, PNL e Física Quântica</span>{" "}
            para destravar traumas de Pai, Mãe e Relacionamentos enquanto você dorme.
          </p>

          <div className="pt-4 flex flex-col items-center gap-4">
            <Button
              variant="premium"
              size="xl"
              className="text-sm sm:text-base md:text-lg px-6 sm:px-10 py-5 sm:py-6 rounded-2xl animate-pulse-glow"
              onClick={scrollToPlans}
            >
              QUERO COMEÇAR MINHA TRANSFORMAÇÃO
            </Button>
            <button onClick={scrollToPlans} className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center gap-1 text-sm">
              Conheça os planos
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              O que o <span className="text-gradient-cyan">A.X.I.O.</span> faz por você
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Três pilares tecnológicos trabalhando juntos para reprogramar seu subconsciente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="card-glow rounded-2xl p-8 flex flex-col items-center text-center space-y-4 group hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:shadow-[0_0_25px_hsl(175,70%,50%,0.3)] transition-shadow">
                  <b.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground italic leading-snug px-2">
            "A voz é a impressão digital emocional. Quando você a usa como ferramenta de cura, o subconsciente não tem escolha senão obedecer."
          </p>
          <p className="text-primary font-semibold">— Método A.X.I.O.</p>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 mb-5">
              <Crown className="h-5 w-5 text-primary" />
              <span className="text-base font-bold text-primary">Planos de Assinatura</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Escolha o plano ideal para a sua
              <span className="text-primary"> transformação</span>
            </h2>
            <p className="text-base text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
              Invista no seu autoconhecimento e desbloqueie todo o poder do Método A.X.I.O.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-[1px] transition-all duration-300 ${
                  plan.highlight
                    ? "bg-gradient-to-b from-primary via-[hsl(260,60%,55%)] to-[hsl(220,70%,35%)] shadow-[0_0_40px_hsl(175,70%,50%,0.25)]"
                    : "bg-border hover:bg-primary/30"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-[hsl(260,60%,55%)] text-primary-foreground border-0 px-4 py-1 text-xs font-bold shadow-lg gap-1">
                      <Sparkles className="h-3 w-3" /> MELHOR VALOR
                    </Badge>
                  </div>
                )}
                <div className={`rounded-2xl p-6 h-full flex flex-col bg-card ${plan.highlight ? "bg-card/95" : ""}`}>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                      {plan.badge && (
                        <Badge
                          variant={plan.highlight ? "default" : "secondary"}
                          className={`text-xs font-bold ${plan.highlight ? "bg-primary/20 text-primary border-primary/30" : "border-primary/30 text-primary bg-primary/10"}`}
                        >
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.highlight ? "premium" : "cyanOutline"}
                    size="lg"
                    className="w-full"
                    onClick={() => handleSelectPlan(plan.name)}
                  >
                    {plan.highlight ? "Começar Agora" : "Selecionar Plano"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Todos os planos incluem 7 dias de garantia. Cancele a qualquer momento.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground px-2">
            Sua voz tem o poder de <span className="text-gradient-cyan">curar.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg px-2">
            Não adie mais. Cada noite sem reprogramação é uma oportunidade perdida.
          </p>
          <Button variant="premium" size="xl" className="animate-pulse-glow" onClick={scrollToPlans}>
            QUERO COMEÇAR AGORA
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} A.X.I.O. — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default VendaOficial;
