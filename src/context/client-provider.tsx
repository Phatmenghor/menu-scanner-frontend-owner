"use client";

import store from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
}
