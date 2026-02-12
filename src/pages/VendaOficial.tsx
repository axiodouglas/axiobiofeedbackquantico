import { Sparkles, Brain, Mic, MessageCircle, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import VisualShowcase from "@/components/VisualShowcase";

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

const VendaOficial = () => {
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

          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground px-2 uppercase">
            Reprograme suas Crenças com{" "}
            <span className="text-gradient-cyan">A.X.I.O.</span>
          </h1>

          {/* YouTube Video */}
          <div className="w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_30px_hsl(175,70%,50%,0.15)]">
            <iframe
              src="https://www.youtube.com/embed/W0LV-4LHwCI?rel=0&autoplay=1&mute=1"
              title="AXIO - Vídeo de Vendas"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="pt-4 flex flex-col items-center gap-4">
            <Button
              variant="cyan"
              size="xl"
              className="text-sm sm:text-base md:text-lg px-6 sm:px-10 py-5 sm:py-6 rounded-2xl"
              asChild
            >
              <a href="#" className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                BAIXAR AGORA
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <VisualShowcase />

      {/* Benefits Section */}
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

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 px-2">
              Relatos de quem já <span className="text-gradient-cyan">se transformou</span>
            </h2>
            <p className="text-muted-foreground px-2">Histórias reais da comunidade AXIO.</p>
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

      {/* Social Proof Quote */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground italic leading-snug px-2">
            "A voz é a impressão digital emocional. Quando você a usa como ferramenta de cura, o subconsciente não tem escolha senão obedecer."
          </p>
          <p className="text-primary font-semibold">— Método A.X.I.O.</p>
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
          <Button variant="premium" size="xl" className="animate-pulse-glow rounded-2xl text-sm sm:text-base" asChild>
            <a href="#">QUERO MEU DIAGNÓSTICO GRATUITO AGORA</a>
          </Button>
        </div>
      </section>

      {/* Joe Dispenza Authority Block - Inspiração */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Inspiração</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground px-2">
              A ciência que prova: <span className="text-gradient-cyan">a mente cura o corpo.</span>
            </h2>
          </div>

          <div className="card-glow rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary shrink-0">JD</div>
              <div>
                <h3 className="text-base font-bold text-foreground">Dr. Joe Dispenza</h3>
                <span className="text-xs text-muted-foreground">Neurocientista &amp; Autor</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Em 1986, Joe Dispenza foi atropelado por um carro durante uma competição de triatlo. O acidente
              destruiu 6 vértebras da sua coluna. Os médicos foram unânimes: ele precisaria de uma cirurgia com
              implante de hastes metálicas — e mesmo assim, provavelmente nunca mais andaria normalmente.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Joe recusou a cirurgia. Em vez disso, decidiu usar exclusivamente o poder da sua mente para se curar.
              Durante 9 semanas e meia, deitado de bruços, ele dedicou horas por dia a um único exercício:
              <span className="text-primary font-medium"> reconstruir mentalmente sua coluna, vértebra por vértebra,
              enviando comandos claros e repetitivos ao seu corpo.</span>
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Em 10 semanas, Joe estava de pé. Em 12 semanas, voltou a treinar. Sem cirurgia. Sem hastes metálicas.
              Apenas o poder da mente sobre a matéria.
            </p>

            <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mt-3">
              <p className="text-sm text-primary italic text-center leading-relaxed">
                "Seu corpo não sabe a diferença entre uma experiência real e uma que você cria mentalmente com a mesma intensidade emocional."
                <span className="block text-xs text-primary/70 mt-1.5">— Dr. Joe Dispenza</span>
              </p>
            </div>
          </div>
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
