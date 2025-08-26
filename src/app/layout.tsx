// src/app/layout.tsx
import localFont from "next/font/local";
import "../styles/globals.css";
import { ReactNode } from "react";
import { ClientProviders } from "@/context/provider/client-provider";
import { ClientLayoutWrapper } from "@/components/layout/local-layout";
import PageProgressBar from "@/components/shared/progressbar/Nprogressbar/global-n-progress";
import { ToastProvider } from "@/components/shared/toast/app-toast";

// Font Configuration with optimized settings
const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "SFMono-Regular"],
});

interface RootLayoutProps {
  children: ReactNode;
}

// Enhanced metadata (removed viewport - now separate export)
export const metadata = {
  title: {
    template: "%s | Menu Scanner",
    default: "Menu Scanner - Professional Restaurant Management",
  },
  description:
    "Professional dashboard for menu scanning and restaurant management",
  keywords: ["dashboard", "menu", "scanner", "management", "restaurant"],
  authors: [{ name: "Menu Scanner Team" }],
  creator: "Menu Scanner",
  publisher: "Menu Scanner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: false, // Since this is a private dashboard
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="http://152.42.219.13:8080" />
        <link rel="dns-prefetch" href="http://152.42.219.13:8080" />

        {/* Mobile optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`
          min-h-screen 
          bg-background 
          font-sans 
          antialiased 
          text-foreground
          selection:bg-primary/20 
          selection:text-primary-foreground
          overflow-x-hidden
        `}
      >
        <ClientProviders>
          <ClientLayoutWrapper>
            <PageProgressBar />
            <ToastProvider>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
              </div>
            </ToastProvider>
          </ClientLayoutWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
