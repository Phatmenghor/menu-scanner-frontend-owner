// src/lib/layout-config.ts

export const LAYOUT_CONFIG = {
  // App Information
  app: {
    name: "Menu Scanner",
    description: "Professional Restaurant Management Dashboard",
    version: "1.0.0",
    author: "Menu Scanner Team",
  },

  // SEO Configuration
  seo: {
    titleTemplate: "%s | Menu Scanner",
    defaultTitle: "Menu Scanner - Professional Restaurant Management",
    description:
      "Professional dashboard for menu scanning and restaurant management",
    keywords: [
      "dashboard",
      "menu",
      "scanner",
      "management",
      "restaurant",
      "pos",
      "food service",
    ],
    openGraph: {
      type: "website",
      siteName: "Menu Scanner",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Menu Scanner Dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@menuscanner",
    },
  },

  // Theme Configuration
  theme: {
    defaultMode: "system", // "light" | "dark" | "system"
    storageKey: "menu-scanner-theme",
  },

  // Layout Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Navigation Configuration
  navigation: {
    maxWidth: "1280px",
    sidebarWidth: "280px",
    collapsedSidebarWidth: "80px",
  },

  // Animation Configuration
  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },

  // API Configuration
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://152.42.219.13:8080",
    timeout: 10000,
    retries: 3,
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NODE_ENV === "production",
    enableErrorReporting: process.env.NODE_ENV === "production",
    enablePerformanceMonitoring: process.env.NODE_ENV === "production",
    enableHotReload: process.env.NODE_ENV === "development",
  },
} as const;

// Type exports for better TypeScript support
export type LayoutConfig = typeof LAYOUT_CONFIG;
export type ThemeMode = typeof LAYOUT_CONFIG.theme.defaultMode;
export type AnimationDuration = keyof typeof LAYOUT_CONFIG.animations.duration;
export type AnimationEasing = keyof typeof LAYOUT_CONFIG.animations.easing;
