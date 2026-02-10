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
  // DEV MODE: All locks disabled for testing — no 7-day wait
  return { lockedAreas: {}, loading: false };
}
