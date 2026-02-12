import { Mic, Brain, MessageCircle } from "lucide-react";

const benefits = [
  {
    icon: Mic,
    title: "Diagnóstico por Biofeedback de Áudio",
    description: "Sua voz carrega padrões emocionais invisíveis. Nossa IA analisa frequências, micro-hesitações e entonação para revelar traumas ocultos no subconsciente.",
  },
  {
    icon: Brain,
    title: "Meditações Personalizadas com sua Voz",
    description: "Você irá gravar a meditação com a sua própria voz e isso é o que vai te dar controle sobre seu subconsciente.",
  },
  {
    icon: MessageCircle,
    title: "Oráculo AXIO para Dúvidas Profundas",
    description: "Um conselheiro quântico treinado em PNL, Neurociência e Física Quântica para tirar suas dúvidas sobre suas crenças.",
  },
];

const BenefitsSection = () => (
  <section className="relative z-10 py-20 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 px-2">
          O que o <span className="text-gradient-cyan">A.X.I.O.</span> faz por você
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto px-2">
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
);

export default BenefitsSection;
