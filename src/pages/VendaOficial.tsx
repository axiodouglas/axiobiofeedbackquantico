import { Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import VisualShowcase from "@/components/VisualShowcase";
import AuthorSection from "@/components/venda/AuthorSection";
import FeaturesSection from "@/components/venda/FeaturesSection";
import CtaBanner from "@/components/venda/CtaBanner";
import axioLogoX from "@/assets/axio-logo-x.png";

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
            Identifique e reprograme suas{" "}
            <span className="text-gradient-brand">Crenças Limitantes</span>
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
              <a href="https://axiobiofeedbackquantico.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                COMEÇAR DIAGNÓSTICO GRÁTIS
              </a>
            </Button>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto px-2">
              Teste Grátis: descubra suas <span className="text-gradient-brand font-semibold">Crenças Limitantes</span> — entenda quais padrões inconscientes estão travando sua vida e como reprogramá-los.
            </p>
          </div>
        </div>
      </section>

      {/* Author + Meditation Innovation */}
      <AuthorSection />

      {/* CTA Banner 1 */}
      <CtaBanner text="Comece sua transformação agora" />

      {/* All Features — detailed */}
      <FeaturesSection />

      {/* CTA Banner 2 */}
      <CtaBanner text="Liberte-se das crenças que te limitam" />

      {/* Visual Showcase — Carousel */}
      <VisualShowcase />

      {/* Final CTA */}
      <CtaBanner text="Sua transformação começa agora" />

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 sm:py-8 text-center text-xs text-muted-foreground space-y-1 px-4">
        <p className="font-semibold text-gradient-brand">A.X.I.O. - Análise do Fator X do Inconsciente de Origem</p>
        <p>© 2026 A.X.I.O. Todos os direitos reservados. Marca e Método em processo de registro.</p>
      </footer>
    </div>
  );
};

export default VendaOficial;
