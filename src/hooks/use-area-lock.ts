import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";

interface AreaLockInfo {
  locked: boolean;
  daysRemaining: number;
}

interface AreaLockState {
  lockedAreas: Record<string, AreaLockInfo>;
  loading: boolean;
}

export function useAreaLock(userId: string | undefined): AreaLockState {
  const [state, setState] = useState<AreaLockState>({
    lockedAreas: {},
    loading: true,
  });

  useEffect(() => {
    if (!userId) {
      setState({ lockedAreas: {}, loading: false });
      return;
    }

    supabase
      .from("diagnoses")
      .select("area, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const locks: Record<string, AreaLockInfo> = {};
        const areas = ["pai", "mae", "traumas", "relacionamento"];

        areas.forEach((area) => {
          const latest = data?.find((d) => d.area === area);
          if (latest) {
            const daysSince = differenceInDays(new Date(), new Date(latest.created_at));
            if (daysSince < 7) {
              locks[area] = { locked: true, daysRemaining: 7 - daysSince };
            }
          }
        });

        setState({ lockedAreas: locks, loading: false });
      });
  }, [userId]);

  return state;
}
