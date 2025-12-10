"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

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
    NProgress.done();
    document.body.classList.remove("route-changing");
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          const currentUrl = new URL(window.location.href);

          if (
            url.pathname !== currentUrl.pathname &&
            url.origin === currentUrl.origin &&
            !anchor.hasAttribute("data-no-progress")
          ) {
            document.body.classList.add("route-changing");

            setTimeout(() => {
              NProgress.start();
            }, 50);

            setTimeout(() => {
              if (NProgress.isStarted()) {
                NProgress.done();
                document.body.classList.remove("route-changing");
              }
            }, 10000);
          }
        } catch (error) {
          console.warn("Invalid URL in progress handler:", anchor.href);
        }
      }
    };

    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;

      const isInDialog = form.closest('[role="dialog"]');
      const hasNoProgress = form.hasAttribute("data-no-progress");

      if (isInDialog || hasNoProgress) {
        return;
      }

      if (form.method === "get" || form.action !== window.location.href) {
        document.body.classList.add("route-changing");
        NProgress.start();
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleFormSubmit);

      if (NProgress.isStarted()) {
        NProgress.done();
      }
      document.body.classList.remove("route-changing");
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      document.body.classList.add("route-changing");
      NProgress.start();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && NProgress.isStarted()) {
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
