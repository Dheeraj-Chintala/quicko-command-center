import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { PublicSchemaEnums } from "@/integrations/supabase/types";
import { Navigation, Car, DollarSign, Zap, type LucideIcon } from "lucide-react";

export type KpiRow = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
};

const tripStatuses: PublicSchemaEnums["trip_status"][] = [
  "requested",
  "accepted",
  "arrived",
  "ongoing",
  "completed",
  "cancelled",
];

const STATUS_PIE_COLORS: Record<string, string> = {
  requested: "hsl(0, 0%, 45%)",
  accepted: "hsl(200, 80%, 45%)",
  arrived: "hsl(260, 60%, 50%)",
  ongoing: "hsl(38, 92%, 50%)",
  completed: "hsl(145, 63%, 42%)",
  cancelled: "hsl(0, 84%, 60%)",
};

function formatInr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function shortId(uuid: string): string {
  return `T-${uuid.slice(0, 8)}`;
}

const DOC_LABELS: Record<PublicSchemaEnums["document_type"], string> = {
  dl_front: "DL Front",
  dl_back: "DL Back",
  rc_front: "RC Front",
  rc_back: "RC Back",
  aadhaar_front: "Aadhaar",
  aadhaar_back: "Aadhaar (back)",
  pan: "PAN Card",
};

export async function fetchKpiStats(): Promise<KpiRow[]> {
  const now = new Date();
  const dayStart = startOfDay(now).toISOString();
  const dayEnd = endOfDay(now).toISOString();

  const [
    totalTripsRes,
    activeDriversRes,
    ongoingRes,
    revenueRowsRes,
  ] = await Promise.all([
    supabase.from("trips").select("*", { count: "exact", head: true }),
    supabase
      .from("drivers")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .eq("duty_status", "on_duty"),
    supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .in("status", ["accepted", "arrived", "ongoing"]),
    supabase
      .from("trips")
      .select("final_fare, fare")
      .eq("status", "completed")
      .gte("completed_at", dayStart)
      .lte("completed_at", dayEnd),
  ]);

  const errs = [
    totalTripsRes.error,
    activeDriversRes.error,
    ongoingRes.error,
    revenueRowsRes.error,
  ].filter(Boolean);
  if (errs.length) {
    throw new Error(errs[0]!.message);
  }

  const revenueToday =
    revenueRowsRes.data?.reduce((sum, row) => {
      const v = row.final_fare ?? row.fare ?? 0;
      return sum + Number(v);
    }, 0) ?? 0;

  return [
    {
      label: "Total Trips",
      value: (totalTripsRes.count ?? 0).toLocaleString("en-IN"),
      change: "—",
      icon: Navigation,
      color: "bg-primary",
    },
    {
      label: "Active Drivers",
      value: String(activeDriversRes.count ?? 0),
      change: "—",
      icon: Car,
      color: "bg-primary",
    },
    {
      label: "Revenue Today",
      value: formatInr(revenueToday),
      change: "—",
      icon: DollarSign,
      color: "bg-primary",
    },
    {
      label: "Ongoing Rides",
      value: String(ongoingRes.count ?? 0),
      change: "Live",
      icon: Zap,
      color: "bg-primary",
    },
  ];
}

export type TripsOverTimePoint = { day: string; trips: number };

export async function fetchTripsOverTime(): Promise<TripsOverTimePoint[]> {
  const from = subDays(startOfDay(new Date()), 6).toISOString();
  const { data, error } = await supabase.from("trips").select("created_at").gte("created_at", from);
  if (error) throw new Error(error.message);

  const buckets = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = subDays(startOfDay(new Date()), i);
    buckets.set(format(d, "yyyy-MM-dd"), 0);
  }

  for (const row of data ?? []) {
    const key = format(new Date(row.created_at), "yyyy-MM-dd");
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([ymd, trips]) => ({
    day: format(new Date(ymd + "T12:00:00"), "EEE"),
    trips,
  }));
}

export type RevenueBreakdownRow = { method: string; amount: number };

export async function fetchRevenueBreakdown(): Promise<RevenueBreakdownRow[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("payment_method, final_fare, fare")
    .eq("status", "completed");
  if (error) throw new Error(error.message);

  const sums: Record<string, number> = { Cash: 0, UPI: 0, Wallet: 0 };
  for (const row of data ?? []) {
    const m = (row.payment_method ?? "cash").toLowerCase();
    const key = m === "upi" ? "UPI" : m === "wallet" ? "Wallet" : "Cash";
    const v = Number(row.final_fare ?? row.fare ?? 0);
    sums[key] += v;
  }
  return [
    { method: "Cash", amount: sums.Cash },
    { method: "UPI", amount: sums.UPI },
    { method: "Wallet", amount: sums.Wallet },
  ];
}

