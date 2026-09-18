import { supabase } from "@/lib/supabase";
import { useTrips } from "@/stores/trips";
import { useAlerts } from "@/stores/alerts";

let unsubTrips: (() => void) | null = null;
let unsubAlerts: (() => void) | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let applyingRemote = false;

export async function pullUserData(userId: string): Promise<void> {
  if (!supabase) return;
  const { data, error } = await supabase
    .from("user_data")
    .select("trips, alerts")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return;
  applyingRemote = true;
  try {
    if (Array.isArray(data.trips)) useTrips.setState({ items: data.trips });
    if (Array.isArray(data.alerts)) useAlerts.setState({ alerts: data.alerts });
  } finally {
    applyingRemote = false;
  }
}

function schedulePush(userId: string) {
  if (applyingRemote) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    if (!supabase) return;
    await supabase.from("user_data").upsert({
      user_id: userId,
      trips: useTrips.getState().items,
      alerts: useAlerts.getState().alerts,
      updated_at: new Date().toISOString(),
    });
  }, 800);
}

export function startSync(userId: string): void {
  stopSync();
  unsubTrips = useTrips.subscribe(() => schedulePush(userId));
  unsubAlerts = useAlerts.subscribe(() => schedulePush(userId));
  schedulePush(userId);
}

export function stopSync(): void {
  unsubTrips?.();
  unsubAlerts?.();
  unsubTrips = null;
  unsubAlerts = null;
  if (pushTimer) clearTimeout(pushTimer);
}
