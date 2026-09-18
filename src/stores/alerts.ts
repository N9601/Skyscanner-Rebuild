import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PriceAlert } from "@/types";

interface AlertState {
  alerts: PriceAlert[];
  add: (alert: Omit<PriceAlert, "id" | "createdAt">) => void;
  remove: (id: string) => void;
}

export const useAlerts = create<AlertState>()(
  persist(
    (set) => ({
      alerts: [],
      add: (alert) =>
        set((s) => ({
          alerts: [
            ...s.alerts,
            { ...alert, id: `al-${Date.now()}`, createdAt: Date.now() },
          ],
        })),
      remove: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
    }),
    { name: "akashavani-alerts" },
  ),
);
