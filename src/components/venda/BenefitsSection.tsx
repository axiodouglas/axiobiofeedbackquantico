import { Mic, Brain, MessageCircle } from "lucide-react";

const benefits = [
  {
    icon: Mic,
    title: "Diagnóstico por Biofeedback de Áudio",
    description: "Sua voz carrega padrões emocionais invisíveis. Nossa IA analisa frequências, micro-hesitações e entonação para revelar crenças limitantes ocultas no subconsciente.",
  },
  {
    icon: Brain,
    title: "Meditações Personalizadas com sua Voz",
    description: "Grave a meditação com sua própria voz para reprogramar as crenças limitantes identificadas no diagnóstico.",
  },
  {
    icon: MessageCircle,
    title: "Oráculo AXIO para Dúvidas Profundas",
    description: "Um conselheiro inteligente treinado em PNL, Neurociência e Física Quântica para ajudar você a entender e superar suas crenças limitantes.",
  },
];

const BenefitsSection = () => (
  <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8 sm:mb-14">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 px-2">
          O que o <span className="text-gradient-brand">A.X.I.O.</span> faz por você
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto px-2">
          Três ferramentas trabalhando juntas para identificar e reprogramar suas crenças limitantes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {benefits.map((b, i) => (
          <div
            key={i}
            className="card-glow rounded-2xl p-5 sm:p-8 flex flex-col items-center text-center space-y-3 sm:space-y-4 group hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:shadow-[0_0_25px_hsl(175,70%,50%,0.3)] transition-shadow">
              <b.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">{b.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{b.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
