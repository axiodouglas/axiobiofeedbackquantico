import { useState, useEffect } from "react";
import { X, ArrowUpRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const BANNER_DISMISSED_KEY = "axio_onboarding_banner_dismissed";

const OnboardingBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user && !localStorage.getItem(BANNER_DISMISSED_KEY)) {
      setVisible(true);
    }
  }, [user]);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-card via-card/95 to-card border-b border-primary/20 py-2.5 px-4 animate-fade-in">
      <div className="container mx-auto flex items-center justify-end gap-2 text-sm pr-16">
        <span className="text-foreground/80 flex items-center gap-1.5">
          Acesse seu Relatório no <User className="h-3.5 w-3.5 text-primary inline" />
        </span>
        <button
          onClick={() => { navigate("/profile"); dismiss(); }}
          className="text-primary font-semibold hover:underline flex items-center gap-1"
        >
          Ver agora
        </button>
        <ArrowUpRight className="h-4 w-4 text-primary animate-bounce" />
        <button
          onClick={dismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingBanner;
