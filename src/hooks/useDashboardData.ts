import { useQuery } from "@tanstack/react-query";
import { useDataSource } from "@/contexts/DataSourceContext";
import {
  fetchKpiStats,
  fetchLiveMapDrivers,
  fetchPendingApprovals,
  fetchRecentTrips,
  fetchRevenueBreakdown,
  fetchTripStatusDistribution,
  fetchTripsOverTime,
} from "@/lib/dashboardQueries";

const stale = 60_000;

export function useKpiStats() {
  const { isLive } = useDataSource();
  return useQuery({
    queryKey: ["dashboard", "kpi"],
    queryFn: fetchKpiStats,
    enabled: isLive,
    staleTime: stale,
  });
}

export function useTripsOverTime() {
  const { isLive } = useDataSource();
  return useQuery({
    queryKey: ["dashboard", "tripsOverTime"],
    queryFn: fetchTripsOverTime,
    enabled: isLive,
    staleTime: stale,
  });
}

export function useRevenueBreakdown() {
  const { isLive } = useDataSource();
  return useQuery({
    queryKey: ["dashboard", "revenueBreakdown"],
    queryFn: fetchRevenueBreakdown,
    enabled: isLive,
    staleTime: stale,
  });
}

export function useTripStatusDistribution() {
  const { isLive } = useDataSource();
  return useQuery({
    queryKey: ["dashboard", "tripStatus"],
    queryFn: fetchTripStatusDistribution,
    enabled: isLive,
    staleTime: stale,
  });
}

export function useRecentTrips() {
  const { isLive } = useDataSource();
  return useQuery({
    queryKey: ["dashboard", "recentTrips"],
    queryFn: fetchRecentTrips,
    enabled: isLive,
    staleTime: stale,
  });
}

export function usePendingApprovals() {
  const { isLive } = useDataSource();
  return useQuery({
    queryKey: ["dashboard", "pendingApprovals"],
    queryFn: fetchPendingApprovals,
    enabled: isLive,
    staleTime: stale,
  });
}

export function useLiveMapDrivers() {
  const { isLive } = useDataSource();
  return useQuery({
    queryKey: ["dashboard", "liveMap"],
    queryFn: fetchLiveMapDrivers,
    enabled: isLive,
    staleTime: 30_000,
  });
}
