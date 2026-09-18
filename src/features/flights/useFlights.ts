import { useQuery } from "@tanstack/react-query";
import { fetchFlights, fetchMonthPrices, fetchPriceCalendar } from "@/lib/mockApi";
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

export function useMonthPrices(q: SearchQuery, enabled: boolean) {
  const month = q.depart.slice(0, 7);
  return useQuery({
    queryKey: ["month-prices", q.from, q.to, month],
    queryFn: () => fetchMonthPrices(q),
    enabled: enabled && Boolean(q.from && q.to),
  });
}
