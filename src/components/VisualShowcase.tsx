import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import showcaseHome from "@/assets/showcase-home.jpg";
import showcasePilares from "@/assets/showcase-pilares.jpg";
import showcaseRelatorio from "@/assets/showcase-relatorio.jpg";
import showcaseFuncionalidades from "@/assets/showcase-funcionalidades.jpg";
import showcaseGravacao from "@/assets/showcase-gravacao.jpg";
import showcaseOraculo from "@/assets/showcase-oraculo.jpg";

const screens = [
  { src: showcaseHome, alt: "Tela inicial AXIO" },
  { src: showcasePilares, alt: "Os 4 Pilares da Crença" },
  { src: showcaseGravacao, alt: "Gravação de áudio AXIO" },
  { src: showcaseRelatorio, alt: "Relatório e diagnóstico AXIO" },
  { src: showcaseFuncionalidades, alt: "Funcionalidades AXIO" },
  { src: showcaseOraculo, alt: "Oráculo AXIO" },
];

const VisualShowcase = () => {
  const [current, setCurrent] = React.useState(0);
  const [api, setApi] = React.useState<any>(null);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <section className="relative z-10 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-10 px-2">
          Conheça o <span className="text-gradient-cyan">AXIO</span> por dentro
        </h2>

        <div className="rounded-2xl border border-primary/20 bg-card/40 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_40px_hsl(175,70%,50%,0.08)]">
          <Carousel setApi={setApi} opts={{ loop: true }} className="relative">
            <CarouselContent>
              {screens.map((s, i) => (
                <CarouselItem key={i} className="flex items-center justify-center">
                  {/* Phone frame */}
                  <div className="relative w-[220px] sm:w-[260px] md:w-[280px]">
                    <div className="rounded-[2rem] border-[3px] border-muted-foreground/30 bg-background/80 p-2 shadow-[0_0_30px_hsl(175,70%,50%,0.15)]">
                      {/* Notch */}
                      <div className="mx-auto w-20 h-4 bg-muted-foreground/20 rounded-b-xl mb-1" />
                      <div className="rounded-[1.5rem] overflow-hidden">
                        <img src={s.src} alt={s.alt} className="w-full h-auto object-cover" loading="lazy" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 sm:-left-4 bg-primary/20 border-primary/30 text-primary hover:bg-primary/30" />
            <CarouselNext className="right-0 sm:-right-4 bg-primary/20 border-primary/30 text-primary hover:bg-primary/30" />
          </Carousel>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {screens.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === i
                    ? "w-7 bg-primary shadow-[0_0_10px_hsl(175,70%,50%,0.5)]"
                    : "w-2.5 bg-muted-foreground/30"
                }`}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualShowcase;
