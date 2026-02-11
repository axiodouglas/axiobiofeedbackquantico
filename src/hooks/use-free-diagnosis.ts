import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks whether the logged-in user has already consumed their
 * single free diagnosis (area "mae").
 */
export function useFreeDiagnosisUsed(userId: string | undefined) {
  const [used, setUsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const check = async () => {
      const { count } = await supabase
        .from("diagnoses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("area", "mae");

      setUsed((count ?? 0) > 0);
      setLoading(false);
    };

    check();
  }, [userId]);

  return { freeDiagnosisUsed: used, loading };
}
