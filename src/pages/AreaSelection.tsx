import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, UserCheck, Flame, HeartHandshake, Info, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAreaLock } from "@/hooks/use-area-lock";
import { useToast } from "@/hooks/use-toast";

const areas = [
  {
    id: "mae",
    title: "Mãe",
    description: "Descubra a raiz dos seus bloqueios na relação materna.",
    icon: <Heart className="h-8 w-8" />,
    iconColor: "bg-axio-relationship/20 text-axio-relationship",
  },
  {
    id: "pai",
    title: "Pai",
    description: "Desbloqueie a força paterna e sua capacidade de agir.",
    icon: <UserCheck className="h-8 w-8" />,
    iconColor: "bg-primary/20 text-primary",
  },
  {
    id: "traumas",
    title: "Traumas",
    description: "Bullying, acidentes, perdas e abusos externos.",
    icon: <Flame className="h-8 w-8" />,
    iconColor: "bg-axio-family/20 text-axio-family",
  },
  {
    id: "relacionamento",
    title: "Relacionamentos",
    description: "Descubra as projeções de Pai e Mãe no seu parceiro.",
    icon: <HeartHandshake className="h-8 w-8" />,
    iconColor: "bg-axio-relationship/20 text-axio-relationship",
  },
];

const AreaSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lockedAreas } = useAreaLock(user?.id);
  const { toast } = useToast();

  const handleSelect = (area: typeof areas[number]) => {
    const lock = lockedAreas[area.id];
    if (lock?.locked) {
      toast({
        title: "Diagnóstico já realizado",
        description: `Você já gravou o pilar "${area.title}". Siga o protocolo: pratique os comandos quânticos e a meditação por ${lock.daysRemaining} dia(s) restante(s) antes de refazer. Isso é essencial para a reprogramação funcionar.`,
        variant: "destructive",
      });
      return;
    }
    navigate(`/recording?area=${area.id}`);
  };

  return (
    <div className="min-h-screen bg-background noise flex flex-col">
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Escolha o Pilar</h1>
          <p className="text-muted-foreground mb-8">
            Selecione qual área deseja trabalhar agora.
          </p>

          {/* Advisory message */}
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 text-left">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Para melhores resultados, recomendamos que você pratique os <span className="font-semibold text-foreground">comandos quânticos e a meditação</span> de cada pilar por no mínimo <span className="font-semibold text-primary">7 dias</span>, ou até sentir que a crença perdeu força, antes de iniciar outro pilar.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {areas.map((area) => {
              const lock = lockedAreas[area.id];
              const isLocked = lock?.locked;

              return (
                <div
                  key={area.id}
                  onClick={() => handleSelect(area)}
                  className={`group relative overflow-hidden rounded-xl border-2 bg-card cursor-pointer p-6 transition-all duration-300 ${
                    isLocked
                      ? "border-border/50 opacity-60"
                      : "border-border hover:border-primary/60 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.2)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${area.iconColor} transition-transform group-hover:scale-110`}>
                      {isLocked ? <Lock className="h-8 w-8" /> : area.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-foreground">{area.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isLocked
                          ? `Protocolo ativo — ${lock.daysRemaining} dia(s) restante(s)`
                          : area.description}
                      </p>
                      {!isLocked && (
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                          Gratuito
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaSelection;
