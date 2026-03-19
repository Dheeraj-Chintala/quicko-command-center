import { AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

export const SafetyAlertCard = () => (
  <div className="brutal-card p-5 border-primary bg-primary/5">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-10 w-10 bg-primary rounded-sm flex items-center justify-center brutal-border">
        <AlertTriangle className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="font-heading font-bold text-foreground">Safety Alerts</h3>
        <p className="text-xs text-muted-foreground">SOS triggers today</p>
      </div>
    </div>
    <div className="space-y-2">
      {[
        { time: '2:34 PM', rider: 'Neha G.', area: 'Andheri West' },
        { time: '11:15 AM', rider: 'Priya M.', area: 'Koramangala' },
      ].map((alert, i) => (
        <div key={i} className="flex items-center justify-between p-2 brutal-border rounded-sm bg-card text-sm">
          <div>
            <span className="font-bold text-foreground">{alert.rider}</span>
            <span className="text-muted-foreground ml-2">{alert.area}</span>
          </div>
          <span className="text-xs font-bold text-primary brutal-border px-2 py-0.5 rounded-sm bg-primary/10">
            {alert.time}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const HighDemandCard = () => (
  <div className="brutal-card p-5 border-warning bg-warning/5">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-10 w-10 bg-warning rounded-sm flex items-center justify-center brutal-border">
        <TrendingUp className="h-5 w-5 text-warning-foreground" strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="font-heading font-bold text-foreground">High Demand Zones</h3>
        <p className="text-xs text-muted-foreground">Surge areas right now</p>
      </div>
    </div>
    <div className="space-y-2">
      {[
        { zone: 'Connaught Place', surge: '2.1x', drivers: 5 },
        { zone: 'MG Road', surge: '1.8x', drivers: 8 },
        { zone: 'Bandra Station', surge: '1.6x', drivers: 12 },
      ].map((zone, i) => (
        <div key={i} className="flex items-center justify-between p-2 brutal-border rounded-sm bg-card text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-warning" strokeWidth={2.5} />
            <span className="font-bold text-foreground">{zone.zone}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-warning">{zone.surge}</span>
            <span className="text-xs text-muted-foreground">{zone.drivers} drivers</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
