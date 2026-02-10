import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Check, Sparkles } from "lucide-react";
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
      "Diagnósticos ilimitados",
      "Comandos Quânticos personalizados",
      "Meditação personalizada",
      "Acesso ao Oráculo AXIO",
    ],
  },
  {
    name: "Trimestral",
    price: "24,99",
    period: "/mês",
    badge: "16% OFF",
    highlight: false,
    features: [
      "Tudo do plano Mensal",
      "Economia de R$ 14,73 no trimestre",
      "Acesso à Comunidade AXIO",
      "Suporte prioritário",
    ],
  },
  {
    name: "Semestral",
    price: "19,90",
    period: "/mês",
    badge: "33% OFF",
    highlight: true,
    features: [
      "Tudo do plano Trimestral",
      "Economia de R$ 60 no semestre",
      "Relatórios de evolução",
      "Conteúdos exclusivos",
    ],
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

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 mb-5">
            <Crown className="h-5 w-5 text-primary" />
            <span className="text-base font-bold text-primary">Planos de Assinatura</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Escolha o plano ideal para a sua
            <span className="text-primary"> transformação</span>
          </h1>
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
                    <Sparkles className="h-3 w-3" />
                    MELHOR VALOR
                  </Badge>
                </div>
              )}

              <div className={`rounded-2xl p-6 h-full flex flex-col bg-card ${plan.highlight ? "bg-card/95" : ""}`}>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    {plan.badge && !plan.highlight && (
                      <Badge variant="secondary" className="text-xs font-bold border-primary/30 text-primary bg-primary/10">
                        {plan.badge}
                      </Badge>
                    )}
                    {plan.badge && plan.highlight && (
                      <Badge className="text-xs font-bold bg-primary/20 text-primary border-primary/30">
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
    </div>
  );
};

export default Plans;
