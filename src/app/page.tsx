// src/app/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ROUTES } from "@/constants/AppRoutes/routes";

export const metadata = {
  title: "Redirecting...",
  description: "Redirecting to the appropriate page",
};

export default async function RootPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token");

  // Server-side redirect based on authentication status
  if (token?.value) {
    // User is authenticated, redirect to dashboard
    redirect("/dashboard");
  } else {
    // User is not authenticated, redirect to login
    redirect(ROUTES.AUTH.LOGIN);
  }

  // This should never render, but just in case
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
