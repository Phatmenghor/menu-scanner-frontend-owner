// src/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Graphic */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button asChild className="flex-1">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="javascript:history.back()">Go Back</Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              href="mailto:support@menuscanner.com"
              className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
