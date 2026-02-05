import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Brain, Lock, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockDiagnostics: Record<string, { title: string; blocks: { name: string; description: string; origin: string }[]; summary: string }> = {
  financeiro: {
    title: "Diagnóstico da Área Financeira",
    blocks: [
      {
        name: "Crença de Escassez Hereditária",
        description: "Identificamos um padrão de pensamento de escassez que foi transmitido através de gerações na sua linhagem familiar. Frases como 'dinheiro não dá em árvore' ou 'rico é tudo desonesto' criaram uma programação neural que associa abundância a algo negativo.",
        origin: "Origem: Linhagem paterna, provavelmente avós ou bisavós que passaram por períodos de grande dificuldade financeira.",
      },
      {
        name: "Bloqueio de Merecimento",
        description: "Sua fala revela um conflito interno entre desejar prosperidade e sentir-se merecedor dela. Existe uma programação inconsciente que sabota suas conquistas financeiras através de comportamentos auto-destrutivos com dinheiro.",
        origin: "Origem: Dinâmica familiar onde o sucesso era visto com inveja ou desconfiança.",
      },
      {
        name: "Padrão de Autossabotagem",
        description: "Detectamos ciclos repetitivos onde você se aproxima de uma conquista financeira e, inconscientemente, cria situações que a afastam. Isso está conectado a uma lealdade invisível à sua história familiar.",
        origin: "Origem: Identificação inconsciente com figuras familiares que fracassaram financeiramente.",
      },
    ],
    summary: "Sua frequência vibracional atual indica um campo energético comprometido por padrões hereditários de escassez. A análise revelou 3 bloqueios principais que estão impedindo o fluxo natural de abundância em sua vida.",
  },
  relacionamento: {
    title: "Diagnóstico da Área de Relacionamento",
    blocks: [
      {
        name: "Padrão de Abandono",
        description: "Identificamos um medo profundo de abandono que gera comportamentos de controle ou distanciamento emocional nos relacionamentos.",
        origin: "Origem: Experiências da primeira infância relacionadas à figura materna ou paterna.",
      },
    ],
    summary: "Seus padrões de relacionamento estão sendo influenciados por traumas não resolvidos da linhagem familiar.",
  },
  saude: {
    title: "Diagnóstico da Área de Saúde",
    blocks: [
      {
        name: "Somatização Emocional",
        description: "Emoções não processadas estão se manifestando como sintomas físicos em seu corpo.",
        origin: "Origem: Padrão familiar de repressão emocional.",
      },
    ],
    summary: "Sua saúde física está sendo impactada por bloqueios emocionais hereditários.",
  },
  familiar: {
    title: "Diagnóstico da Área Familiar",
    blocks: [
      {
        name: "Emaranhamento Sistêmico",
        description: "Você está carregando emoções e destinos que não são seus, mas de membros anteriores da família.",
        origin: "Origem: Exclusões ou traumas não reconhecidos no sistema familiar.",
      },
    ],
    summary: "O campo familiar revela dinâmicas que estão afetando sua vida atual.",
  },
};

const Report = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area") || "financeiro";
  
  const diagnostic = mockDiagnostics[area] || mockDiagnostics.financeiro;

  return (
    <div className="min-h-screen bg-background noise">
      {/* Header */}
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </header>

      {/* Report Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Report Header */}
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Relatório A.X.I.O.</span>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {diagnostic.title}
            </h1>
            
            <p className="text-muted-foreground">
              {diagnostic.summary}
            </p>
          </div>

          {/* Frequency Indicator */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Frequência Vibracional Atual</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Abaixo do ideal</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-destructive via-yellow-500 to-primary h-4 rounded-full"
                style={{ width: "35%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Baixa</span>
              <span>Média</span>
              <span>Alta</span>
            </div>
          </div>

          {/* Blocks Identified */}
          <div className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Bloqueios Identificados
            </h2>

            {diagnostic.blocks.map((block, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {index + 1}. {block.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {block.description}
                </p>
                <p className="text-sm text-primary/80 italic">
                  {block.origin}
                </p>
              </div>
            ))}
          </div>

          {/* CTA - Premium Unlock */}
          <div className="bg-gradient-to-br from-primary/20 via-card to-card border-2 border-primary/50 rounded-2xl p-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
              <Lock className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">
              Acesse Seu Comando A.X.I.O. de Cura
            </h2>

            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Para <strong className="text-foreground">reprogramar sua mente antes de dormir</strong>, 
              receber orientações sobre como <strong className="text-foreground">perdoar padrões familiares</strong> e 
              <strong className="text-foreground"> mudar sua visão sobre o dinheiro</strong>, 
              assine o <span className="text-primary font-semibold">Plano Premium</span>.
            </p>

            <div className="bg-card/50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-foreground mb-2">O que você vai receber:</h4>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Comandos de Reprogramação Quântica personalizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Meditações guiadas para cura hereditária</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Acompanhamento evolutivo da sua frequência</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Acesso às 4 áreas de diagnóstico</span>
                </li>
              </ul>
            </div>

            <Button 
              variant="premium" 
              size="xl" 
              onClick={() => navigate("/checkout")}
              className="w-full sm:w-auto"
            >
              <Sparkles className="h-5 w-5" />
              Desbloquear Cura Completa
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              A partir de R$ 19,90/mês • Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
