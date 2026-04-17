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
      try {
        const roleCheck = supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin");

        const timeout = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("admin-check-timeout")), 4000);
        });

        const { data, error } = await Promise.race([roleCheck, timeout]);

        if (cancelled) return;

        if (error) {
          console.error("[useAdminStatus] role check error", error);
          setIsAdmin(false);
          return;
        }

        setIsAdmin((data?.length ?? 0) > 0);
      } catch (error) {
        if (!cancelled) {
          console.error("[useAdminStatus] unexpected role check error", error);
          setIsAdmin(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { isAdmin, loading };
};