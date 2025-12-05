"use client";

import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/utils/local-storage/token";
import { clearRoles } from "@/utils/local-storage/roles";
import { clearUserInfo } from "@/utils/local-storage/userInfo";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useIsMobile } from "@/redux/store/use-mobile";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleLogout = () => {
    clearToken();
    clearRoles();
    clearUserInfo();

    setShowLogoutAlert(false);

    setTimeout(() => {
      router.replace(ROUTES.AUTH.LOGIN);
    }, 100);
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b bg-background px-4 sm:px-6">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        <div className="flex items-center gap-3 justify-end flex-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogoutAlert(true)}
            className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-medium">Logout</span>
          </Button>
        </div>
      </header>
      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <AlertDialogTitle className="text-left text-lg font-semibold">
                  Sign Out
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-left text-sm text-muted-foreground mt-2">
              Are you sure you want to sign out of your account? You'll need to
              sign in again to access your dashboard and saved data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
            <AlertDialogCancel className="duration-300 mt-2 sm:mt-0 w-full sm:w-auto">
              Stay Signed In
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
