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
import { navigationGroups, ROUTES } from "@/constants/AppRoutes/routes";
import { getUserInfo } from "@/utils/local-storage/userInfo";
import { UserAuthResponse } from "@/models/auth/auth.response";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [authUser, setAuthUser] = useState<UserAuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const user = getUserInfo();
        setAuthUser({
          email: user?.email || "",
          fullName: user?.fullName || "",
          userId: user?.userId || "",
          businessId: user?.businessId || "",
          userType: user?.userType || "",
        });
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
      {/* Mobile overlay with blur effect */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md"
          onClick={onToggle}
        />
      )}

      {/* Sidebar with glassmorphism effect */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-out shadow-xl",
          isOpen ? "w-64" : "w-16",
          isMobile && !isOpen && "hidden"
        )}
      >
        {/* Enhanced Header with gradient and better typography */}
        <div className="relative flex h-20 items-center justify-between border-b border-border/50 px-4 bg-gradient-to-br from-primary/5 via-background/50 to-accent/5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50 blur-3xl"></div>

          {isOpen && (
            <Link
              href={ROUTES.DASHBOARD.INDEX}
              className="relative flex items-center gap-3 group transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  <span className="text-white font-bold text-lg">MS</span>
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-bold text-xl leading-tight tracking-tight">
                  Menu Scanner
                </span>
                <span className="text-muted-foreground text-xs font-medium tracking-wide">
                  Advanced Dashboard
                </span>
              </div>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "relative h-9 w-9 rounded-xl transition-all duration-300 hover:bg-accent/50 hover:scale-110 group",
              !isOpen && "rotate-180"
            )}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {isOpen ? (
              <ChevronLeft className="h-4 w-4 relative z-10" />
            ) : (
              <ChevronRight className="h-4 w-4 relative z-10" />
            )}
          </Button>
        </div>

        {/* Enhanced Navigation with modern spacing */}
        <ScrollArea className="flex-1 py-6">
          <nav className="px-4 space-y-8">
            {navigationGroups.map((group, groupIndex) => (
              <div key={`${group.items}-${group.title}`} className="space-y-3">
                {/* Modern Group Title with subtle indicator */}
                {isOpen && (
                  <div className="flex items-center gap-2 px-3">
                    <div className="w-1 h-1 rounded-full bg-primary/60"></div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] select-none">
                      {group.title}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
                  </div>
                )}

                {/* Elegant separator for collapsed state */}
                {!isOpen && groupIndex > 0 && (
                  <div className="flex justify-center">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  </div>
                )}

                {/* Enhanced Navigation Items with micro-interactions */}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={`${item.href}-${item.title}`}
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 overflow-hidden",
                          "hover:bg-accent/50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]",
                          isActive &&
                            "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20",
                          !isOpen && "justify-center mx-0 w-12 h-12 p-0"
                        )}
                        title={!isOpen ? item.title : undefined}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl"></div>
                        )}

                        {/* Icon with enhanced styling */}
                        <div
                          className={cn(
                            "relative flex items-center justify-center",
                            isActive && "text-primary-foreground",
                            !isActive &&
                              "text-muted-foreground group-hover:text-foreground",
                            "transition-colors duration-300"
                          )}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {isActive && (
                            <div className="absolute -inset-2 bg-primary/20 blur-sm rounded-full"></div>
                          )}
                        </div>

                        {/* Text with smooth animation */}
                        <div
                          className={cn(
                            "flex flex-col transition-all duration-300 ease-out relative z-10",
                            isOpen
                              ? "opacity-100 translate-x-0 max-w-none"
                              : "opacity-0 -translate-x-2 max-w-0 overflow-hidden"
                          )}
                        >
                          <span
                            className={cn(
                              "font-semibold leading-tight whitespace-nowrap",
                              isActive
                                ? "text-primary-foreground"
                                : "text-foreground group-hover:text-foreground"
                            )}
                          >
                            {item.title}
                          </span>
                          <span
                            className={cn(
                              "text-xs leading-tight whitespace-nowrap transition-colors duration-300",
                              isActive
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground/70 group-hover:text-muted-foreground"
                            )}
                          >
                            {item.description}
                          </span>
                        </div>

                        {/* Subtle hover effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Modern Footer with user info (when expanded) */}
        {isOpen && (
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors duration-300 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {authUser?.fullName || "GUEST USER"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {authUser?.email || "john@example.com"}
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
