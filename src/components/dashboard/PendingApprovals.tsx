import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const approvals = [
  { name: 'Arjun Mehta', docType: 'DL Front', city: 'Mumbai' },
  { name: 'Deepak Sharma', docType: 'RC Book', city: 'Delhi' },
  { name: 'Ravi Kumar', docType: 'Aadhaar', city: 'Bangalore' },
  { name: 'Sanjay Verma', docType: 'PAN Card', city: 'Hyderabad' },
];

export const PendingApprovals = () => {
  return (
    <div className="brutal-card p-5">
      <h3 className="font-heading font-bold text-foreground mb-4">Pending Driver Approvals</h3>
      <div className="space-y-3">
        {approvals.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 brutal-border rounded-sm bg-secondary/30">
            <div>
              <p className="font-heading font-bold text-sm text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.docType} · {item.city}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="success" size="sm">
                <Check className="h-4 w-4" strokeWidth={3} />
              </Button>
              <Button variant="destructive" size="sm">
                <X className="h-4 w-4" strokeWidth={3} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