export type TripStatusSlice = { name: string; value: number; color: string };

export async function fetchTripStatusDistribution(): Promise<TripStatusSlice[]> {
  const counts = await Promise.all(
    tripStatuses.map((status) =>
      supabase.from("trips").select("*", { count: "exact", head: true }).eq("status", status),
    ),
  );
  const err = counts.find((c) => c.error)?.error;
  if (err) throw new Error(err.message);

  return tripStatuses
    .map((status, i) => ({
      name: status.replace(/^\w/, (c) => c.toUpperCase()),
      value: counts[i].count ?? 0,
      color: STATUS_PIE_COLORS[status] ?? "hsl(0, 0%, 50%)",
    }))
    .filter((s) => s.value > 0);
}

export type RecentTripRow = {
  id: string;
  rider: string;
  driver: string;
  status: string;
  fare: string;
};

export async function fetchRecentTrips(): Promise<RecentTripRow[]> {
  const { data, error } = await supabase
    .from("trips")
    .select(
      `
      id,
      status,
      fare,
      final_fare,
      riders ( name ),
      drivers ( name )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const riders = row.riders as { name: string | null } | null;
    const drivers = row.drivers as { name: string } | null;
    const fareNum = row.final_fare ?? row.fare;
    return {
      id: shortId(row.id),
      rider: riders?.name ?? "—",
      driver: drivers?.name ?? "—",
      status: row.status,
      fare: fareNum != null && Number(fareNum) > 0 ? formatInr(Number(fareNum)) : fareNum === 0 ? "₹0" : "—",
    };
  });
}

export type PendingApprovalRow = {
  id: string;
  driverId: string;
  name: string;
  docType: string;
  city: string;
};

export async function fetchPendingApprovals(): Promise<PendingApprovalRow[]> {
  const { data, error } = await supabase
    .from("driver_documents")
    .select(
      `
      id,
      driver_id,
      doc_type,
      drivers ( name, city )
    `,
    )
    .eq("status", "pending")
    .order("uploaded_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const d = row.drivers as { name: string; city: string } | null;
    return {
      id: row.id,
      driverId: row.driver_id,
      name: d?.name ?? "—",
      docType: DOC_LABELS[row.doc_type] ?? row.doc_type,
      city: d?.city ?? "—",
    };
  });
}

export type LiveMapDriver = {
  id: string;
  name: string;
  lat: number;
  left: number;
  status: "on_duty" | "on_trip";
};

export async function fetchLiveMapDrivers(): Promise<LiveMapDriver[]> {
  const [{ data: locs, error: locErr }, { data: activeTrips, error: tripErr }] = await Promise.all([
    supabase.from("driver_locations").select(`
        driver_id,
        latitude,
        longitude,
        drivers ( name, status, duty_status )
      `),
    supabase.from("trips").select("driver_id").in("status", ["accepted", "arrived", "ongoing"]),
  ]);

  if (locErr) throw new Error(locErr.message);
  if (tripErr) throw new Error(tripErr.message);

  const onTrip = new Set((activeTrips ?? []).map((t) => t.driver_id));

  const filtered =
    locs?.filter((row) => {
      const d = row.drivers as { status: string; duty_status: string } | null;
      return d?.status === "approved" && d?.duty_status === "on_duty";
    }) ?? [];

  if (filtered.length === 0) return [];

  const lats = filtered.map((r) => r.latitude);
  const lngs = filtered.map((r) => r.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const norm = (v: number, min: number, max: number) => {
    if (max === min) return 50;
    return 10 + ((v - min) / (max - min)) * 80;
  };

  return filtered.map((row) => {
    const d = row.drivers as { name: string } | null;
    const topPct = 100 - norm(row.latitude, minLat, maxLat);
    const leftPct = norm(row.longitude, minLng, maxLng);
    return {
      id: row.driver_id,
      name: d?.name ?? "Driver",
      lat: topPct,
      left: leftPct,
      status: onTrip.has(row.driver_id) ? ("on_trip" as const) : ("on_duty" as const),
    };
  });
}
