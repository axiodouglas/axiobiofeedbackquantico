import { Star } from "lucide-react";

const testimonials = [
  {
    author: "Marcos O.",
    text: "Achei que não ia conseguir gravar minha voz com calma, mas segui a dica e fiz relaxado. É estranho no começo, mas o resultado de ouvir a si mesmo é muito potente.",
  },
  {
    author: "Helena M.",
    text: "Eu tinha pavor de olhar para trás por causa dos abusos que sofri na infância. A raiva e a tristeza me consumiam. Com a meditação de traumas, hoje sinto que a situação ficou no passado. Finalmente tenho paz.",
  },
  {
    author: "Felipe G.",
    text: "O diagnóstico da Mãe mostrou exatamente por que eu tinha tanto medo de faltar dinheiro. Era uma crença dela que eu carregava. Ouvir o loop dormindo mudou meu mindset em poucos dias.",
  },
  {
    author: "Juliana P.",
    text: "Minha saúde melhorou depois que limpei o rancor que tinha da minha linhagem materna. Incrível como a gente guarda lixo emocional no corpo sem saber.",
  },
  {
    author: "Sonia K.",
    text: "Estou no meu quinto dia de protocolo de loop noturno. O sono está muito mais profundo e eu acordo com uma disposição que não tinha antes. O AXIO é transformador.",
  },
];

const TestimonialsSection = () => (
  <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 px-2">
          Relatos de quem já <span className="text-gradient-brand">se transformou</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground px-2">Histórias reais da comunidade AXIO.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`card-glow rounded-2xl p-6 space-y-3 ${i === 0 ? "sm:col-span-2" : ""}`}
          >
            <div className="flex items-center gap-1.5 text-primary">
              {[...Array(5)].map((_, s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
              "{t.text}"
            </p>
            <p className="text-xs font-semibold text-foreground">— {t.author}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
