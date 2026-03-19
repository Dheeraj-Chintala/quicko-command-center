import { useRecentTrips } from '@/hooks/useDashboardData';

const statusStyle: Record<string, string> = {
  completed: 'bg-success/10 text-success',
  ongoing: 'bg-warning/10 text-warning',
  cancelled: 'bg-destructive/10 text-destructive',
  accepted: 'bg-primary/10 text-primary',
  arrived: 'bg-accent/10 text-accent-foreground',
};

export const RecentTripsTable = () => {
  const { data: trips = [], isLoading } = useRecentTrips();

  return (
    <div className="brutal-card p-5">
      <h3 className="font-heading font-bold text-foreground mb-4">Recent Trips</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground">
              <th className="text-left py-2 font-heading font-bold text-muted-foreground">Rider</th>
              <th className="text-left py-2 font-heading font-bold text-muted-foreground">Driver</th>
              <th className="text-left py-2 font-heading font-bold text-muted-foreground">Status</th>
              <th className="text-right py-2 font-heading font-bold text-muted-foreground">Fare</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">Loading...</td></tr>
            ) : trips.length === 0 ? (
              <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">No trips found</td></tr>
            ) : trips.map((trip: any) => (
              <tr key={trip.id} className="border-b border-muted hover:bg-secondary/30 transition-colors">
                <td className="py-2.5 font-semibold text-foreground">{trip.rider}</td>
                <td className="py-2.5 text-muted-foreground">{trip.driver}</td>
                <td className="py-2.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm brutal-border ${statusStyle[trip.status] || ''}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="py-2.5 text-right font-heading font-bold text-foreground">₹{trip.fare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
