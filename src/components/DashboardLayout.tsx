import React, { useState } from 'react';
import { DataSourceProvider } from '@/contexts/DataSourceContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <DataSourceProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <AdminNavbar sidebarCollapsed={collapsed} />
        <main
          className={`pt-16 transition-all duration-200 ${
            collapsed ? 'ml-16' : 'ml-60'
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </DataSourceProvider>
  );
};
