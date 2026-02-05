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
    features: [
      "Acesso às 4 áreas de diagnóstico",
      "Comandos de reprogramação ilimitados",
      "Relatórios mensais de evolução",
      "Suporte por email",
    ],
    stripeLink: "#", // Replace with actual Stripe link
  },
  {
    id: "annual",
    name: "Anual",
    price: "R$ 19,90",
    period: "/mês",
    totalPrice: "R$ 238,80/ano",
    description: "Economize 33%",
    popular: true,
    features: [
      "Tudo do plano Mensal",
      "Economia de R$ 120/ano",
      "Relatórios semanais detalhados",
      "Suporte prioritário",
      "Bônus: Meditações exclusivas",
    ],
    stripeLink: "#", // Replace with actual Stripe link
  },
  {
    id: "lifetime",
    name: "Vitalício",
    price: "R$ 399,90",
    period: " único",
    description: "Acesso para sempre",
    popular: false,
    features: [
      "Tudo do plano Anual",
      "Pagamento único",
      "Acesso vitalício garantido",
      "Todas as atualizações futuras",
      "Suporte VIP",
      "Sessão de consultoria",
    ],
    stripeLink: "#", // Replace with actual Stripe link
  },
];

const Checkout = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (stripeLink: string) => {
    // TODO: Redirect to Stripe checkout
    if (stripeLink !== "#") {
      window.location.href = stripeLink;
    } else {
      alert("Configure o link do Stripe para este plano.");
    }
  };

  return (
    <div className="min-h-screen bg-background noise">
      {/* Header */}
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium A.X.I.O.</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Escolha Seu Plano de Transformação
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-6 transition-all hover:scale-105 ${
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

                {/* Plan Header */}
                <div className="text-center mb-6">
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
