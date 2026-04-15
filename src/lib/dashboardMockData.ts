import { Navigation, Car, DollarSign, Zap, type LucideIcon } from 'lucide-react';

export type MockKpi = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
};

export const mockKpis: MockKpi[] = [
  { label: 'Total Trips', value: '12,847', change: '+12.5%', icon: Navigation, color: 'bg-primary' },
  { label: 'Active Drivers', value: '342', change: '+8.2%', icon: Car, color: 'bg-primary' },
  { label: 'Revenue Today', value: '₹1,24,500', change: '+15.3%', icon: DollarSign, color: 'bg-primary' },
  { label: 'Ongoing Rides', value: '89', change: 'Live', icon: Zap, color: 'bg-primary' },
];

export const mockTripsOverTime = [
  { day: 'Mon', trips: 420 },
  { day: 'Tue', trips: 380 },
  { day: 'Wed', trips: 510 },
  { day: 'Thu', trips: 470 },
  { day: 'Fri', trips: 620 },
  { day: 'Sat', trips: 780 },
  { day: 'Sun', trips: 690 },
];

export const mockRevenueByMethod = [
  { method: 'Cash', amount: 45000 },
  { method: 'UPI', amount: 52000 },
  { method: 'Wallet', amount: 27500 },
];

export const mockTripStatusPie = [
  { name: 'Completed', value: 8420, color: 'hsl(145, 63%, 42%)' },
  { name: 'Cancelled', value: 1230, color: 'hsl(0, 84%, 60%)' },
  { name: 'Ongoing', value: 89, color: 'hsl(38, 92%, 50%)' },
];

export const mockRecentTrips = [
  { id: 'T-1042', rider: 'Aarav S.', driver: 'Vikram R.', status: 'completed', fare: '₹245' },
  { id: 'T-1041', rider: 'Priya M.', driver: 'Rahul K.', status: 'ongoing', fare: '₹180' },
  { id: 'T-1040', rider: 'Karan D.', driver: 'Suresh T.', status: 'cancelled', fare: '₹0' },
  { id: 'T-1039', rider: 'Neha G.', driver: 'Ajay P.', status: 'completed', fare: '₹320' },
  { id: 'T-1038', rider: 'Rohit B.', driver: 'Manoj S.', status: 'completed', fare: '₹155' },
];

export const mockPendingApprovals = [
  { name: 'Arjun Mehta', docType: 'DL Front', city: 'Mumbai' },
  { name: 'Deepak Sharma', docType: 'RC Book', city: 'Delhi' },
  { name: 'Ravi Kumar', docType: 'Aadhaar', city: 'Bangalore' },
  { name: 'Sanjay Verma', docType: 'PAN Card', city: 'Hyderabad' },
];

export type MockMapDriver = {
  id: number;
  name: string;
  lat: number;
  left: number;
  status: 'on_duty' | 'on_trip';
};

export const mockMapDrivers: MockMapDriver[] = [
  { id: 1, name: 'Vikram R.', lat: 30, left: 25, status: 'on_duty' },
  { id: 2, name: 'Rahul K.', lat: 55, left: 60, status: 'on_duty' },
  { id: 3, name: 'Suresh T.', lat: 40, left: 45, status: 'on_trip' },
  { id: 4, name: 'Ajay P.', lat: 70, left: 30, status: 'on_duty' },
  { id: 5, name: 'Manoj S.', lat: 25, left: 75, status: 'on_trip' },
];
