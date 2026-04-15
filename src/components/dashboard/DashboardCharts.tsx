import { Skeleton } from '@/components/ui/skeleton';
import { useDataSource } from '@/contexts/DataSourceContext';
import {
  useRevenueBreakdown,
  useTripStatusDistribution,
  useTripsOverTime,
} from '@/hooks/useDashboardData';
import {
  mockRevenueByMethod,
  mockTripStatusPie,
  mockTripsOverTime,
} from '@/lib/dashboardMockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const tooltipStyle = {
  border: '1.25px solid black',
  borderRadius: '2px',
  boxShadow: '3px 3px 0px black',
  fontWeight: 600,
} as const;

export const DashboardCharts = () => {
  const { isLive } = useDataSource();
  const tripsQ = useTripsOverTime();
  const revenueQ = useRevenueBreakdown();
  const statusQ = useTripStatusDistribution();

  const tripsData = !isLive ? mockTripsOverTime : tripsQ.data;
  const revenueData = !isLive ? mockRevenueByMethod : revenueQ.data;
  const statusData = !isLive ? mockTripStatusPie : statusQ.data;

  const loading = isLive && (tripsQ.isLoading || revenueQ.isLoading || statusQ.isLoading);
  const err =
    isLive &&
    (tripsQ.isError || revenueQ.isError || statusQ.isError) &&
    (tripsQ.error ?? revenueQ.error ?? statusQ.error);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="brutal-card p-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-[220px] w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {err ? (
        <p className="text-sm text-destructive font-medium">
          Chart data failed to load. Check admin JWT and RLS.
        </p>
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="brutal-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">Trips Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={tripsData ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 85%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="trips"
                stroke="hsl(350, 100%, 45%)"
                strokeWidth={1.5}
                dot={{ r: 5, fill: 'hsl(350, 100%, 45%)', stroke: 'black', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="brutal-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 85%)" />
              <XAxis dataKey="method" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
              />
              <Bar
                dataKey="amount"
                fill="hsl(350, 100%, 45%)"
                stroke="black"
                strokeWidth={1}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="brutal-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">Trip Status</h3>
          {statusData && statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  stroke="black"
                  strokeWidth={1}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground font-medium">
              No trip status data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
