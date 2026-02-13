import { useState, useEffect } from "react";
import { X, ArrowUp, User } from "lucide-react";
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
    <div className="relative w-full rounded-xl bg-card/80 border border-primary/20 py-2.5 px-4 mb-6 animate-fade-in backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-foreground/80 flex items-center gap-1.5">
          Acesse seu Relatório no <User className="h-4 w-4 text-primary" />
        </span>
        <button
          onClick={() => { navigate("/profile"); dismiss(); }}
          className="text-primary font-semibold hover:underline flex items-center gap-1"
        >
          Ver agora
          <ArrowUp className="h-3.5 w-3.5 animate-bounce" />
        </button>
        <button
          onClick={dismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingBanner;
