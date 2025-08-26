"use client";

import { ReactNode } from "react";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return <>{children}</>;
}
