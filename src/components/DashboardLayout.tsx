import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataSourceProvider } from "@/contexts/DataSourceContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  return (
    <DataSourceProvider>
      <div className="min-h-screen bg-background">
        {mobileMenuOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : null}
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <AdminNavbar
          sidebarCollapsed={collapsed}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main
          className={`pt-16 transition-all duration-200 ml-0 ${
            collapsed ? "md:ml-16" : "md:ml-60"
          }`}
        >
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </DataSourceProvider>
  );
};
