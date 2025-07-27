"use client";

import LanguageSwitcher from "@/components/shared/common/language-switcher";

// interface TopBarProps {
//   onMenuClick?: () => void;
// }

export function TopBarAuth() {
  return (
    <div className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3 justify-end flex-1">
        {/* <ThemeToggle /> */}
        <LanguageSwitcher variant="flag-only" />
      </div>
    </div>
  );
}
