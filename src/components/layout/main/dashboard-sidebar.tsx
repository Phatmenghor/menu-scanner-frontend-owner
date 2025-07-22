"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sidebarItems } from "@/constants/AppRoutes/routes";
import { getUserInfo } from "@/utils/local-storage/userInfo";
import { UserAuthResponse } from "@/models/auth/auth.response";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [authUser, setAuthUser] = useState<UserAuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

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

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
    onToggle();
    // Close all sections when collapsing
    if (!collapsed) {
      setOpenSections({});
    }
  };

  const renderNavItems = (isCollapsed = false) => (
    <nav className="flex flex-col gap-1">
      {sidebarItems.map((route) => {
        const isActive = route.href ? pathname === route.href : false;

        if (route.subroutes) {
          const isOpen = route.section ? openSections[route.section] : false;

          return (
            <div key={route.title} className="w-full">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:bg-primary/10 hover:text-primary rounded relative",
                  isActive &&
                    "bg-primary/15 text-primary font-medium border-l-2 border-primary"
                )}
                onClick={() =>
                  route.section && !isCollapsed && toggleSection(route.section)
                }
                aria-expanded={isOpen}
                title={isCollapsed ? route.title : undefined}
              >
                <div className="flex w-full items-center">
                  {route.icon && (
                    <route.icon className="w-5 h-5 flex-shrink-0" />
                  )}
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 truncate">{route.title}</span>
                      <div className="ml-auto">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Button>

              {!isCollapsed && isOpen && (
                <div className="relative ml-6 mt-1 space-y-1">
                  {/* Vertical connecting line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>

                  {route.subroutes.map((subroute, index) => (
                    <div key={subroute.title} className="relative">
                      {/* Horizontal connecting line */}
                      <div className="absolute left-0 top-1/2 w-4 h-px bg-gray-300"></div>

                      {/* Corner connector for last item - stops vertical line */}
                      {index === route.subroutes!.length - 1 && (
                        <div
                          className="absolute left-0 top-1/2 w-px bg-white"
                          style={{ height: "50%" }}
                        ></div>
                      )}

                      <Button
                        variant="ghost"
                        asChild
                        className={cn(
                          "w-full justify-start hover:bg-primary/10 hover:text-primary pl-6 rounded",
                          pathname === subroute.href &&
                            "bg-primary/15 text-primary font-medium border-l-2 border-primary"
                        )}
                      >
                        <Link
                          href={subroute.href}
                          className="flex items-center gap-2"
                        >
                          <span className="truncate">{subroute.title}</span>
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Button
            key={route.title}
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start hover:bg-primary/10 hover:text-primary rounded",
              pathname === route.href &&
                "bg-primary/15 text-primary font-medium border-l-2 border-primary"
            )}
          >
            <Link
              href={route.href || "#"}
              className="flex items-center gap-3 px-3 py-2"
              title={collapsed ? route.title : undefined}
            >
              {route.icon && <route.icon className="w-5 h-5 flex-shrink-0" />}
              {!collapsed && <span className="truncate">{route.title}</span>}
            </Link>
          </Button>
        );
      })}
    </nav>
  );

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
          collapsed ? "w-16" : "w-56",
          isMobile && !isOpen && "hidden"
        )}
      >
        {/* Enhanced Header with gradient and better typography */}
        <div className="relative flex h-20 items-center justify-between border-b border-border/50 px-4 bg-gradient-to-br from-primary/5 via-background/50 to-accent/5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50 blur-3xl"></div>

          {!collapsed && (
            <Link
              href="/"
              className="relative flex items-center gap-3 group transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-all duration-300 overflow-hidden">
                  <Image
                    src="/assets/favicon.ico"
                    alt="KSIT Logo"
                    width={24}
                    height={24}
                    className="rounded object-contain"
                    priority
                  />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-bold text-sm leading-tight tracking-tight">
                  Menu Scanner
                </span>
                <span className="text-muted-foreground text-xs font-medium tracking-wide">
                  Dashboard
                </span>
              </div>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className={cn(
              "relative h-9 w-9 rounded-xl transition-all duration-300 hover:bg-accent/50 hover:scale-110 group",
              collapsed && "rotate-180"
            )}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {!collapsed ? (
              <ChevronLeft className="h-4 w-4 relative z-10" />
            ) : (
              <ChevronRight className="h-4 w-4 relative z-10" />
            )}
          </Button>
        </div>

        {/* Enhanced Navigation with modern spacing */}
        <ScrollArea className="flex-1 py-6">
          <nav className="px-4 space-y-2">{renderNavItems(collapsed)}</nav>
        </ScrollArea>

        {/* Modern Footer with user info */}
        {!collapsed && authUser && (
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors duration-300 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {authUser.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {authUser.fullName || "GUEST USER"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {authUser.email || "user@example.com"}
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
            </div>
          </div>
        )}

        {/* Collapsed user info */}
        {collapsed && authUser && (
          <div className="border-t border-border/50 p-2">
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {authUser.fullName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
