// src/app/not-found.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Graphic */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary/20">404</div>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button asChild>
            <Link
              href="/dashboard/admin/platform-users"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <a
              href="mailto:support@menuscanner.com"
              className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
