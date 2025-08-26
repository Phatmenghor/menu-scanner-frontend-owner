// src/app/loading.tsx
export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {/* Animated Logo or Spinner */}
        <div className="relative">
          <div className="h-12 w-12 mx-auto">
            {/* Main spinner */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>

          {/* Pulsing backdrop */}
          <div className="absolute inset-0 -m-4 rounded-full bg-primary/5 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your content
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1 pt-4">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse animation-delay-200"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}
