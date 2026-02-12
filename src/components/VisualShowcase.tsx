import showcaseDiagnosis from "@/assets/showcase-diagnosis.jpg";
import showcaseOracle from "@/assets/showcase-oracle.jpg";
import showcaseReports from "@/assets/showcase-reports.jpg";

const screens = [
  { src: showcaseDiagnosis, alt: "Diagnóstico por voz AXIO", rotate: -5, z: 3, offset: "-translate-x-8 sm:-translate-x-12" },
  { src: showcaseOracle, alt: "Oráculo AXIO", rotate: 0, z: 4, offset: "translate-y-4" },
  { src: showcaseReports, alt: "Relatórios AXIO", rotate: 5, z: 3, offset: "translate-x-8 sm:translate-x-12" },
];

const VisualShowcase = () => {
  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-primary/20 bg-card/40 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_40px_hsl(175,70%,50%,0.08)]">
          {/* Mosaic */}
          <div className="flex items-center justify-center relative h-[280px] sm:h-[360px] md:h-[420px]">
            {screens.map((s, i) => (
              <div
                key={i}
                className={`absolute w-[140px] sm:w-[180px] md:w-[220px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-primary/10 transition-transform duration-500 hover:scale-105 ${s.offset}`}
                style={{ transform: `rotate(${s.rotate}deg)`, zIndex: s.z }}
              >
                <img src={s.src} alt={s.alt} className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>

          <p className="text-center text-sm sm:text-base text-muted-foreground mt-8 leading-relaxed">
            Veja o <span className="text-primary font-semibold">AXIO</span> em ação! Transforme sua mente com a ciência do futuro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisualShowcase;
