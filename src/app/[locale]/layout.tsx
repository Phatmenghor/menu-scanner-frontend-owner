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

const geistSans = localFont({
  src: "../../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
  console.log("LocaleLayout called with locale:", locale); // Debug log

  // This should trigger your i18n config
  const messages = await getMessages({ locale });
  console.log("Messages loaded in layout:", Object.keys(messages)); // Debug log

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientProviders>
            <ClientLayoutWrapper>
              {" "}
              <PageProgressBar />
              {children}
            </ClientLayoutWrapper>
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
