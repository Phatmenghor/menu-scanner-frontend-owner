import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "@/i18n";

// Create the intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale, // Force zh-CN as default
  localeDetection: true,
  localePrefix: "always", // This ensures locale is always in URL
});

export default function middleware(req: NextRequest) {
  console.log("Middleware called for:", req.nextUrl.pathname); // Debug log

  const token = req.cookies.get("auth-token")?.value;
  const pathname = req.nextUrl.pathname;

  // Extract locale from pathname or default to zh-CN
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale =
    segments[0] && locales.includes(segments[0] as any)
      ? segments[0]
      : defaultLocale;

  // Define public paths that don't require authentication
  const publicPaths = [`/${currentLocale}/login`];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Handle root path - force redirect to zh-CN
  // if (pathname === "/") {
  //   console.log("Root path accessed, redirecting to zh-CN");
  //   return NextResponse.redirect(new URL(`/${currentLocale}/user/`, req.url));
  // }

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath && pathname !== "/") {
    console.log("Redirecting to login for locale:", currentLocale);
    const loginUrl = new URL(`/${currentLocale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user has token and trying to access login page, redirect to dashboard
  if (token && pathname === "/") {
    console.log("Redirecting to dashboard for locale:", currentLocale);
    const dashboardUrl = new URL(`/${currentLocale}/user/`, req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // For all other cases, apply intl middleware for locale handling
  const response = intlMiddleware(req);
  console.log(
    "Intl middleware response:",
    response?.headers.get("location") || "no redirect"
  );
  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(en|kh|zh-CN)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
