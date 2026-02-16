import { ArrowUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const OnboardingBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="relative w-full rounded-xl bg-card/80 border border-primary/20 py-2.5 px-4 mb-6 animate-fade-in backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-foreground/80 flex items-center gap-1.5">
          Acesse seu Relatório no <User className="h-4 w-4 text-primary" />
        </span>
        <button
          onClick={() => navigate("/profile")}
          className="text-primary font-semibold hover:underline flex items-center gap-1"
        >
          Ver agora
          <ArrowUp className="h-3.5 w-3.5 animate-bounce" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingBanner;
