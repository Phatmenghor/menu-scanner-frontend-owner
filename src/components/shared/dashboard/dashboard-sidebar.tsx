"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { User } from "@/services/dashboard/user/user.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navItems, ROUTES } from "@/constants/AppRoutes/routes";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        // const response = await getUsersProfileService();
        // setAuthUser(response || null);
      } catch (error) {
        return;
      } finally {
        setIsLoading(false);
      }
    };
    loadUserProfile();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-[60px]", // Increased width for better spacing
          isMobile && !isOpen && "hidden"
        )}
      >
        {/* Header with better branding */}
        <div className="flex h-16 items-center justify-between border-b px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          {isOpen && (
            <Link
              href={ROUTES.DASHBOARD.INDEX}
              className="flex items-center gap-3 font-semibold text-base hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <img
                  src="/assets/favicon.ico"
                  alt="Menu Scanner"
                  className="w-8 h-8 rounded-lg shadow-sm"
                />
                {/* Optional: Add a subtle glow effect */}
                <div className="absolute inset-0 w-8 h-8 rounded-lg bg-primary/20 blur-sm -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-bold text-lg leading-tight">
                  Menu Scanner
                </span>
                <span className="text-muted-foreground text-xs font-normal">
                  Dashboard
                </span>
              </div>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 transition-transform duration-300 hover:bg-accent/50",
              !isOpen && "rotate-180"
            )}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-2 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-sm overflow-hidden",
                  pathname === item.href &&
                    "bg-primary text-primary-foreground shadow-md",
                  !isOpen && "justify-center px-0 mx-1"
                )}
                title={!isOpen ? item.title : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    pathname === item.href && "text-primary-foreground"
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-300 ease-in-out font-medium",
                    isOpen
                      ? "opacity-100 translate-x-0 max-w-xs"
                      : "opacity-0 -translate-x-4 max-w-0"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}
