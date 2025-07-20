let NProgressModule: any = null;

// Initialize NProgress
const initNProgress = async () => {
  if (!NProgressModule) {
    NProgressModule = await import("nprogress");
  }
  return NProgressModule.default;
};

// Global utility functions
export const startProgress = async () => {
  const NProgress = await initNProgress();
  NProgress.start();
};

export const stopProgress = async () => {
  const NProgress = await initNProgress();
  NProgress.done();
};

export const incrementProgress = async (amount?: number) => {
  const NProgress = await initNProgress();
  NProgress.inc(amount);
};

// Global hook for manual control
export const useGlobalProgress = () => {
  return {
    start: startProgress,
    stop: stopProgress,
    increment: incrementProgress,
  };
};

// Global progress for API calls or async operations
export const withProgress = async <T>(
  asyncFn: () => Promise<T>,
  options?: { autoStart?: boolean; autoStop?: boolean }
): Promise<T> => {
  const { autoStart = true, autoStop = true } = options || {};

  try {
    if (autoStart) await startProgress();
    const result = await asyncFn();
    return result;
  } finally {
    if (autoStop) await stopProgress();
  }
};

// next.config.js - Global webpack configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any) => {
    // Ensure NProgress is available globally
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
