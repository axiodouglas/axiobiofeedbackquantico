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

const LOCK_DAYS = 21;

export function useAreaLock(userId: string | undefined, isAdmin: boolean = false): AreaLockState {
  const [lockedAreas, setLockedAreas] = useState<Record<string, AreaLockInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      setLockedAreas({});
      setLoading(false);
      return;
    }

    if (!userId) {
      setLoading(false);
      return;
    }

    const check = async () => {
      const { data: diagnoses } = await supabase
        .from("diagnoses")
        .select("area, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!diagnoses || diagnoses.length === 0) {
        setLockedAreas({});
        setLoading(false);
        return;
      }

      const areas = ["mae", "pai", "traumas", "relacionamento", "crencas_limitantes"];
      const locks: Record<string, AreaLockInfo> = {};

      for (const area of areas) {
        const latest = diagnoses.find((d) => d.area === area);
        if (latest) {
          const daysSince = differenceInDays(new Date(), new Date(latest.created_at));
          if (daysSince < LOCK_DAYS) {
            locks[area] = {
              locked: true,
              daysRemaining: LOCK_DAYS - daysSince,
            };
          }
        }
      }

      setLockedAreas(locks);
      setLoading(false);
    };

    check();
  }, [userId, isAdmin]);

  return { lockedAreas, loading };
}
