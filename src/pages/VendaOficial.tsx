import { Sparkles, Brain, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import VisualShowcase from "@/components/VisualShowcase";
import AuthorSection from "@/components/venda/AuthorSection";
import TestimonialsSection from "@/components/venda/TestimonialsSection";
import BenefitsSection from "@/components/venda/BenefitsSection";
import CtaBanner from "@/components/venda/CtaBanner";
import axioLogoX from "@/assets/axio-logo-x.png";

const APP_URL = "https://axiobiofeedbackquantico.lovable.app";

const VendaOficial = () => {
  return (
    <div className="min-h-screen bg-background noise relative overflow-hidden">
      {/* Ambient nebula effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[60%] h-[50%] top-[5%] left-[-10%] rounded-full opacity-10 blur-[100px] bg-[radial-gradient(ellipse,hsl(175_70%_50%/0.6),transparent_70%)] animate-pulse-glow" />
        <div className="absolute w-[40%] h-[40%] bottom-[10%] right-[-5%] rounded-full opacity-10 blur-[100px] bg-[radial-gradient(ellipse,hsl(260_60%_65%/0.5),transparent_70%)]" />
        <div className="absolute w-[30%] h-[30%] top-[40%] left-[40%] rounded-full opacity-[0.06] blur-[80px] bg-[radial-gradient(ellipse,hsl(260_60%_55%/0.6),transparent_70%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 w-full">
          <div className="flex flex-col items-center gap-1">
            <img
              src={axioLogoX}
              alt="A.X.I.O."
              className="h-[70px] sm:h-[100px] w-auto object-contain"
              draggable={false}
            />
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest text-foreground">
              <span className="text-gradient-brand">A.</span>X.I.O.
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm font-medium tracking-wider text-muted-foreground">
              Análise do Fator X do Inconsciente de Origem
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 sm:px-5 py-1.5 sm:py-2">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-gradient-brand tracking-wide">MÉTODO A.X.I.O.</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground px-2 uppercase">
            Reprograme suas Crenças com{" "}
            <span className="text-gradient-brand">A.X.I.O.</span>
          </h1>

          {/* YouTube Video */}
          <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_30px_hsl(175,70%,50%,0.1),0_0_60px_hsl(260,60%,65%,0.08)]">
            <iframe
              src="https://www.youtube.com/embed/W0LV-4LHwCI?rel=0&autoplay=1&mute=1&loop=1&playlist=W0LV-4LHwCI&playsinline=1"
              title="AXIO - Vídeo de Vendas"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="pt-4 sm:pt-6 flex flex-col items-center gap-3 sm:gap-4">
            <Button variant="premium" size="xl" className="text-xs sm:text-sm md:text-base px-5 sm:px-10 py-4 sm:py-6 rounded-xl sm:rounded-2xl w-full max-w-sm" asChild>
              <a href="https://axiobiofeedbackquantico.lovable.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                COMEÇAR DIAGNÓSTICO GRÁTIS
              </a>
            </Button>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto px-2">
              Teste Grátis: <span className="text-gradient-brand font-semibold">Pilar Mãe</span> — A mãe é a base da segurança e prosperidade. Entenda como essa conexão molda suas crenças hoje.
            </p>
          </div>
        </div>
      </section>

      {/* Author Section - below video */}
      <AuthorSection />

      {/* Visual Showcase — Carousel */}
      <VisualShowcase />

      {/* CTA Banner 1 */}
      <CtaBanner text="Comece sua transformação agora" />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* CTA Banner 2 */}
      <CtaBanner text="Liberte-se das crenças que te limitam" />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Social Proof Quote */}
      <section className="relative z-10 py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground italic leading-snug px-2">
            "A voz é a impressão digital emocional. Quando você a usa como ferramenta de cura, o subconsciente não tem escolha senão obedecer."
          </p>
          <p className="text-gradient-brand font-semibold text-sm sm:text-base">— Método A.X.I.O.</p>
        </div>
      </section>

      {/* Joe Dispenza Authority Block */}
      <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 sm:px-5 py-1.5 sm:py-2 mb-4">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-semibold text-gradient-brand">Inspiração</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground px-2">
              A ciência que prova: <span className="text-gradient-brand">a mente cura o corpo.</span>
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
      <footer className="relative z-10 border-t border-border py-6 sm:py-8 text-center text-xs text-muted-foreground space-y-1 px-4">
        <p className="font-semibold text-gradient-brand">A.X.I.O. - Análise do Fator X do Inconsciente de Origem</p>
        <p>© 2026 A.X.I.O. Todos os direitos reservados. Marca e Método em processo de registro.</p>
      </footer>
    </div>
  );
};

export default VendaOficial;
