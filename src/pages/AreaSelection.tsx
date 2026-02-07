import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const freeAreas = [
  {
    id: "pai",
    title: "Pai",
    description: "Descubra os bloqueios relacionados ao Pai.",
    icon: <UserCheck className="h-8 w-8" />,
    iconColor: "bg-primary/20 text-primary",
  },
  {
    id: "mae",
    title: "Mãe",
    description: "Descubra os bloqueios relacionados à Mãe.",
    icon: <Heart className="h-8 w-8" />,
    iconColor: "bg-axio-relationship/20 text-axio-relationship",
  },
];

const AreaSelection = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold mb-2 text-foreground">Escolha a Área</h1>
          <p className="text-muted-foreground mb-8">
            Selecione sobre qual área você deseja gravar seu áudio de diagnóstico gratuito.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {freeAreas.map((area) => (
              <div
                key={area.id}
                onClick={() => navigate(`/recording?area=${area.id}`)}
                className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all duration-300 cursor-pointer hover:border-primary/60 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.2)]"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${area.iconColor} transition-transform group-hover:scale-110`}>
                    {area.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-foreground">{area.title}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                      Gratuito
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaSelection;
