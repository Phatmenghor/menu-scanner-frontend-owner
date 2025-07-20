"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/store/store";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
}
