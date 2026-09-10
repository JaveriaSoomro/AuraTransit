"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopBar } from "@/components/layout/admin-topbar";
import { GlobalSearch } from "@/components/layout/global-search";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleToggleSearch = () => setSearchOpen((v) => !v);
    window.addEventListener("toggle-global-search", handleToggleSearch);
    return () =>
      window.removeEventListener("toggle-global-search", handleToggleSearch);
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-ivory font-sans text-ink">
        {/* Sidebar */}
        <AdminSidebar
          portal="admin"
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-col lg:pl-64">
          <AdminTopBar
            portal="admin"
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            onOpenGlobalSearch={() => setSearchOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Global Search Dialog */}
        <GlobalSearch
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}
