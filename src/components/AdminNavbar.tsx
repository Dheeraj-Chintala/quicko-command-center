import { Bell, LogOut, User, ClipboardList, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDataSource } from '@/contexts/DataSourceContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { usePendingApprovals } from '@/hooks/useDashboardData';
import { mockPendingApprovals } from '@/lib/dashboardMockData';
import { Link, useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  sidebarCollapsed: boolean;
  onOpenMobileMenu: () => void;
}

export const AdminNavbar = ({ sidebarCollapsed, onOpenMobileMenu }: AdminNavbarProps) => {
  const { user, signOut } = useAuth();
  const { isLive, setMode } = useDataSource();
  const navigate = useNavigate();
  const pendingQ = usePendingApprovals();

  const notificationItems = !isLive
    ? mockPendingApprovals.map((a, i) => ({
        id: `demo-${i}`,
        driverId: `demo-${i}`,
        name: a.name,
        docType: a.docType,
        city: a.city,
      }))
    : (pendingQ.data ?? []);
  const pendingLoading = isLive && pendingQ.isLoading;
  const pendingError = isLive && pendingQ.isError;
  const pendingCount = notificationItems.length;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-between gap-2 border-t-0 border-r-0 bg-card brutal-border px-3 transition-all duration-200 md:px-6 ${
        sidebarCollapsed ? "left-0 md:left-16" : "left-0 md:left-60"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm brutal-border transition-colors hover:bg-secondary md:hidden"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" strokeWidth={2.5} />
        </button>
        <h2 className="min-w-0 truncate font-heading text-lg font-bold text-foreground">
          Admin Panel
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div className="flex items-center gap-2 mr-1">
          <Label
            htmlFor="data-source-switch"
            className="text-xs font-heading font-bold text-muted-foreground cursor-pointer whitespace-nowrap"
          >
            <span className="sm:hidden">{isLive ? 'Live' : 'Demo'}</span>
            <span className="hidden sm:inline">{isLive ? 'Live (Supabase)' : 'Demo'}</span>
          </Label>
          <Switch
            id="data-source-switch"
            checked={isLive}
            onCheckedChange={(checked) => setMode(checked ? 'live' : 'demo')}
            aria-label="Toggle between live Supabase data and demo data"
          />
        </div>

        {/* Notifications — pending driver documents (same source as dashboard widget) */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="relative h-10 w-10 brutal-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors brutal-shadow-sm brutal-btn"
              aria-label={`Notifications${pendingCount ? `, ${pendingCount} pending` : ''}`}
            >
              <Bell className="h-5 w-5 text-foreground" strokeWidth={2.5} />
              {pendingCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-h-4 min-w-4 px-0.5 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center tabular-nums">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              ) : null}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 sm:w-96 p-0 brutal-border">
            <div className="border-b border-foreground px-3 py-2.5 flex items-center gap-2 bg-secondary/40">
              <ClipboardList className="h-4 w-4 text-foreground shrink-0" strokeWidth={2.5} />
              <span className="font-heading font-bold text-sm text-foreground">Alerts</span>
              {!isLive && (
                <span className="text-[10px] font-heading font-bold uppercase text-muted-foreground ml-auto">
                  Demo data
                </span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {pendingLoading ? (
                <div className="space-y-2 p-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-sm" />
                  ))}
                </div>
              ) : pendingError ? (
                <p className="text-sm text-destructive font-body px-2 py-6 text-center">
                  Could not load notifications. Check your connection and Supabase access.
                </p>
              ) : pendingCount === 0 ? (
                <p className="text-sm text-muted-foreground font-body px-2 py-6 text-center">
                  No pending document reviews. You’re all caught up.
                </p>
              ) : (
                <ul className="space-y-1">
                  {notificationItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/driver-applications/${item.driverId}`}
                        className="block rounded-sm px-2 py-2 hover:bg-secondary transition-colors brutal-border border-transparent hover:border-foreground"
                      >
                        <p className="font-heading font-bold text-sm text-foreground leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.docType} · {item.city}
                        </p>
                        <span className="text-[11px] font-heading font-semibold text-primary mt-1 inline-block">
                          Review →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {pendingCount > 0 ? (
              <div className="border-t border-foreground p-2">
                <Button variant="outline" size="sm" className="w-full font-heading" asChild>
                  <Link to="/driver-applications">Open driver applications</Link>
                </Button>
              </div>
            ) : null}
          </PopoverContent>
        </Popover>

        {/* Admin Avatar */}
        <div className="brutal-border rounded-sm h-10 px-3 flex items-center gap-2 bg-secondary">
          <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-heading font-bold text-foreground hidden sm:block">
            {user?.email?.split('@')[0] ?? 'Admin'}
          </span>
        </div>

        {/* Logout */}
        <Button variant="outline" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      </div>
    </header>
  );
};
