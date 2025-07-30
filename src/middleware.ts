import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "@/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: "always",
});

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const pathname = req.nextUrl.pathname;

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale =
    segments[0] && locales.includes(segments[0] as any)
      ? segments[0]
      : defaultLocale;

  const publicPaths = [`/${currentLocale}/login`];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 🔄 Redirect "/" → "/[locale]/user/" or "/[locale]/login"
  if (pathname === "/") {
    const destination = token
      ? `/${currentLocale}/user/`
      : `/${currentLocale}/login`;
    console.log("Root path redirect to:", destination);
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // 🔐 No token and not on login page → redirect to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL(`/${currentLocale}/login`, req.url);
    console.log("Redirecting to login:", loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // 🧭 Let intl middleware handle everything else
  return intlMiddleware(req);
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
