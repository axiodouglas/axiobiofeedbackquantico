import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks whether the logged-in user has already consumed their
 * single free diagnosis (area "mae").
 * Respects the free_diagnosis_reset_at timestamp — diagnoses created
 * before that date are ignored (user gets a fresh free diagnosis).
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
      // First get the reset timestamp from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("free_diagnosis_reset_at")
        .eq("user_id", userId)
        .single();

      let query = supabase
        .from("diagnoses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("area", "mae");

      // Only count diagnoses created after the reset date
      if (profile?.free_diagnosis_reset_at) {
        query = query.gt("created_at", profile.free_diagnosis_reset_at);
      }

      const { count } = await query;
      setUsed((count ?? 0) > 0);
      setLoading(false);
    };

    check();
  }, [userId]);

  return { freeDiagnosisUsed: used, loading };
}
