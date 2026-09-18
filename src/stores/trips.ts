import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TripItem } from "@/types";

interface TripState {
  items: TripItem[];
  add: (item: Omit<TripItem, "addedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useTrips = create<TripState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) =>
          s.items.some((i) => i.id === item.id)
            ? s
            : { items: [...s.items, { ...item, addedAt: Date.now() }] },
        ),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "akashavani-trips" },
  ),
);
