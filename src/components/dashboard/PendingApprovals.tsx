import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataSource } from '@/contexts/DataSourceContext';
import { usePendingApprovals } from '@/hooks/useDashboardData';
import { useUpdateDriverDocument } from '@/hooks/useDriverApplications';
import { mockPendingApprovals } from '@/lib/dashboardMockData';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const PendingApprovals = () => {
  const { isLive } = useDataSource();
  const q = usePendingApprovals();
  const updateDoc = useUpdateDriverDocument();

  const approvals = !isLive
    ? mockPendingApprovals.map((a, i) => ({ ...a, id: `demo-${i}`, driverId: `demo-${i}` }))
    : (q.data ?? []);
  const loading = isLive && q.isLoading;
  const error = isLive && q.isError;

  const quickApprove = async (docId: string, driverId: string) => {
    if (!isLive) {
      toast.message('Switch to Live (Supabase) to approve documents');
      return;
    }
    try {
      await updateDoc.mutateAsync({
        docId,
        driverId,
        status: 'approved',
        adminNote: null,
      });
      toast.success('Document approved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="brutal-card p-5">
        <Skeleton className="h-5 w-56 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brutal-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Pending Driver Approvals</h3>
        <p className="text-sm text-destructive">Could not load pending documents.</p>
      </div>
    );
  }

  return (
    <div className="brutal-card p-5">
      <h3 className="font-heading font-bold text-foreground mb-4">Pending Driver Approvals</h3>
      <div className="space-y-3">
        {approvals.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 brutal-border rounded-sm bg-secondary/30"
          >
            <div>
              <p className="font-heading font-bold text-sm text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.docType} · {item.city}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Button
                variant="success"
                size="sm"
                type="button"
                disabled={updateDoc.isPending}
                onClick={() => void quickApprove(item.id, item.driverId)}
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </Button>
              <Button variant="destructive" size="sm" type="button" asChild>
                <Link to={`/driver-applications/${item.driverId}`} title="Reject with note in application review">
                  <X className="h-4 w-4" strokeWidth={3} />
                </Link>
              </Button>
              <Button variant="outline" size="sm" type="button" asChild>
                <Link to={`/driver-applications/${item.driverId}`}>Review</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
