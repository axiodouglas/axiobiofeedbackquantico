import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import showcaseDiagnosis from "@/assets/showcase-diagnosis.jpg";
import showcaseOracle from "@/assets/showcase-oracle.jpg";
import showcaseReports from "@/assets/showcase-reports.jpg";

const screens = [
  { src: showcaseDiagnosis, alt: "Diagnóstico por voz AXIO" },
  { src: showcaseOracle, alt: "Oráculo AXIO" },
  { src: showcaseReports, alt: "Relatórios AXIO" },
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
                  <div className="w-[200px] sm:w-[260px] md:w-[300px] rounded-2xl overflow-hidden shadow-[0_0_30px_hsl(175,70%,50%,0.15)] border border-primary/10">
                    <img src={s.src} alt={s.alt} className="w-full h-auto object-cover" loading="lazy" />
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
