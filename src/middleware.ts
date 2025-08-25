import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./constants/AppRoutes/routes";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const pathname = req.nextUrl.pathname;

  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("pathname:", pathname);
  console.log("token exists:", !!token);
  console.log("ROUTES.AUTH.LOGIN:", ROUTES.AUTH.LOGIN);
  console.log("========================");

  // If already on login page, allow
  if (pathname.startsWith(ROUTES.AUTH.LOGIN)) {
    console.log("Already on login page, allowing...");
    return NextResponse.next();
  }

  // If accessing root without token, redirect to login
  if (pathname === "/" && !token) {
    console.log("No token on root, redirecting to:", ROUTES.AUTH.LOGIN);
    const redirectUrl = new URL(ROUTES.AUTH.LOGIN, req.url);
    console.log("Full redirect URL:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  // If not authenticated on protected routes
  if (!token) {
    console.log(
      "No token on protected route, redirecting to:",
      ROUTES.AUTH.LOGIN
    );
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.url));
  }

  console.log("Proceeding normally...");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
