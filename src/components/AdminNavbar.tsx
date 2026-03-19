import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  sidebarCollapsed: boolean;
}

export const AdminNavbar = ({ sidebarCollapsed }: AdminNavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-card brutal-border border-t-0 border-r-0 z-30 flex items-center justify-between px-6 transition-all duration-200 ${
        sidebarCollapsed ? 'left-16' : 'left-60'
      }`}
    >
      <h2 className="font-heading font-bold text-lg text-foreground">
        Admin Panel
      </h2>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative h-10 w-10 brutal-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors brutal-shadow-sm brutal-btn">
          <Bell className="h-5 w-5 text-foreground" strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center">
            3
          </span>
        </button>

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
