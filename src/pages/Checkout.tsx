import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "monthly",
    name: "Mensal",
    price: "R$ 29,90",
    period: "/mês",
    description: "Acesso completo mensal",
    popular: false,
    discount: null,
    features: [
      "Relatório semanal",
      "Comandos quânticos",
      "Meditação quântica semanal",
      "Relatórios de sentimentos predominantes",
      "Acesso à comunidade de elevação de frequência",
    ],
    stripeLink: "#",
  },
  {
    id: "quarterly",
    name: "Trimestral",
    price: "R$ 24,99",
    period: "/mês",
    totalPrice: "R$ 74,97/trimestre",
    description: "Economia garantida",
    popular: false,
    discount: "17% OFF",
    features: [
      "Relatório semanal",
      "Comandos quânticos",
      "Meditação quântica semanal",
      "Relatórios de sentimentos predominantes",
      "Acesso à comunidade de elevação de frequência",
    ],
    stripeLink: "#",
  },
  {
    id: "semiannual",
    name: "Semestral",
    price: "R$ 19,99",
    period: "/mês",
    totalPrice: "R$ 119,94/semestre",
    description: "Melhor custo-benefício",
    popular: true,
    discount: "33% OFF",
    features: [
      "Relatório semanal",
      "Comandos quânticos",
      "Meditação quântica semanal",
      "Relatórios de sentimentos predominantes",
      "Acesso à comunidade de elevação de frequência",
    ],
    stripeLink: "#",
  },
];

const Checkout = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (stripeLink: string) => {
    if (stripeLink !== "#") {
      window.location.href = stripeLink;
    } else {
      alert("Configure o link do Stripe para este plano.");
    }
  };

  return (
    <div className="min-h-screen bg-background noise">
      {/* Header with Terms */}
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button variant="ghost" onClick={() => navigate("/terms")} className="text-sm text-muted-foreground">
            Termos e Obrigações
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium A.X.I.O.</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 px-2">
              Escolha Seu Plano de <span className="text-gradient-brand">Transformação</span>
            </h1>
            
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              Desbloqueie todo o poder da reprogramação quântica e transforme 
              todas as áreas da sua vida com acesso completo ao A.X.I.O.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span>Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <span>Acesso Imediato</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-5 w-5 text-primary" />
              <span>Garantia de 7 dias</span>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-4 sm:p-6 transition-all hover:scale-[1.02] sm:hover:scale-105 ${
                  plan.popular
                    ? "border-primary bg-gradient-to-b from-primary/10 to-card"
                    : "border-border bg-card"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Mais Popular
                  </div>
                )}

                {/* Discount Badge */}
                {plan.discount && (
                  <div className="absolute -top-3 right-4 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                    {plan.discount}
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.totalPrice && (
                    <p className="text-sm text-muted-foreground mt-1">{plan.totalPrice}</p>
                  )}
                  <p className="text-sm text-primary mt-2">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? "premium" : "cyan"}
                  className="w-full"
                  size="lg"
                  onClick={() => handleSelectPlan(plan.stripeLink)}
                >
                  Selecionar {plan.name}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda? Entre em contato conosco pelo email{" "}
              <a href="mailto:suporte@axio.app" className="text-primary hover:underline">
                suporte@axio.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
