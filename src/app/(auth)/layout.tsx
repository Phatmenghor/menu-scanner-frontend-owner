// src/app/(auth)/layout.tsx
import { ReactNode } from "react";
import { TopBarAuth } from "@/components/layout/top-bar-login";

interface AuthLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Authentication",
  description: "Sign in to your Menu Scanner account",
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted/30">
      {/* Top Navigation Bar */}
      <TopBarAuth />

      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Background Card Effect */}
          <div className="relative">
            {/* Subtle background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl opacity-70" />

            {/* Main Content Card */}
            <div className="relative bg-card border border-border/50 rounded-xl p-8 shadow-lg backdrop-blur-sm">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Menu Scanner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
