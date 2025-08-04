import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./constants/AppRoutes/routes";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const pathname = req.nextUrl.pathname;

  // If already on login page, allow
  if (pathname.startsWith(ROUTES.AUTH.LOGIN)) {
    return NextResponse.next();
  }

  // If not authenticated
  if (!token) {
    // Avoid infinite loop
    console.log("No token, redirecting to login...");
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.url));
  }

  // If authenticated and trying to access root, redirect to dashboard
  if (pathname === "/") {
    console.log("Authenticated, redirecting to /user/");
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD.USERS, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"], // Matches all non-static routes
};
