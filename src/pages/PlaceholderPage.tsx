import { DashboardLayout } from '@/components/DashboardLayout';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="brutal-card p-12 text-center max-w-md">
          <div className="h-16 w-16 bg-primary rounded-sm flex items-center justify-center brutal-border mx-auto mb-6">
            <Construction className="h-8 w-8 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground">
            This section is under construction. Full functionality coming soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlaceholderPage;
