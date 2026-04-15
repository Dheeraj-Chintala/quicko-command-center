import {
  LayoutDashboard, Navigation, Car, Users, DollarSign,
  FileText, Shield, MapPin, Settings, ChevronLeft, ClipboardList,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Driver Applications', url: '/driver-applications', icon: ClipboardList },
  { title: 'Trips', url: '/trips', icon: Navigation },
  { title: 'Drivers', url: '/drivers', icon: Car },
  { title: 'Riders', url: '/riders', icon: Users },
  { title: 'Earnings', url: '/earnings', icon: DollarSign },
  { title: 'Requests', url: '/requests', icon: FileText },
  { title: 'Documents', url: '/documents', icon: Shield },
  { title: 'Live Map', url: '/live-map', icon: MapPin },
  { title: 'Settings', url: '/settings', icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const AdminSidebar = ({ collapsed, onToggle }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-card brutal-border border-l-0 border-t-0 border-b-0 z-40 flex flex-col transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/Quicko-app-logo.png"
            alt="Quicko"
            className={`object-contain flex-shrink-0 ${collapsed ? 'h-9 w-9' : 'h-10 w-10'}`}
            width={40}
            height={40}
          />
          {!collapsed && (
            <span className="font-heading font-bold text-lg text-foreground tracking-tight truncate">
              QUICKO
            </span>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.url === "/driver-applications"
              ? location.pathname.startsWith("/driver-applications")
              : location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url !== "/driver-applications"}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-heading font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-brutal-sm'
                  : 'text-foreground hover:bg-secondary'
              }`}
              activeClassName=""
            >
              <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="h-12 flex items-center justify-center border-t border-foreground hover:bg-secondary transition-colors"
      >
        <ChevronLeft
          className={`h-5 w-5 text-foreground transition-transform ${collapsed ? 'rotate-180' : ''}`}
          strokeWidth={2.5}
        />
      </button>
    </aside>
  );
};
