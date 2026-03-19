const trips = [
  { id: 'T-1042', rider: 'Aarav S.', driver: 'Vikram R.', status: 'completed', fare: '₹245' },
  { id: 'T-1041', rider: 'Priya M.', driver: 'Rahul K.', status: 'ongoing', fare: '₹180' },
  { id: 'T-1040', rider: 'Karan D.', driver: 'Suresh T.', status: 'cancelled', fare: '₹0' },
  { id: 'T-1039', rider: 'Neha G.', driver: 'Ajay P.', status: 'completed', fare: '₹320' },
  { id: 'T-1038', rider: 'Rohit B.', driver: 'Manoj S.', status: 'completed', fare: '₹155' },
];

const statusStyles: Record<string, string> = {
  completed: 'bg-success/10 text-success',
  ongoing: 'bg-warning/10 text-warning',
  cancelled: 'bg-destructive/10 text-destructive',
};

export const RecentTripsTable = () => {
  return (
    <div className="brutal-card p-5">
      <h3 className="font-heading font-bold text-foreground mb-4">Recent Trips</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-foreground">
              <th className="text-left py-2 font-heading font-bold text-foreground">ID</th>
              <th className="text-left py-2 font-heading font-bold text-foreground">Rider</th>
              <th className="text-left py-2 font-heading font-bold text-foreground">Driver</th>
              <th className="text-left py-2 font-heading font-bold text-foreground">Status</th>
              <th className="text-right py-2 font-heading font-bold text-foreground">Fare</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-b border-muted hover:bg-secondary/50 transition-colors">
                <td className="py-2.5 font-bold font-heading text-foreground">{trip.id}</td>
                <td className="py-2.5 text-foreground">{trip.rider}</td>
                <td className="py-2.5 text-foreground">{trip.driver}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-sm brutal-border ${statusStyles[trip.status]}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="py-2.5 text-right font-bold font-heading text-foreground">{trip.fare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
