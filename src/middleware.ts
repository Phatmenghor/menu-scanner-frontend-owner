// src/middleware.ts - Simplified version
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/.well-known") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth-token")?.value;

  console.log(
    `🚀 Middleware - Path: ${pathname}, Auth: ${token ? "✅" : "❌"}`
  );

  // Handle root path - ALWAYS redirect
  if (pathname === "/") {
    if (token) {
      console.log("🏠 Root → Dashboard (authenticated)");
      return NextResponse.redirect(new URL("/admin/platform-users", req.url));
    } else {
      console.log("🏠 Root → Login (not authenticated)");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!token) {
      console.log("🔒 Protected route → Login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If user has token and tries to access login, redirect to dashboard
  if (pathname === "/login" && token) {
    console.log("🔑 Login page → Dashboard (already authenticated)");
    return NextResponse.redirect(
      new URL("/dashboard/admin/platform-users", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|\\.well-known).*)"],
};
