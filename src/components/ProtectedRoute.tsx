import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
  requireFullPlan?: boolean;
}

const ProtectedRoute = ({ children, requirePremium = false, requireFullPlan = false }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const needsAdminCheck = requirePremium || requireFullPlan;
  const { isAdmin, loading: adminLoading } = useAdminStatus(needsAdminCheck ? user?.id : undefined);

  if (loading || (needsAdminCheck && adminLoading)) {
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
