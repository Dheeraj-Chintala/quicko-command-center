import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const tripsData = [
  { day: 'Mon', trips: 420 }, { day: 'Tue', trips: 380 },
  { day: 'Wed', trips: 510 }, { day: 'Thu', trips: 470 },
  { day: 'Fri', trips: 620 }, { day: 'Sat', trips: 780 },
  { day: 'Sun', trips: 690 },
];

const revenueData = [
  { method: 'Cash', amount: 45000 },
  { method: 'UPI', amount: 52000 },
  { method: 'Wallet', amount: 27500 },
];

const statusData = [
  { name: 'Completed', value: 8420, color: 'hsl(145, 63%, 42%)' },
  { name: 'Cancelled', value: 1230, color: 'hsl(0, 84%, 60%)' },
  { name: 'Ongoing', value: 89, color: 'hsl(38, 92%, 50%)' },
];

export const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Trips Line Chart */}
      <div className="brutal-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Trips Over Time</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={tripsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 85%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                border: '2.5px solid black',
                borderRadius: '2px',
                boxShadow: '3px 3px 0px black',
                fontWeight: 600,
              }}
            />
            <Line
              type="monotone"
              dataKey="trips"
              stroke="hsl(350, 100%, 45%)"
              strokeWidth={3}
              dot={{ r: 5, fill: 'hsl(350, 100%, 45%)', stroke: 'black', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Bar Chart */}
      <div className="brutal-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 85%)" />
            <XAxis dataKey="method" tick={{ fontSize: 12, fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                border: '2.5px solid black',
                borderRadius: '2px',
                boxShadow: '3px 3px 0px black',
                fontWeight: 600,
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
            />
            <Bar dataKey="amount" fill="hsl(350, 100%, 45%)" stroke="black" strokeWidth={2} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trip Status Pie Chart */}
      <div className="brutal-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Trip Status</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              stroke="black"
              strokeWidth={2}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                border: '2.5px solid black',
                borderRadius: '2px',
                boxShadow: '3px 3px 0px black',
                fontWeight: 600,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
