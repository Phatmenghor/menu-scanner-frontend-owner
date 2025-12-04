"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/store";
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
