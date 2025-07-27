// app/[locale]/layout.tsx
import { ReactNode } from "react";

import { TopBarAuth } from "@/components/layout/main/top-bar-login";

interface LocaleLayoutProps {
  children: ReactNode;
}

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBarAuth />
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}
