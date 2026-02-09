import { ArrowLeft, Brain, Mic, FileText, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MeditationStructure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-gradient-cyan font-bold text-lg">A.X.I.O.</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Moon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">O Método</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Estrutura da Meditação <span className="text-gradient-cyan">A.X.I.O.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Entenda cada etapa do processo de reprogramação quântica do seu inconsciente de origem.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-secondary/30 border border-border rounded-xl p-5">
            <h3 className="text-base font-bold text-foreground mb-2">1. Acesso ao Subconsciente</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Serve para acalmar a mente e baixar a guarda do subconsciente. É o contato com o lugar onde tudo está guardado: medos, sonhos e traumas. Sem isso, a mente racional bloqueia o acesso à cura.
            </p>
          </div>

          <div className="bg-secondary/30 border border-border rounded-xl p-5">
            <h3 className="text-base font-bold text-foreground mb-2">2. Validação Somática e Reconhecimento</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reconhecer e validar as dores e traumas sem julgamentos. É olhar para a ferida e dar lugar a ela, o que permite soltar a energia que prende esses sentimentos no corpo.
            </p>
          </div>

          <div className="bg-secondary/30 border border-border rounded-xl p-5">
            <h3 className="text-base font-bold text-foreground mb-2">3. Desassociação</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Processo de libertação onde você comunica ao seu ser que aquela dor não é sua e esse sentimento não te pertence mais. É o corte das dependências físicas, emocionais e energéticas.
            </p>
          </div>

          <div className="bg-secondary/30 border border-border rounded-xl p-5">
            <h3 className="text-base font-bold text-foreground mb-2">4. Instalação de Novas Crenças</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Momento de implantar o oposto de tudo o que foi desassociado, ocupando o espaço com novas verdades de segurança e prosperidade.
            </p>
          </div>

          <div className="bg-secondary/30 border border-border rounded-xl p-5">
            <h3 className="text-base font-bold text-foreground mb-2">5. Gratidão Sistêmica</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Agradecimento profundo ao corpo, órgãos e células para selar a cura no físico.
            </p>
          </div>

          {/* Gravar com a própria voz - merged content */}
          <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-5">
            <h3 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Gravar com a Própria Voz
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Esta é a inovação criada pelo fundador do A.X.I.O.: você grava a meditação com comandos quânticos <strong className="text-foreground">com a sua própria voz</strong>.
            </p>
            <div className="bg-secondary/30 rounded-lg p-4 mb-3">
              <p className="text-sm text-foreground font-medium leading-relaxed">
                Isso burla as defesas do cérebro — o fator crítico da mente — porque o subconsciente aceita muito mais facilmente a própria voz do que uma voz estranha. O nosso corpo reconhece nossa própria voz como autoridade máxima, e isso é a parte principal do processo.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              A meditação é montada para ser ouvida à noite, enquanto você dorme, reprogramando sua mente durante o estado de maior receptividade do subconsciente.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enquanto meditações tradicionais usam vozes de terceiros (que o cérebro filtra e resiste), o método A.X.I.O. utiliza o reconhecimento vocal nativo do sistema límbico para acelerar a ressignificação em até <strong className="text-foreground">3x mais rápido</strong>.
            </p>
            <p className="text-xs text-primary font-semibold mt-4 text-center">
              "A mente não discute consigo mesma — ela obedece."
            </p>
          </div>

          {/* Escrita Manual */}
          <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-5">
            <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Escrita Manual
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Redigir a meditação em uma folha é parte vital da limpeza emocional, fortalecendo o córtex pré-frontal para organizar o processo de cura.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="cyan" size="lg" onClick={() => navigate("/recording?area=mae")}>
            <Mic className="h-5 w-5" />
            Iniciar Diagnóstico
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeditationStructure;
