import { Skeleton } from '@/components/ui/skeleton';
import { useDataSource } from '@/contexts/DataSourceContext';
import { useKpiStats } from '@/hooks/useDashboardData';
import type { KpiRow } from '@/lib/dashboardQueries';
import { mockKpis } from '@/lib/dashboardMockData';

export const KPICards = () => {
  const { isLive } = useDataSource();
  const q = useKpiStats();

  if (!isLive) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
    );
  }

  if (q.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="brutal-card p-5">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (q.isError) {
    return (
      <p className="text-sm text-destructive font-medium">
        Could not load KPIs. Ensure you are signed in as an admin (JWT app_metadata.role = &quot;admin&quot;).
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {(q.data ?? []).map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
};

function KpiCard({ kpi }: { kpi: KpiRow }) {
  const Icon = kpi.icon;
  return (
    <div className="brutal-card brutal-card-press p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
            {kpi.label}
          </p>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">
            {kpi.value}
          </p>
          <span
            className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-sm brutal-border ${
              kpi.change === 'Live'
                ? 'bg-primary text-primary-foreground'
                : kpi.change === '—'
                  ? 'bg-secondary text-muted-foreground'
                  : 'bg-success/10 text-success'
            }`}
          >
            {kpi.change}
          </span>
        </div>
        <div className="bg-primary h-10 w-10 rounded-sm flex items-center justify-center brutal-border">
          <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
