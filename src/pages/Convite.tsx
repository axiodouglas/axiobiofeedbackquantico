import { useNavigate } from "react-router-dom";
import { Mic, Brain, Sparkles, Quote, Smartphone, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Camila R.",
    text: "Eu não acreditava que só a minha voz podia revelar tanto. No primeiro diagnóstico, chorei de alívio. Finalmente entendi por que eu repetia os mesmos padrões limitantes.",
  },
  {
    name: "Rafael M.",
    text: "Fiz o teste gratuito por curiosidade e fiquei impressionado. O relatório descreveu coisas que eu nunca tinha contado pra ninguém. Foi o início da minha transformação.",
  },
  {
    name: "Juliana S.",
    text: "O diagnóstico me mostrou crenças limitantes que eu carregava há 30 anos sem perceber. Só esse primeiro passo já mudou completamente minha forma de ver a vida.",
  },
];

const Convite = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background noise relative overflow-hidden">
      {/* Ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[60%] h-[50%] top-[5%] left-[-10%] rounded-full opacity-10 blur-[100px] bg-[radial-gradient(ellipse,hsl(175_70%_50%/0.6),transparent_70%)] animate-pulse-glow" />
        <div className="absolute w-[40%] h-[40%] bottom-[10%] right-[-5%] rounded-full opacity-10 blur-[100px] bg-[radial-gradient(ellipse,hsl(270_50%_55%/0.5),transparent_70%)]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 py-4">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <span className="text-gradient-cyan font-bold text-lg">A.X.I.O.</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide">DIAGNÓSTICO GRATUITO</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight text-foreground px-2">
            Identifique suas{" "}
            <span className="text-gradient-cyan">Crenças Limitantes.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
            Descubra quais crenças limitantes estão travando sua vida através de uma análise de voz com inteligência artificial. <span className="text-foreground font-medium">100% gratuito. Sem cartão.</span>
          </p>

          <Button
            variant="premium"
            size="xl"
            className="text-sm sm:text-base md:text-lg px-6 sm:px-10 py-5 sm:py-6 rounded-2xl animate-pulse-glow mt-4"
            onClick={handleCTA}
          >
            <Mic className="h-5 w-5" />
            GERAR MEU DIAGNÓSTICO GRATUITO AGORA
          </Button>
        </div>
      </section>

      {/* Dr. Joe Dispenza Story */}
      <section className="relative z-10 py-14 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card-glow rounded-2xl p-6 sm:p-10 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg sm:text-xl">Dr. Joe Dispenza</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Neurocientista e autor best-seller</p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              Em 1986, Joe Dispenza sofreu um grave acidente que fraturou seis vértebras da sua coluna. Os médicos disseram que ele nunca mais andaria sem cirurgia. Ele recusou a operação e decidiu usar apenas o poder da mente para se curar.
            </p>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              Durante 9 semanas, ele meditou intensamente, reconstruindo mentalmente cada vértebra, célula por célula. <span className="text-primary font-semibold">Ele voltou a andar sem nenhuma cirurgia.</span>
            </p>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              Desde então, Dispenza dedicou sua vida a provar cientificamente que <span className="text-primary font-semibold">ao mudar os padrões da mente subconsciente, é possível transformar a saúde, os relacionamentos e o destino de uma pessoa.</span> Milhares de casos documentados confirmam: a mente é a farmácia mais poderosa do universo.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground italic mt-4">
              O método A.X.I.O. se baseia neste mesmo princípio: identificar e reprogramar as crenças limitantes que travam sua vida — revelando padrões inconscientes através da sua voz.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-14 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
              O que dizem após o <span className="text-gradient-cyan">primeiro diagnóstico</span>
            </h2>
            <p className="text-sm text-muted-foreground">Experiências reais de pessoas que identificaram suas crenças limitantes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="card-glow rounded-2xl p-6 space-y-4">
                <Quote className="h-5 w-5 text-primary/40" />
                <p className="text-sm text-foreground/85 leading-relaxed italic">"{t.text}"</p>
                <p className="text-sm font-semibold text-primary">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Repeat */}
      <section className="relative z-10 py-14 sm:py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground px-2">
            Pronto para descobrir o que sua voz <span className="text-gradient-cyan">esconde?</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Seu primeiro diagnóstico é gratuito. Leva menos de 3 minutos.
          </p>
          <Button
            variant="premium"
            size="xl"
            className="text-sm sm:text-base px-6 sm:px-10 py-5 sm:py-6 rounded-2xl animate-pulse-glow"
            onClick={handleCTA}
          >
            <Mic className="h-5 w-5" />
            GERAR MEU DIAGNÓSTICO GRATUITO AGORA
          </Button>
        </div>
      </section>

      {/* PWA Install Guide */}
      <section className="relative z-10 py-14 sm:py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card-glow rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <Smartphone className="h-8 w-8 text-primary mx-auto" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Baixe o A.X.I.O. no seu celular</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Adicione à tela de início e tenha o app sempre à mão</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="space-y-3">
                <p className="font-semibold text-foreground">📱 iPhone (Safari):</p>
                <ol className="space-y-2 text-muted-foreground pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Abra o site no <strong className="text-foreground">Safari</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>Toque no ícone de <strong className="text-foreground">Compartilhar</strong> <Share className="inline h-3.5 w-3.5 text-primary" /></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>Selecione <strong className="text-foreground">"Adicionar à Tela de Início"</strong> <PlusSquare className="inline h-3.5 w-3.5 text-primary" /></span>
                  </li>
                </ol>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-foreground">🤖 Android (Chrome):</p>
                <ol className="space-y-2 text-muted-foreground pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Abra o site no <strong className="text-foreground">Chrome</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>Toque nos <strong className="text-foreground">três pontinhos</strong> (⋮) no canto superior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>Selecione <strong className="text-foreground">"Adicionar à tela inicial"</strong></span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground space-y-1">
        <p>© 2026 <strong className="font-bold">A.X.I.O. Biofeedback Quântico</strong>. Todos os direitos reservados. Marca e Método Registrados. Proibida reprodução total ou parcial. Proteção sob a Lei nº 9.279/96.</p>
      </footer>
    </div>
  );
};

export default Convite;
