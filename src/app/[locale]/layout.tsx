// app/[locale]/layout.tsx
import localFont from "next/font/local";
import "../../styles/globals.css";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ClientProviders } from "@/context/provider/client-provider";
import { ClientLayoutWrapper } from "@/components/layout/main/local-layout";
import { locales } from "@/i18n";
import PageProgressBar from "@/components/shared/progressbar/Nprogressbar/global-n-progress";
import { ToastProvider } from "@/components/shared/toast/app-toast";

// Font Configuration
const geistSans = localFont({
  src: "../../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: "../../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Load messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`
        min-h-screen 
        bg-background 
        font-sans 
        antialiased 
        text-foreground
        selection:bg-primary/20 
        selection:text-primary-foreground
      `}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// Optional: Add metadata
export const metadata = {
  title: {
    template: "%s | Menu Scanner",
    default: "Menu Scanner Dashboard",
  },
  description: "Professional dashboard for menu scanning and management",
  keywords: ["dashboard", "menu", "scanner", "management"],
};
