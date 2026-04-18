import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_STATUS_CACHE_PREFIX = "admin-status:";
const ADMIN_CHECK_TIMEOUT_MS = 1500;

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
        const cacheKey = `${ADMIN_STATUS_CACHE_PREFIX}${userId}`;
        const cachedValue = sessionStorage.getItem(cacheKey);

        if (cachedValue !== null) {
          setIsAdmin(cachedValue === "true");
          setLoading(false);
          return;
        }

        const roleCheck = supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .limit(1);

        const timeout = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("admin-check-timeout")), ADMIN_CHECK_TIMEOUT_MS);
        });

        const { data, error } = await Promise.race([roleCheck, timeout]);

        if (cancelled) return;

        if (error) {
          console.error("[useAdminStatus] role check error", error);
          setIsAdmin(false);
          return;
        }

        const nextIsAdmin = (data?.length ?? 0) > 0;
        sessionStorage.setItem(cacheKey, String(nextIsAdmin));
        setIsAdmin(nextIsAdmin);
      } catch (error) {
        if (!cancelled) {
          console.error("[useAdminStatus] unexpected role check error", error);
          sessionStorage.setItem(`${ADMIN_STATUS_CACHE_PREFIX}${userId}`, "false");
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