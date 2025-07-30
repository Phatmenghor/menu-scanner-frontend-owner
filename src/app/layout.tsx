// app/layout.tsx
import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

// Root layout - minimal since locale layout handles everything
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}

// Global metadata that applies to all locales
export const metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    template: "%s | Menu Scanner",
    default: "Menu Scanner - Professional Dashboard",
  },
  description:
    "Advanced menu scanning and management platform with comprehensive analytics and user management.",
  keywords: [
    "menu scanner",
    "restaurant management",
    "digital menu",
    "QR code menu",
    "hospitality tech",
    "dashboard",
  ],
  authors: [{ name: "Menu Scanner Team" }],
  creator: "Menu Scanner",
  publisher: "Menu Scanner",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Menu Scanner - Professional Dashboard",
    description: "Advanced menu scanning and management platform",
    siteName: "Menu Scanner",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu Scanner - Professional Dashboard",
    description: "Advanced menu scanning and management platform",
    creator: "@menuscanner",
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: "technology",
};
