import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

const ProtectedRoute = ({ children, requirePremium = false }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requirePremium && !profile?.is_premium) {
    return <Navigate to="/checkout" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
