import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import UserMenu from "@/components/UserMenu";

const plans = [
  {
    name: "Mensal",
    price: "29,90",
    period: "/mês",
    badge: null,
    highlight: false,
    features: [
      { text: "Diagnóstico completo de Crenças Limitantes", included: true },
      { text: "Relatório AXIO completo", included: true },
      { text: "Comandos Quânticos personalizados", included: true },
      { text: "Meditação personalizada", included: true },
      { text: "Acesso à Comunidade AXIO", included: true },
      { text: "Oráculo AXIO", included: false },
      { text: "Conselheiro de Performance", included: false },
    ],
    link: "https://pay.kiwify.com.br/yobcEvI",
  },
  {
    name: "Trimestral",
    price: "24,99",
    period: "/mês",
    badge: "16% OFF",
    highlight: false,
    features: [
      { text: "Diagnóstico completo de Crenças Limitantes", included: true },
      { text: "Relatório AXIO completo", included: true },
      { text: "Comandos Quânticos personalizados", included: true },
      { text: "Meditação personalizada", included: true },
      { text: "Acesso à Comunidade AXIO", included: true },
      { text: "Oráculo AXIO (1 pergunta/dia)", included: true },
      { text: "Conselheiro de Performance (1 análise/dia)", included: true },
    ],
    link: "https://pay.kiwify.com.br/JZ6HiAu",
  },
  {
    name: "Semestral",
    price: "19,90",
    period: "/mês",
    badge: "33% OFF",
    highlight: true,
    features: [
      { text: "Diagnóstico completo de Crenças Limitantes", included: true },
      { text: "Relatório AXIO completo", included: true },
      { text: "Comandos Quânticos personalizados", included: true },
      { text: "Meditação personalizada", included: true },
      { text: "Acesso à Comunidade AXIO", included: true },
      { text: "Oráculo AXIO (1 pergunta/dia)", included: true },
      { text: "Conselheiro de Performance (1 análise/dia)", included: true },
    ],
    link: "https://pay.kiwify.com.br/R3VE945",
  },
];

const Plans = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    toast({
      title: "Redirecionando para o Checkout Seguro...",
      description: `Você selecionou o plano ${planName}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <UserMenu />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-3">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">Planos de Assinatura</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">
            Escolha o plano ideal para a sua
            <span className="text-primary"> transformação</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
            Invista no seu autoconhecimento e desbloqueie todo o poder do Método A.X.I.O.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-[1px] transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-b from-primary via-[hsl(260,60%,55%)] to-[hsl(220,70%,35%)] shadow-[0_0_40px_hsl(175,70%,50%,0.25)]"
                  : "bg-border hover:bg-primary/30"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-primary to-[hsl(260,60%,55%)] text-primary-foreground border-0 px-3 py-0.5 text-[10px] font-bold shadow-lg gap-1">
                    <Sparkles className="h-3 w-3" />
                    MELHOR VALOR
                  </Badge>
                </div>
              )}

              <div className={`rounded-xl p-4 h-full flex flex-col bg-card ${plan.highlight ? "bg-card/95" : ""}`}>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                    {plan.badge && (
                      <Badge variant={plan.highlight ? "default" : "secondary"} className={`text-[10px] font-bold ${plan.highlight ? "bg-primary/20 text-primary border-primary/30" : "border-primary/30 text-primary bg-primary/10"}`}>
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-muted-foreground">R$</span>
                    <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-1.5 flex-1 mb-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className={`flex items-start gap-1.5 text-xs ${feat.included ? "text-foreground/80" : "text-muted-foreground/50"}`}>
                      {feat.included ? (
                        <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/40 mt-0.5 shrink-0" />
                      )}
                      <span className={!feat.included ? "line-through" : ""}>{feat.text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlight ? "premium" : "cyanOutline"}
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <a href={plan.link} target="_blank" rel="noopener noreferrer">
                    Adquirir Plano
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Todos os planos incluem 7 dias de garantia. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
};

export default Plans;
