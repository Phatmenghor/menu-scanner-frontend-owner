"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Enhanced NProgress configuration for better UX
NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  trickle: true,
  parent: "body",
});

export default function PageProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    // Complete progress and remove body class when route changes
    NProgress.done();
    document.body.classList.remove("route-changing");
  }, [pathname]);

  useEffect(() => {
    // Enhanced click handler with body class for styling
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          const currentUrl = new URL(window.location.href);

          // Check if it's a different route on the same domain
          if (
            url.pathname !== currentUrl.pathname &&
            url.origin === currentUrl.origin &&
            !anchor.hasAttribute("data-no-progress") // Allow opt-out
          ) {
            // Add body class for enhanced styling
            document.body.classList.add("route-changing");

            // Start progress with slight delay for smoother UX
            setTimeout(() => {
              NProgress.start();
            }, 50);

            // Fallback to complete progress after reasonable time
            setTimeout(() => {
              if (NProgress.isStarted()) {
                NProgress.done();
                document.body.classList.remove("route-changing");
              }
            }, 10000); // 10 seconds fallback
          }
        } catch (error) {
          console.warn("Invalid URL in progress handler:", anchor.href);
        }
      }
    };

    // Enhanced form submit handler
    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;

      // Only show progress for forms that navigate away
      if (form.method === "get" || form.action !== window.location.href) {
        document.body.classList.add("route-changing");
        NProgress.start();
      }
    };

    // Add event listeners
    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleFormSubmit);

    // Cleanup function
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleFormSubmit);

      // Clean up any remaining progress and classes
      if (NProgress.isStarted()) {
        NProgress.done();
      }
      document.body.classList.remove("route-changing");
    };
  }, []);

  // Handle browser navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      document.body.classList.add("route-changing");
      NProgress.start();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle page visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && NProgress.isStarted()) {
        // Pause progress when tab is hidden
        NProgress.done();
        document.body.classList.remove("route-changing");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return null;
}
