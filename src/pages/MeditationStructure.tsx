import { ArrowLeft, Brain, Mic, FileText, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MeditationStructure = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: "Escrita Manual",
      icon: <FileText className="h-5 w-5" />,
      description:
        "Redigir a meditação em uma folha é parte vital da limpeza emocional, fortalecendo o córtex pré-frontal para organizar o processo de cura. Escrever à mão ativa áreas cerebrais ligadas à memória e intenção, preparando o terreno para a reprogramação.",
    },
    {
      number: 2,
      title: "Gravar com a Própria Voz",
      icon: <Mic className="h-5 w-5" />,
      description:
        "Esta é a inovação criada pelo fundador do A.X.I.O.: você grava a meditação com comandos quânticos com a sua própria voz. Isso burla as defesas do cérebro — o fator crítico da mente — porque o subconsciente aceita muito mais facilmente a própria voz do que uma voz estranha. O nosso corpo reconhece nossa própria voz como autoridade máxima.",
      highlight:
        "A meditação é montada para ser ouvida à noite, enquanto você dorme, reprogramando sua mente durante o estado de maior receptividade do subconsciente. Acelera a ressignificação em até 3x mais rápido.",
      quote: '"A mente não discute consigo mesma — ela obedece."',
    },
    {
      number: 3,
      title: "Acesso ao Subconsciente",
      icon: <Brain className="h-5 w-5" />,
      description:
        "Serve para acalmar a mente e baixar a guarda do subconsciente. É o contato com o lugar onde tudo está guardado: medos, sonhos e traumas. Sem isso, a mente racional bloqueia o acesso à cura.",
    },
    {
      number: 4,
      title: "Validação Somática e Reconhecimento",
      icon: <Sparkles className="h-5 w-5" />,
      description:
        "Reconhecer e validar as dores e traumas sem julgamentos. É olhar para a ferida e dar lugar a ela, o que permite soltar a energia que prende esses sentimentos no corpo.",
    },
    {
      number: 5,
      title: "Desassociação",
      icon: <Sparkles className="h-5 w-5" />,
      description:
        "Processo de libertação onde você comunica ao seu ser que aquela dor não é sua e esse sentimento não te pertence mais. É o corte das dependências físicas, emocionais e energéticas.",
    },
    {
      number: 6,
      title: "Instalação de Novas Crenças",
      icon: <Sparkles className="h-5 w-5" />,
      description:
        "Momento de implantar o oposto de tudo o que foi desassociado, ocupando o espaço com novas verdades de segurança e prosperidade.",
    },
    {
      number: 7,
      title: "Gratidão Sistêmica",
      icon: <Sparkles className="h-5 w-5" />,
      description:
        "Agradecimento profundo ao corpo, órgãos e células para selar a cura no físico.",
    },
  ];

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
          <p className="text-muted-foreground max-w-xl mx-auto mb-4">
            Entenda cada etapa do processo de reprogramação quântica do seu inconsciente de origem.
          </p>
          <div className="bg-card border border-primary/20 rounded-xl p-4 max-w-xl mx-auto">
            <p className="text-sm text-foreground leading-relaxed">
              O método foi dividido em <strong className="text-primary">7 etapas</strong> cuidadosamente estruturadas. 
              As duas primeiras — <strong className="text-primary">escrita manual</strong> e <strong className="text-primary">gravação com a própria voz</strong> — 
              são a preparação essencial. As cinco seguintes compõem o roteiro da meditação que será gravada e ouvida durante o sono.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-card border border-border rounded-xl p-5 transition-all hover:border-primary/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-sm">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                    {step.icon}
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {step.highlight && (
                    <div className="mt-3 bg-primary/5 border border-primary/15 rounded-lg p-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {step.highlight}
                      </p>
                    </div>
                  )}
                  {step.quote && (
                    <p className="text-xs text-primary font-semibold mt-3 italic text-center">
                      {step.quote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
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
