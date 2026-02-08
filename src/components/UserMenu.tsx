import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const UserMenu = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (!user) {
    return (
      <Button variant="cyanOutline" size="sm" onClick={() => navigate("/auth")} className="gap-2">
        <LogIn className="h-4 w-4" />
        Entrar
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {profile?.is_premium && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          Premium
        </span>
      )}
      <div
        className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        onClick={() => navigate("/profile")}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline max-w-[120px] truncate">
          {profile?.full_name || user.email?.split("@")[0]}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await signOut();
          navigate("/");
        }}
        className="gap-1 text-muted-foreground hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sair</span>
      </Button>
    </div>
  );
};

export default UserMenu;
