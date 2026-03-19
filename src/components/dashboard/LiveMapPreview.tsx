import { MapPin, Navigation } from 'lucide-react';

const drivers = [
  { id: 1, name: 'Vikram R.', lat: 30, left: 25, status: 'on_duty' },
  { id: 2, name: 'Rahul K.', lat: 55, left: 60, status: 'on_duty' },
  { id: 3, name: 'Suresh T.', lat: 40, left: 45, status: 'on_trip' },
  { id: 4, name: 'Ajay P.', lat: 70, left: 30, status: 'on_duty' },
  { id: 5, name: 'Manoj S.', lat: 25, left: 75, status: 'on_trip' },
];

export const LiveMapPreview = () => {
  return (
    <div className="brutal-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">Live Map</h3>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-success rounded-full animate-pulse-dot" />
          <span className="text-xs font-bold text-success">LIVE</span>
        </div>
      </div>

      {/* Simulated Map */}
      <div className="relative h-64 bg-secondary brutal-border rounded-sm overflow-hidden">
        {/* Grid lines for map feel */}
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

        {/* Road-like shapes */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-foreground/10" />
        <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-foreground/10" />
        <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-foreground/10" />
        <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-foreground/5" />
        <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-foreground/5" />

        {/* Driver Markers */}
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="absolute group cursor-pointer"
            style={{ top: `${driver.lat}%`, left: `${driver.left}%` }}
          >
            <div className={`relative h-6 w-6 rounded-full flex items-center justify-center brutal-border ${
              driver.status === 'on_trip' ? 'bg-warning' : 'bg-primary'
            }`}>
              {driver.status === 'on_trip' ? (
                <Navigation className="h-3 w-3 text-warning-foreground" strokeWidth={3} />
              ) : (
                <MapPin className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
              )}
            </div>
            {/* Tooltip */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 brutal-border bg-card rounded-sm whitespace-nowrap z-10">
              <span className="text-[10px] font-bold text-foreground">{driver.name}</span>
            </div>
          </div>
        ))}

        {/* Legend */}
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
      </div>
    </div>
  );
};
