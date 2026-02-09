import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";

interface AreaLockState {
  lockedAreas: string[];
  activeArea: string | null;
  daysRemaining: number;
  loading: boolean;
}

export function useAreaLock(userId: string | undefined): AreaLockState {
  const [state, setState] = useState<AreaLockState>({
    lockedAreas: [],
    activeArea: null,
    daysRemaining: 0,
    loading: true,
  });

  useEffect(() => {
    if (!userId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    supabase
      .from("diagnoses")
      .select("area, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const latest = data[0];
          const daysSince = differenceInDays(new Date(), new Date(latest.created_at));

          if (daysSince < 7) {
            const allAreas = ["pai", "mae", "traumas", "relacionamento"];
            const locked = allAreas.filter((a) => a !== latest.area);
            setState({
              lockedAreas: locked,
              activeArea: latest.area,
              daysRemaining: 7 - daysSince,
              loading: false,
            });
            return;
          }
        }
        setState({ lockedAreas: [], activeArea: null, daysRemaining: 0, loading: false });
      });
  }, [userId]);

  return state;
}
