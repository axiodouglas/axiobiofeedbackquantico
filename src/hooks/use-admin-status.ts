import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStatus = (userId?: string) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(Boolean(userId));

  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin");

      if (cancelled) return;

      if (error) {
        console.error("[useAdminStatus] role check error", error);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin((data?.length ?? 0) > 0);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { isAdmin, loading };
};