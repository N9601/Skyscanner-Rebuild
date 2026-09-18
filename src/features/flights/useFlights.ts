import { useQuery } from "@tanstack/react-query";
import { fetchFlights, fetchPriceCalendar } from "@/lib/mockApi";
import type { SearchQuery } from "@/types";

export function useFlights(q: SearchQuery) {
  return useQuery({
    queryKey: ["flights", q.from, q.to, q.depart, q.cabin, q.pax],
    queryFn: () => fetchFlights(q),
    enabled: Boolean(q.from && q.to),
  });
}

export function usePriceCalendar(q: SearchQuery) {
  return useQuery({
    queryKey: ["price-calendar", q.from, q.to, q.depart],
    queryFn: () => fetchPriceCalendar(q),
    enabled: Boolean(q.from && q.to),
  });
}
