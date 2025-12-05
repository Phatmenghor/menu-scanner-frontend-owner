"use client";

import store from "@/features/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}
