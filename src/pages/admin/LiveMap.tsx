import { DashboardLayout } from "@/components/DashboardLayout";
import { LiveMapPreview } from "@/components/dashboard/LiveMapPreview";

export default function LiveMap() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Live map</h1>
          <p className="text-sm text-muted-foreground mt-1">On-duty drivers with recent locations</p>
        </div>
        <LiveMapPreview tall />
      </div>
    </DashboardLayout>
  );
}
