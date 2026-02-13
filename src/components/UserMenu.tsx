import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, User, Crown, HelpCircle, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import BugReportModalSafe from "@/components/BugReportModalSafe";

const UserMenu = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [bugReportOpen, setBugReportOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/planos")} className="text-muted-foreground hover:text-primary transition-colors p-1">
          <Crown className="h-4 w-4" />
        </button>
        <button onClick={() => navigate("/faq")} className="text-muted-foreground hover:text-primary transition-colors p-1">
          <HelpCircle className="h-4 w-4" />
        </button>
        <Button variant="cyanOutline" size="sm" onClick={() => navigate("/auth")} className="gap-1 text-xs px-2.5 py-1 h-7">
          <LogIn className="h-3 w-3" />
          Entrar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => navigate("/planos")} className="text-muted-foreground hover:text-primary transition-colors p-1">
        <Crown className="h-4 w-4" />
      </button>
      <button onClick={() => navigate("/faq")} className="text-muted-foreground hover:text-primary transition-colors p-1">
        <HelpCircle className="h-4 w-4" />
      </button>
      {isAdmin && (
        <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-primary transition-colors p-1" title="Admin">
          <Shield className="h-4 w-4" />
        </button>
      )}
      <button onClick={() => setBugReportOpen(true)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title="Relatar erro">
        <AlertCircle className="h-4 w-4" />
      </button>
      <BugReportModalSafe open={bugReportOpen} onOpenChange={setBugReportOpen} />
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
