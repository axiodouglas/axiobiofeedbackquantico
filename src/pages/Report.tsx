import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Brain, Lock, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";
import type { DiagnosisResult } from "@/hooks/use-axio-analysis";

const mockDiagnostics: Record<string, { title: string; blocks: { name: string; description: string; origin: string }[]; summary: string }> = {
  pai: {
    title: "Diagnóstico da Área Pai",
    blocks: [
      {
        name: "Padrão de Autoridade Reprimida",
        description: "Identificamos um padrão onde a figura paterna exerceu autoridade excessiva ou ausente, criando um conflito interno entre submissão e rebeldia que afeta suas decisões.",
        origin: "Origem: Linhagem paterna, dinâmica de controle ou abandono emocional.",
      },
      {
        name: "Bloqueio de Reconhecimento",
        description: "Sua fala revela uma busca constante por validação externa, conectada à falta de aprovação da figura paterna. Esse padrão se reflete em insegurança profissional e pessoal.",
        origin: "Origem: Ausência de reconhecimento emocional na infância.",
      },
      {
        name: "Lealdade Invisível ao Fracasso",
        description: "Detectamos uma identificação inconsciente com limitações do pai, criando uma lealdade invisível que sabota seu crescimento para não 'superar' a figura paterna.",
        origin: "Origem: Dinâmica sistêmica de pertencimento familiar.",
      },
    ],
    summary: "A análise revelou 3 bloqueios principais relacionados à linhagem paterna que estão influenciando seus padrões de comportamento e decisão.",
  },
  mae: {
    title: "Diagnóstico da Área Mãe",
    blocks: [
      {
        name: "Padrão de Proteção Excessiva",
        description: "Identificamos um padrão de superproteção materna que gerou dificuldade em lidar com situações de risco e tomada de decisão independente.",
        origin: "Origem: Medo materno transmitido de forma inconsciente na criação.",
      },
      {
        name: "Bloqueio de Autonomia Emocional",
        description: "Sua fala revela dependência emocional conectada ao vínculo materno, gerando dificuldade em estabelecer limites saudáveis nos relacionamentos.",
        origin: "Origem: Fusão emocional com a figura materna na primeira infância.",
      },
    ],
    summary: "A análise revelou 2 bloqueios principais relacionados à linhagem materna que estão afetando sua autonomia emocional.",
  },
  financeiro: {
    title: "Diagnóstico da Área Financeira",
    blocks: [
      {
        name: "Crença de Escassez Hereditária",
        description: "Identificamos um padrão de pensamento de escassez que foi transmitido através de gerações. Frases como 'dinheiro não dá em árvore' criaram uma programação neural que associa abundância a algo negativo.",
        origin: "Origem: Linhagem paterna, gerações que passaram por dificuldade financeira.",
      },
      {
        name: "Bloqueio de Merecimento",
        description: "Existe uma programação inconsciente que sabota suas conquistas financeiras através de comportamentos auto-destrutivos com dinheiro.",
        origin: "Origem: Dinâmica familiar onde o sucesso era visto com desconfiança.",
      },
      {
        name: "Padrão de Autossabotagem",
        description: "Detectamos ciclos repetitivos onde você se aproxima de uma conquista financeira e, inconscientemente, cria situações que a afastam.",
        origin: "Origem: Identificação inconsciente com figuras familiares que fracassaram financeiramente.",
      },
    ],
    summary: "Sua frequência vibracional indica um campo comprometido por padrões hereditários de escassez. A análise revelou 3 bloqueios principais.",
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
  ansiedade: {
    title: "Diagnóstico da Área de Ansiedade",
    blocks: [
      {
        name: "Hipervigilância Herdada",
        description: "Identificamos um estado constante de alerta que foi transmitido por gerações, mantendo seu sistema nervoso em modo de sobrevivência.",
        origin: "Origem: Ancestrais que viveram em ambientes de instabilidade e perigo.",
      },
    ],
    summary: "Seus padrões de ansiedade têm raízes profundas na história familiar.",
  },
  medo: {
    title: "Diagnóstico da Área de Medo",
    blocks: [
      {
        name: "Medo de Exposição",
        description: "Detectamos um medo profundo de ser visto e julgado, conectado a experiências de humilhação ou rejeição na linhagem familiar.",
        origin: "Origem: Eventos traumáticos de exposição social em gerações anteriores.",
      },
    ],
    summary: "Seus medos limitantes estão conectados a memórias transgeracionais.",
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
  const area = searchParams.get("area") || "pai";

  // Try to load AI-generated diagnosis from sessionStorage
  const aiDiagnosis = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("axio_result");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.diagnosis as DiagnosisResult;
      }
    } catch {}
    return null;
  }, []);

  const diagnostic = aiDiagnosis
    ? {
        title: aiDiagnosis.title,
        blocks: aiDiagnosis.blocks,
        summary: aiDiagnosis.summary,
        frequencyScore: aiDiagnosis.frequency_score,
        rootWound: aiDiagnosis.root_wound,
        ctaMessage: aiDiagnosis.cta_message,
      }
    : {
        ...(mockDiagnostics[area] || mockDiagnostics.pai),
        frequencyScore: 35,
        rootWound: undefined,
        ctaMessage: undefined,
      };

  return (
    <div className="min-h-screen bg-background noise">
      {/* Header */}
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </header>

      {/* Report Content - styled as a "page/image" */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Report Card - looks like a document/image */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[0_0_40px_hsl(175,70%,50%,0.1)]">
            
            {/* Wave Header */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={neuralWavesCyan}
                alt=""
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Relatório A.X.I.O.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Body */}
            <div className="px-6 sm:px-10 pb-10">
              {/* Title */}
              <div className="text-center mb-8 -mt-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  {diagnostic.title}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {diagnostic.summary}
                </p>
              </div>

              {/* Frequency Indicator */}
              <div className="bg-secondary/50 rounded-xl p-5 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">Frequência Vibracional Atual</h3>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-destructive" />
                    <span className="text-xs text-destructive">Abaixo do ideal</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-destructive via-yellow-500 to-primary h-3 rounded-full"
                    style={{ width: `${diagnostic.frequencyScore || 35}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Baixa</span>
                  <span>Média</span>
                  <span>Alta</span>
                </div>
              </div>

              {/* Blocks Identified */}
              <div className="space-y-4 mb-10">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Bloqueios Identificados
                </h2>

                {diagnostic.blocks.map((block, index) => (
                  <div 
                    key={index}
                    className="bg-secondary/30 border border-border rounded-xl p-5"
                  >
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {index + 1}. {block.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {block.description}
                    </p>
                    <p className="text-xs text-primary/80 italic">
                      {block.origin}
                    </p>
                  </div>
                ))}
              </div>

              {/* Root Wound - AI Generated */}
              {diagnostic.rootWound && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 mb-10">
                  <h3 className="font-semibold text-foreground text-sm mb-2">🔍 Ferida Raiz Identificada</h3>
                  <p className="text-sm text-muted-foreground italic">"{diagnostic.rootWound}"</p>
                </div>
              )}

              {/* CTA - Premium Unlock */}
              <div className="bg-gradient-to-br from-primary/15 via-card to-card border-2 border-primary/40 rounded-xl p-6 text-center mb-8">
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                  <Lock className="h-6 w-6 text-primary" />
                </div>

                <h2 className="text-xl font-bold text-foreground mb-3">
                  Acesse Seu Comando A.X.I.O. de Cura
                </h2>

                <p className="text-sm text-muted-foreground mb-5 max-w-xl mx-auto">
                  {diagnostic.ctaMessage || (
                    <>
                      Este diagnóstico é apenas a ponta do iceberg. Para adquirir os{" "}
                      <strong className="text-foreground">Comandos Quânticos</strong> para ressignificar sua mente
                      e ter acesso a <strong className="text-foreground">Meditações Únicas</strong> feitas
                      semanalmente, assine o <span className="text-primary font-semibold">Plano Premium</span>.
                    </>
                  )}
                </p>

                <div className="bg-secondary/30 rounded-lg p-4 mb-5">
                  <h4 className="font-semibold text-foreground mb-2 text-sm">O que você vai receber:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1.5 text-left max-w-md mx-auto">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>Comandos de Reprogramação Quântica personalizados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>Meditações guiadas para cura hereditária</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>Acompanhamento evolutivo da sua frequência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>Acesso às 4 áreas de diagnóstico</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  variant="premium" 
                  size="lg" 
                  onClick={() => navigate("/checkout")}
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-5 w-5" />
                  Desbloquear Cura Completa
                </Button>

                <p className="text-xs text-muted-foreground mt-3">
                  A partir de R$ 19,99/mês • Cancele quando quiser
                </p>
              </div>

              {/* A.X.I.O. Footer */}
              <div className="text-center border-t border-border pt-6">
                <p className="text-gradient-cyan font-bold text-xl mb-1">A.X.I.O.</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>A</strong>nálise do Fator <strong>X</strong> do <strong>I</strong>nconsciente de <strong>O</strong>rigem
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-2">
                  Sistema de Biofeedback Quântico para reprogramação de padrões limitantes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
