import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
  requireFullPlan?: boolean;
}

const ProtectedRoute = ({ children, requirePremium = false, requireFullPlan = false }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if ((!requirePremium && !requireFullPlan) || !user) { setIsAdmin(false); return; }
    const check = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    check();
  }, [user, requirePremium, requireFullPlan]);

  if (loading || ((requirePremium || requireFullPlan) && isAdmin === null)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if ((requirePremium || requireFullPlan) && profile === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  const isPremium = profile?.is_premium && (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());
  const isFullAccess = isPremium && (profile?.subscription_type === "trimestral" || profile?.subscription_type === "semestral");

  if (requireFullPlan && !isFullAccess && !isAdmin) {
    return <Navigate to="/planos" replace />;
  }

  if (requirePremium && !isPremium && !isAdmin) {
    return <Navigate to="/planos" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
