import { DashboardLayout } from '@/components/DashboardLayout';
import { KPICards } from '@/components/dashboard/KPICards';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { RecentTripsTable } from '@/components/dashboard/RecentTripsTable';
import { PendingApprovals } from '@/components/dashboard/PendingApprovals';
import { SafetyAlertCard, HighDemandCard } from '@/components/dashboard/AlertCards';
import { LiveMapPreview } from '@/components/dashboard/LiveMapPreview';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, Admin. Here's your overview.</p>
        </div>

        {/* KPI Cards */}
        <KPICards />

        {/* Charts */}
        <DashboardCharts />

        {/* Live Map */}
        <LiveMapPreview />

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentTripsTable />
          <PendingApprovals />
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SafetyAlertCard />
          <HighDemandCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
