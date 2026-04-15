import { Skeleton } from '@/components/ui/skeleton';
import { useDataSource } from '@/contexts/DataSourceContext';
import { useLiveMapDrivers } from '@/hooks/useDashboardData';
import { mockMapDrivers } from '@/lib/dashboardMockData';
import { MapPin, Navigation } from 'lucide-react';

type MapDriver = {
  id: string | number;
  name: string;
  lat: number;
  left: number;
  status: 'on_duty' | 'on_trip';
};

export const LiveMapPreview = ({ tall = false }: { tall?: boolean }) => {
  const { isLive } = useDataSource();
  const q = useLiveMapDrivers();

  const drivers: MapDriver[] = !isLive
    ? mockMapDrivers.map((d) => ({ ...d, id: d.id }))
    : (q.data ?? []).map((d) => ({
        id: d.id,
        name: d.name,
        lat: d.lat,
        left: d.left,
        status: d.status,
      }));

  const loading = isLive && q.isLoading;
  const error = isLive && q.isError;

  if (loading) {
    return (
      <div className="brutal-card p-5">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="brutal-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">Live Map</h3>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-success rounded-full animate-pulse-dot" />
          <span className="text-xs font-bold text-success">LIVE</span>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive mb-2">Could not load driver locations.</p>
      ) : null}

      <div
        className={`relative bg-secondary brutal-border rounded-sm overflow-hidden ${
          tall ? "min-h-[60vh] h-[60vh]" : "h-64"
        }`}
      >
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-foreground/20"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-foreground/20"
              style={{ left: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        <div className="absolute top-1/2 left-0 right-0 h-1 bg-foreground/10" />
        <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-foreground/10" />
        <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-foreground/10" />
        <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-foreground/5" />
        <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-foreground/5" />

        {drivers.map((driver) => (
          <div
            key={String(driver.id)}
            className="absolute group cursor-pointer"
            style={{ top: `${driver.lat}%`, left: `${driver.left}%` }}
          >
            <div
              className={`relative h-6 w-6 rounded-full flex items-center justify-center brutal-border ${
                driver.status === 'on_trip' ? 'bg-warning' : 'bg-primary'
              }`}
            >
              {driver.status === 'on_trip' ? (
                <Navigation className="h-3 w-3 text-warning-foreground" strokeWidth={3} />
              ) : (
                <MapPin className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
              )}
            </div>
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 brutal-border bg-card rounded-sm whitespace-nowrap z-10">
              <span className="text-[10px] font-bold text-foreground">{driver.name}</span>
            </div>
          </div>
        ))}

        <div className="absolute bottom-2 right-2 brutal-border bg-card p-2 rounded-sm text-[10px] space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 bg-primary rounded-full brutal-border" />
            <span className="font-bold text-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 bg-warning rounded-full brutal-border" />
            <span className="font-bold text-foreground">On Trip</span>
          </div>
        </div>

        {drivers.length === 0 && !loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted-foreground">
            No on-duty drivers with locations
          </div>
        ) : null}
      </div>
    </div>
  );
};
