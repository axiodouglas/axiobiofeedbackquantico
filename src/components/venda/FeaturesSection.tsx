import {
  Mic,
  Brain,
  MessageCircle,
  BarChart3,
  Users,
  Music,
  FileText,
  Activity,
  Zap,
  Heart,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    tag: "Diagnóstico",
    title: "Biofeedback de Áudio por IA",
    description:
      "Grave sua voz falando sobre o que sente. Nossa IA analisa frequências, micro-hesitações, entonação e padrões emocionais invisíveis para revelar as crenças limitantes ocultas no seu subconsciente — padrões que você repete sem perceber.",
  },
  {
    icon: FileText,
    tag: "Relatório Completo",
    title: "Relatório de Crenças Limitantes",
    description:
      "Após a análise do áudio, o app gera um relatório detalhado e personalizado. Ele revela o sentimento predominante, os bloqueios emocionais identificados, os impactos na sua vida (saúde, relacionamentos, prosperidade) e sugestões de reprogramação.",
  },
  {
    icon: Heart,
    tag: "Mapa Corporal",
    title: "Mapa de Somatização",
    description:
      "Visualize onde as emoções e crenças estão se manifestando no seu corpo. O mapa de somatização mostra os pontos de tensão e dor emocional acumulada, ajudando você a entender a conexão mente-corpo.",
  },
  {
    icon: Zap,
    tag: "Comandos Quânticos",
    title: "Comandos de Reprogramação Semanal",
    description:
      "Baseado no seu diagnóstico, o AXIO gera comandos personalizados para reprogramar cada crença identificada. São frases de poder divididas por período do dia (manhã, tarde e noite) para você repetir como um ritual diário.",
  },
  {
    icon: Music,
    tag: "Inovação AXIO",
    title: "Meditação com Sua Própria Voz",
    description:
      "Esta é a grande inovação do método. O app gera um roteiro de meditação personalizado baseado nas suas crenças limitantes. Você grava o roteiro com sua própria voz e ouve em loop enquanto dorme — porque o subconsciente reconhece e obedece a voz do seu dono.",
  },
  {
    icon: MessageCircle,
    tag: "Oráculo AXIO",
    title: "Oráculo para Dúvidas Profundas",
    description:
      "Um conselheiro inteligente treinado em PNL, Neurociência e Física Quântica. Ele conhece seus diagnósticos e ajuda você a entender suas crenças limitantes, responder dúvidas sobre padrões emocionais e guiar sua jornada de autoconhecimento.",
  },
  {
    icon: Activity,
    tag: "Conselheiro",
    title: "Conselheiro de Performance",
    description:
      "Grave um áudio rápido sobre qualquer decisão importante. O conselheiro mede sua energia e frequência emocional naquele momento e te dá um parecer se você está em estado de clareza ou sob influência de crenças limitantes para tomar a decisão.",
  },
  {
    icon: BarChart3,
    tag: "Gráficos",
    title: "Gráficos de Evolução Emocional",
    description:
      "Acompanhe sua evolução semana a semana com gráficos visuais. Veja quais sentimentos predominam, como sua frequência emocional está mudando ao longo do tempo e o progresso da reprogramação das suas crenças.",
  },
  {
    icon: TrendingUp,
    tag: "Escala Hawkins",
    title: "Escala de Consciência de Hawkins",
    description:
      "Cada diagnóstico posiciona você na Escala de Hawkins — um mapa de frequência emocional que vai de vergonha e medo até paz e iluminação. Acompanhe sua ascensão de frequência ao longo da jornada.",
  },
  {
    icon: Users,
    tag: "Comunidade",
    title: "Comunidade AXIO",
    description:
      "Compartilhe sua jornada, leia depoimentos inspiradores e encontre motivação nos relatos de outras pessoas que estão se libertando das suas crenças limitantes. Um espaço seguro de troca e crescimento coletivo.",
  },
];

const FeaturesSection = () => (
  <section className="relative z-10 py-14 sm:py-24 px-4 sm:px-6">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 sm:px-5 py-1.5 sm:py-2 mb-5">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-gradient-brand tracking-wide">
            FUNCIONALIDADES
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 px-2">
          Tudo que o <span className="text-gradient-brand">A.X.I.O.</span> faz
          por você
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
          Um ecossistema completo para identificar, entender e reprogramar as
          crenças limitantes que travam sua vida.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className={`card-glow rounded-2xl p-5 sm:p-7 flex flex-col gap-3 sm:gap-4 group hover:scale-[1.02] transition-transform duration-300 ${
              i === features.length - 1 && features.length % 2 !== 0
                ? "sm:col-span-2 sm:max-w-lg sm:mx-auto"
                : ""
            }`}
          >
            {/* Icon + Tag */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_25px_hsl(175,70%,50%,0.3)] transition-shadow">
                <f.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gradient-brand">
                {f.tag}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {f.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
