import { ArrowLeft, Brain, Heart, UserCheck, DollarSign, Stethoscope, Users, Repeat, Mic, Sparkles, Moon, Sun, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";

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
              <span className="text-sm font-medium text-primary">O Processo de Cura</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como o <span className="text-gradient-cyan">A.X.I.O.</span> Funciona
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Entenda a ciência por trás da reprogramação quântica e como curar sua linhagem familiar.
            </p>
          </div>

          {/* Section 1: A Raiz de Tudo */}
          <section className="mb-16">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/20">
                  <Heart className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">1. A Raiz de Tudo</h2>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                Todos os seus problemas atuais — financeiros, de saúde e nos relacionamentos — 
                têm uma única origem: os padrões instalados pela sua <strong className="text-foreground">Mãe</strong> e 
                pelo seu <strong className="text-foreground">Pai</strong> durante a gestação e a infância.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-6">
                A epigenética prova que traumas emocionais são transmitidos biologicamente. 
                Quando sua mãe viveu medo, escassez ou rejeição durante a gravidez, essas 
                frequências vibracionais foram gravadas no seu sistema nervoso como "programas de sobrevivência".
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-secondary/30 rounded-xl p-4 text-center">
                  <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground mb-1">Mãe</p>
                  <p className="text-xs text-muted-foreground">Autoimagem, valor próprio, merecimento</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center">
                  <UserCheck className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground mb-1">Pai</p>
                  <p className="text-xs text-muted-foreground">Ação no mundo, autoridade, provisão</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center">
                  <Brain className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground mb-1">Traumas</p>
                  <p className="text-xs text-muted-foreground">Eventos externos: bullying, perdas, abusos</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Relatório de Impacto */}
          <section className="mb-16">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">2. Relatório de Impacto</h2>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                O A.X.I.O. não gera apenas um diagnóstico genérico. Ele analisa seu áudio e mapeia 
                <strong className="text-foreground"> exatamente como</strong> os traumas familiares estão afetando 
                as 3 áreas da sua vida:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-secondary/20 rounded-xl p-4">
                  <DollarSign className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">💰 Financeiro</p>
                    <p className="text-sm text-muted-foreground">
                      "A rejeição paterna é a causa da sua dificuldade em cobrar o valor justo no trabalho."
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-secondary/20 rounded-xl p-4">
                  <Stethoscope className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">🏥 Saúde</p>
                    <p className="text-sm text-muted-foreground">
                      "A ansiedade crônica que você sente é a somatização do ambiente de medo que sua mãe viveu na gestação."
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-secondary/20 rounded-xl p-4">
                  <Users className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">❤️ Relacionamentos</p>
                    <p className="text-sm text-muted-foreground">
                      "Sua necessidade de aprovação constante é a repetição do padrão de buscar no parceiro o que o pai não deu."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Repetição e Linhas Neurais */}
          <section className="mb-16">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                  <Repeat className="h-6 w-6 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">3. Comandos Quânticos</h2>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                A mente aprende por <strong className="text-foreground">repetição</strong>. 
                Os Comandos Quânticos são frases de reprogramação personalizadas, geradas pela IA 
                com base no seu diagnóstico específico. Eles devem ser ouvidos ou falados em 3 momentos:
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-secondary/30 rounded-xl p-4 text-center">
                  <Sun className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Ao Acordar</p>
                  <p className="text-[10px] text-muted-foreground">Mente receptiva</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Durante o Dia</p>
                  <p className="text-[10px] text-muted-foreground">Reforço neural</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 text-center">
                  <Moon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Ao Dormir</p>
                  <p className="text-[10px] text-muted-foreground">Subconsciente ativo</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada repetição fortalece novas conexões neurais (neuroplasticidade), 
                substituindo as crenças limitantes gravadas na infância por novos padrões 
                de abundância, saúde e amor.
              </p>
            </div>
          </section>

          {/* Section 4: Meditação Inovadora */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary/40 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">4. A Meditação com Sua Própria Voz</h2>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Esta é a inovação criada pelo fundador do A.X.I.O.:
              </p>

              <div className="bg-secondary/30 rounded-xl p-5 mb-6">
                <p className="text-foreground font-medium leading-relaxed">
                  Você grava os Comandos Quânticos <strong>com a sua própria voz</strong>. 
                  Isso burla as defesas do cérebro — o <em>fator crítico da mente</em> — porque 
                  o subconsciente aceita muito mais facilmente a própria voz do que uma voz estranha.
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Enquanto meditações tradicionais usam vozes de terceiros (que o cérebro filtra e resiste), 
                o método A.X.I.O. utiliza o reconhecimento vocal nativo do sistema límbico para 
                acelerar a ressignificação em até 3x mais rápido.
              </p>

              <p className="text-sm text-primary font-semibold">
                "A mente não discute consigo mesma — ela obedece."
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
              Começar Diagnóstico Gratuito — Mãe
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
