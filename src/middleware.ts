import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth-token")?.value;

  console.log(`Middleware: ${pathname}, Token: ${token ? "exists" : "none"}`);

  // Redirect root to login if no token, admin if has token
  if (pathname === "/") {
    if (token) {
      console.log("Root access with token -> redirecting to /admin");
      return NextResponse.redirect(new URL("/admin", req.url));
    } else {
      console.log("Root access without token -> redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      console.log("Admin access without token -> redirecting to /login");
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to admin if accessing login with token
  if (pathname === "/login" && token) {
    console.log("Login access with token -> redirecting to /admin");
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  console.log("Middleware: allowing request to proceed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
