"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/layout/main/dashboard-sidebar";
import { TopBar } from "./topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [pathname, isMobile]);

  return (
    <div className="dashboard-fixed-height flex bg-background">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={cn(
          "dashboard-content flex-1 transition-all duration-300",
          isMobile ? "w-full" : isSidebarOpen ? "ml-56" : "ml-[60px]"
        )}
      >
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="dashboard-main px-4 pt-4 md:pt-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
