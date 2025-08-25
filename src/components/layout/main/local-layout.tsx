"use client";

import { ReactNode } from "react";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  // You can use isSidebarOpen in your layout logic if needed
  return <>{children}</>;
}
