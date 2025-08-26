// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./constants/AppRoutes/routes";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  // Skip middleware for Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  console.log("🔍 Middleware Debug:");
  console.log("- Path:", pathname);
  console.log("- Token exists:", !!token);
  console.log("- Login route:", ROUTES.AUTH.LOGIN);

  // Handle root path "/" - redirect based on token
  if (pathname === "/") {
    if (token) {
      console.log("✅ Token found, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      console.log("❌ No token, redirecting to login");
      return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.url));
    }
  }

  // If user has token but trying to access login, redirect to dashboard
  if (pathname.startsWith(ROUTES.AUTH.LOGIN)) {
    if (token) {
      console.log(
        "✅ Already authenticated, redirecting from login to dashboard"
      );
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      console.log("🔓 No token, allowing access to login page");
      return NextResponse.next();
    }
  }

  // Protected routes - require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      console.log("🔒 Protected route without token, redirecting to login");
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, req.url);
      loginUrl.searchParams.set("redirect", pathname); // Save intended destination
      return NextResponse.redirect(loginUrl);
    } else {
      console.log("✅ Protected route with valid token, allowing access");
      return NextResponse.next();
    }
  }

  // Allow access to all other routes
  console.log("➡️ Allowing access to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
