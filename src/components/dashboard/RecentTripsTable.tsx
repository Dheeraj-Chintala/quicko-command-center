import { useMemo, useState } from 'react';
import { TableSearchInput } from '@/components/TableSearchInput';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataSource } from '@/contexts/DataSourceContext';
import { useRecentTrips } from '@/hooks/useDashboardData';
import { mockRecentTrips } from '@/lib/dashboardMockData';
import { rowMatchesSearch } from '@/lib/tableSearch';

const statusStyles: Record<string, string> = {
  completed: 'bg-success/10 text-success',
  ongoing: 'bg-warning/10 text-warning',
  cancelled: 'bg-destructive/10 text-destructive',
  requested: 'bg-muted text-muted-foreground',
  accepted: 'bg-secondary text-foreground',
  arrived: 'bg-accent/20 text-foreground',
};

export const RecentTripsTable = () => {
  const { isLive } = useDataSource();
  const q = useRecentTrips();
  const [search, setSearch] = useState('');

  const trips = !isLive ? mockRecentTrips : q.data;
  const filteredTrips = useMemo(
    () =>
      (trips ?? []).filter((trip) =>
        rowMatchesSearch(search, [trip.id, trip.rider, trip.driver, trip.status, trip.fare]),
      ),
    [trips, search],
  );
  const loading = isLive && q.isLoading;
  const error = isLive && q.isError;

  if (loading) {
    return (
      <div className="brutal-card p-5">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brutal-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Recent Trips</h3>
        <p className="text-sm text-destructive">Could not load trips.</p>
      </div>
    );
  }

  const rowCount = (trips ?? []).length;

  return (
    <div className="brutal-card overflow-hidden">
      <div className="px-5 pt-5">
        <h3 className="font-heading font-bold text-foreground">Recent Trips</h3>
      </div>
      <div className="border-b border-foreground px-5 py-3">
        <TableSearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground">
              <th className="text-left py-2 font-heading font-bold text-foreground">ID</th>
              <th className="text-left py-2 font-heading font-bold text-foreground">Rider</th>
              <th className="text-left py-2 font-heading font-bold text-foreground">Driver</th>
              <th className="text-left py-2 font-heading font-bold text-foreground">Status</th>
              <th className="text-right py-2 font-heading font-bold text-foreground">Fare</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  {rowCount === 0 ? 'No trips to show.' : 'No matching rows.'}
                </td>
              </tr>
            ) : (
              filteredTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-muted hover:bg-secondary/50 transition-colors">
                  <td className="py-2.5 font-bold font-heading text-foreground">{trip.id}</td>
                  <td className="py-2.5 text-foreground">{trip.rider}</td>
                  <td className="py-2.5 text-foreground">{trip.driver}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-sm brutal-border ${
                        statusStyles[trip.status] ?? 'bg-secondary text-foreground'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold font-heading text-foreground">{trip.fare}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
