import { ArrowLeft, Brain, Mic, Sparkles, FileText, Moon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background noise">
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">O Método</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como Funciona o <span className="text-gradient-cyan">A.X.I.O.</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Entenda cada etapa do processo de reprogramação quântica do seu inconsciente de origem.
            </p>
          </div>

          {/* Part 1: Gravação do Áudio */}
          <section className="mb-12">
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Gravação do Áudio</h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Você escolhe qual pilar deseja trabalhar — <strong className="text-foreground">Mãe</strong>, <strong className="text-foreground">Pai</strong> ou <strong className="text-foreground">Traumas</strong> — 
                e grava um áudio de 2 minutos contando sua história. A inteligência do A.X.I.O. analisa seu relato 
                para localizar as crenças limitantes que estão travando suas 3 áreas da vida: 
                <strong className="text-foreground"> Relacionamento</strong>, <strong className="text-foreground">Saúde</strong> e <strong className="text-foreground">Financeiro</strong>.
              </p>
            </div>
          </section>

          {/* Part 2: Relatório Semanal e Comandos */}
          <section className="mb-12">
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Relatório Semanal e Comandos Quânticos</h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
                Após a análise, o A.X.I.O. entrega um relatório semanal completo para acompanhamento 
                da sua evolução, junto com <strong className="text-foreground">Comandos Quânticos</strong> personalizados.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Os Comandos são frases de reprogramação pensadas e estudadas para agir diretamente 
                dentro do subconsciente do cliente, utilizando técnicas avançadas de 
                <strong className="text-foreground"> PNL</strong>, <strong className="text-foreground">Neurociência</strong> e 
                <strong className="text-foreground"> Física Quântica</strong>.
              </p>
            </div>
          </section>

          {/* Part 3: Meditação com a Própria Voz */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary/40 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Moon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. A Meditação com Sua Própria Voz</h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
                Esta é a inovação criada pelo fundador do A.X.I.O.:
              </p>
              <div className="bg-secondary/30 rounded-xl p-5 mb-6 max-w-xl mx-auto">
                <p className="text-foreground font-medium leading-relaxed">
                  Você grava os Comandos Quânticos <strong>com a sua própria voz</strong>. 
                  Isso burla as defesas do cérebro — o <em>fator crítico da mente</em> — porque 
                  o subconsciente aceita muito mais facilmente a própria voz do que uma voz estranha.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
                A meditação é montada para ser ouvida à noite, enquanto você dorme, reprogramando 
                sua mente durante o estado de maior receptividade do subconsciente.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Enquanto meditações tradicionais usam vozes de terceiros (que o cérebro filtra e resiste), 
                o método A.X.I.O. utiliza o reconhecimento vocal nativo do sistema límbico para 
                acelerar a ressignificação em até 3x mais rápido.
              </p>
              <p className="text-sm text-primary font-semibold mt-6">
                "A mente não discute consigo mesma — ela obedece."
              </p>
            </div>
          </section>

          {/* Part 4: Orientação de Uso (em branco) */}
          <section className="mb-16">
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Orientação de Uso do A.X.I.O.</h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Em breve.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Button 
              variant="cyan" 
              size="xl" 
              className="group mb-4"
              onClick={() => navigate("/recording?area=mae")}
            >
              <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
              Iniciar Diagnóstico Gratuito
            </Button>
            <p className="text-sm text-muted-foreground">
              Descubra a raiz. Depois, cure com os Comandos Premium.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
