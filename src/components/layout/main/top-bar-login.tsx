"use client";

import { LogOut, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { logoutToken } from "@/utils/local-storage/token";
import { logoutRole } from "@/utils/local-storage/roles";
import LanguageSwitcher from "@/components/shared/common/language-switcher";

// interface TopBarProps {
//   onMenuClick?: () => void;
// }

export function TopBarAuth() {
  return (
    <>
      <div className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3 justify-end flex-1">
          {/* <ThemeToggle /> */}
          <LanguageSwitcher variant="flag-only" />
        </div>
      </div>
    </>
  );
}
