import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDataMode } from '@/contexts/DataModeContext';

// ── Fake data ──────────────────────────────────────────
const fakeKPIs = {
  totalTrips: 12847,
  activeDrivers: 342,
  revenueToday: 124500,
  ongoingRides: 89,
};

const fakeTripsOverTime = [
  { day: 'Mon', trips: 420 }, { day: 'Tue', trips: 380 },
  { day: 'Wed', trips: 510 }, { day: 'Thu', trips: 470 },
  { day: 'Fri', trips: 620 }, { day: 'Sat', trips: 780 },
  { day: 'Sun', trips: 690 },
];

const fakeRevenueBreakdown = [
  { method: 'Cash', amount: 45000 },
  { method: 'UPI', amount: 52000 },
  { method: 'Wallet', amount: 27500 },
];

const fakeTripStatus = [
  { name: 'Completed', value: 8420, color: 'hsl(145, 63%, 42%)' },
  { name: 'Cancelled', value: 1230, color: 'hsl(0, 84%, 60%)' },
  { name: 'Ongoing', value: 89, color: 'hsl(38, 92%, 50%)' },
];

const fakeRecentTrips = [
  { id: '1', rider: 'Priya S.', driver: 'Ravi K.', status: 'completed', fare: 245, payment_method: 'cash' },
  { id: '2', rider: 'Amit R.', driver: 'Suresh M.', status: 'ongoing', fare: 180, payment_method: 'upi' },
  { id: '3', rider: 'Neha G.', driver: 'Deepak V.', status: 'cancelled', fare: 0, payment_method: 'wallet' },
  { id: '4', rider: 'Karan P.', driver: 'Vijay L.', status: 'completed', fare: 320, payment_method: 'upi' },
  { id: '5', rider: 'Sneha D.', driver: 'Manoj T.', status: 'completed', fare: 150, payment_method: 'cash' },
];

const fakePendingApprovals = [
  { id: '1', name: 'Arjun Mehta', docType: 'DL Front', city: 'Mumbai' },
  { id: '2', name: 'Deepak Sharma', docType: 'RC Book', city: 'Delhi' },
  { id: '3', name: 'Ravi Kumar', docType: 'Aadhaar', city: 'Bangalore' },
  { id: '4', name: 'Sanjay Verma', docType: 'PAN Card', city: 'Hyderabad' },
];

// ── Real data fetchers ─────────────────────────────────

async function fetchKPIs() {
  const [tripsRes, driversRes, ongoingRes, revenueRes] = await Promise.all([
    supabase.from('trips').select('id', { count: 'exact', head: true }),
    supabase.from('drivers').select('id', { count: 'exact', head: true }).eq('status', 'approved').eq('duty_status', 'on_duty'),
    supabase.from('trips').select('id', { count: 'exact', head: true }).eq('status', 'ongoing'),
    supabase.from('trips').select('final_fare').eq('status', 'completed').gte('completed_at', new Date().toISOString().split('T')[0]),
  ]);

  const revenueToday = (revenueRes.data || []).reduce((sum: number, t: any) => sum + (Number(t.final_fare) || 0), 0);

  return {
    totalTrips: tripsRes.count || 0,
    activeDrivers: driversRes.count || 0,
    revenueToday,
    ongoingRides: ongoingRes.count || 0,
  };
}

async function fetchRecentTrips() {
  const { data } = await supabase
    .from('trips')
    .select('id, status, fare, final_fare, payment_method, rider_id, driver_id, riders(name), drivers(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (data || []).map((t: any) => ({
    id: t.id,
    rider: t.riders?.name || 'Unknown',
    driver: t.drivers?.name || 'Unknown',
    status: t.status,
    fare: Number(t.final_fare || t.fare || 0),
    payment_method: t.payment_method || 'cash',
  }));
}

async function fetchPendingApprovals() {
  const { data } = await supabase
    .from('driver_documents')
    .select('id, doc_type, driver_id, drivers(name, city)')
    .eq('status', 'pending')
    .order('uploaded_at', { ascending: false })
    .limit(10);

  return (data || []).map((d: any) => ({
    id: d.id,
    name: d.drivers?.name || 'Unknown',
    docType: d.doc_type?.replace(/_/g, ' ').toUpperCase() || '',
    city: d.drivers?.city || '',
  }));
}

async function fetchTripStatusCounts() {
  const [completed, cancelled, ongoing] = await Promise.all([
    supabase.from('trips').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('trips').select('id', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabase.from('trips').select('id', { count: 'exact', head: true }).eq('status', 'ongoing'),
  ]);
  return [
    { name: 'Completed', value: completed.count || 0, color: 'hsl(145, 63%, 42%)' },
    { name: 'Cancelled', value: cancelled.count || 0, color: 'hsl(0, 84%, 60%)' },
    { name: 'Ongoing', value: ongoing.count || 0, color: 'hsl(38, 92%, 50%)' },
  ];
}

async function fetchRevenueBreakdown() {
  const { data } = await supabase
    .from('trips')
    .select('payment_method, final_fare')
    .eq('status', 'completed');

  const breakdown: Record<string, number> = { cash: 0, upi: 0, wallet: 0 };
  (data || []).forEach((t: any) => {
    const method = t.payment_method || 'cash';
    breakdown[method] = (breakdown[method] || 0) + (Number(t.final_fare) || 0);
  });

  return [
    { method: 'Cash', amount: breakdown.cash },
    { method: 'UPI', amount: breakdown.upi },
    { method: 'Wallet', amount: breakdown.wallet },
  ];
}

// ── Hooks ──────────────────────────────────────────────

export function useKPIs() {
  const { isRealData } = useDataMode();
  return useQuery({
    queryKey: ['kpis', isRealData],
    queryFn: () => isRealData ? fetchKPIs() : Promise.resolve(fakeKPIs),
    refetchInterval: isRealData ? 30000 : false,
  });
}

export function useTripsOverTime() {
  const { isRealData } = useDataMode();
  return useQuery({
    queryKey: ['tripsOverTime', isRealData],
    queryFn: () => Promise.resolve(fakeTripsOverTime), // Real: would need aggregation
  });
}

export function useRevenueBreakdown() {
  const { isRealData } = useDataMode();
  return useQuery({
    queryKey: ['revenueBreakdown', isRealData],
    queryFn: () => isRealData ? fetchRevenueBreakdown() : Promise.resolve(fakeRevenueBreakdown),
  });
}

export function useTripStatus() {
  const { isRealData } = useDataMode();
  return useQuery({
    queryKey: ['tripStatus', isRealData],
    queryFn: () => isRealData ? fetchTripStatusCounts() : Promise.resolve(fakeTripStatus),
  });
}

export function useRecentTrips() {
  const { isRealData } = useDataMode();
  return useQuery({
    queryKey: ['recentTrips', isRealData],
    queryFn: () => isRealData ? fetchRecentTrips() : Promise.resolve(fakeRecentTrips),
  });
}

export function usePendingApprovals() {
  const { isRealData } = useDataMode();
  return useQuery({
    queryKey: ['pendingApprovals', isRealData],
    queryFn: () => isRealData ? fetchPendingApprovals() : Promise.resolve(fakePendingApprovals),
  });
}
