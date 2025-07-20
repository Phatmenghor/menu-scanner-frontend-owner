"use client";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Sparkles,
  Heart,
  Star,
  Flame,
} from "lucide-react";

// Toast Types
export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "brand"
  | "celebration"
  | "love"
  | "fire";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface ToastOptions {
  type?: ToastType;
  message: string;
  description?: string;
  duration?: number;
  position?: ToastPosition;
}

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  isVisible: boolean;
  duration: number;
  position: ToastPosition;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  brand: (message: string, description?: string) => void;
  celebration: (message: string, description?: string) => void;
  love: (message: string, description?: string) => void;
  fire: (message: string, description?: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
}

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook to use toast
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Global toast function
let globalToastFunction: ((options: ToastOptions) => void) | null = null;

export const AppToast = (options: ToastOptions): void => {
  if (globalToastFunction) {
    globalToastFunction(options);
  } else {
    console.warn("AppToast called before ToastProvider is mounted");
  }
};

// Individual Toast Component
const Toast: React.FC<{
  toast: ToastData;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const [progress, setProgress] = useState<number>(100);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (toast.isVisible && toast.duration > 0) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (toast.duration / 50);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, toast.duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [toast.isVisible, toast.duration]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  }, [toast.id, onClose]);

  const getToastStyles = (): string => {
    const baseStyles =
      "fixed z-50 flex items-start gap-4 p-6 rounded-3xl backdrop-blur-2xl transition-all duration-500 ease-out max-w-sm shadow-2xl border overflow-hidden";

    const positionStyles: Record<ToastPosition, string> = {
      "top-right": "top-6 right-6",
      "top-left": "top-6 left-6",
      "bottom-right": "bottom-6 right-6",
      "bottom-left": "bottom-6 left-6",
      "top-center": "top-6 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    };

    const typeStyles: Record<ToastType, string> = {
      success:
        "bg-gradient-to-br from-emerald-400/20 via-green-300/15 to-teal-400/25 border-emerald-300/40 shadow-emerald-400/30",
      error:
        "bg-gradient-to-br from-red-400/20 via-rose-300/15 to-pink-400/25 border-red-300/40 shadow-red-400/30",
      warning:
        "bg-gradient-to-br from-amber-400/20 via-orange-300/15 to-yellow-400/25 border-amber-300/40 shadow-amber-400/30",
      info: "bg-gradient-to-br from-blue-400/20 via-cyan-300/15 to-indigo-400/25 border-blue-300/40 shadow-blue-400/30",
      brand:
        "bg-gradient-to-br from-purple-400/25 via-pink-300/20 to-violet-400/30 border-purple-300/50 shadow-purple-400/35",
      celebration:
        "bg-gradient-to-br from-yellow-400/25 via-orange-300/20 to-pink-400/30 border-yellow-300/50 shadow-yellow-400/35",
      love: "bg-gradient-to-br from-pink-400/25 via-red-300/20 to-rose-400/30 border-pink-300/50 shadow-pink-400/35",
      fire: "bg-gradient-to-br from-orange-400/25 via-red-300/20 to-yellow-400/30 border-orange-300/50 shadow-orange-400/35",
    };

    const visibilityStyles =
      toast.isVisible && !isExiting
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-4 scale-95";

    return `${baseStyles} ${positionStyles[toast.position]} ${
      typeStyles[toast.type]
    } ${visibilityStyles}`;
  };

  const getIcon = (): JSX.Element => {
    const baseIconStyles = "w-7 h-7 flex-shrink-0 mt-0.5 drop-shadow-lg";

    const iconMap: Record<ToastType, JSX.Element> = {
      success: <CheckCircle className={`${baseIconStyles} text-emerald-600`} />,
      error: <AlertCircle className={`${baseIconStyles} text-red-600`} />,
      warning: <AlertTriangle className={`${baseIconStyles} text-amber-600`} />,
      info: <Info className={`${baseIconStyles} text-blue-600`} />,
      brand: <Sparkles className={`${baseIconStyles} text-purple-600`} />,
      celebration: <Star className={`${baseIconStyles} text-yellow-600`} />,
      love: <Heart className={`${baseIconStyles} text-pink-600`} />,
      fire: <Flame className={`${baseIconStyles} text-orange-600`} />,
    };

    return iconMap[toast.type] || iconMap.info;
  };

  const getProgressBarColor = (): string => {
    const colorMap: Record<ToastType, string> = {
      success: "bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500",
      error: "bg-gradient-to-r from-red-500 via-rose-400 to-pink-500",
      warning: "bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500",
      info: "bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500",
      brand: "bg-gradient-to-r from-purple-500 via-pink-400 to-violet-500",
      celebration:
        "bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-500",
      love: "bg-gradient-to-r from-pink-500 via-red-400 to-rose-500",
      fire: "bg-gradient-to-r from-orange-500 via-red-400 to-yellow-500",
    };

    return colorMap[toast.type] || colorMap.info;
  };

  return (
    <div className={getToastStyles()}>
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 opacity-40 animate-pulse">
          <div
            className={`absolute inset-0 ${
              toast.type === "success"
                ? "bg-gradient-to-br from-emerald-400/30 to-green-500/30"
                : toast.type === "error"
                ? "bg-gradient-to-br from-red-400/30 to-rose-500/30"
                : toast.type === "warning"
                ? "bg-gradient-to-br from-amber-400/30 to-orange-500/30"
                : toast.type === "info"
                ? "bg-gradient-to-br from-blue-400/30 to-cyan-500/30"
                : toast.type === "brand"
                ? "bg-gradient-to-br from-purple-400/30 to-pink-500/30"
                : toast.type === "celebration"
                ? "bg-gradient-to-br from-yellow-400/30 to-orange-500/30"
                : toast.type === "love"
                ? "bg-gradient-to-br from-pink-400/30 to-red-500/30"
                : "bg-gradient-to-br from-orange-400/30 to-red-500/30"
            }`}
          ></div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10 overflow-hidden rounded-b-3xl">
        <div
          className={`h-full transition-all duration-100 ease-linear ${getProgressBarColor()} shadow-lg`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4 w-full">
        <div className="relative">
          <div
            className={
              toast.type === "success"
                ? "animate-bounce"
                : toast.type === "brand"
                ? "animate-spin"
                : toast.type === "celebration"
                ? "animate-bounce"
                : "animate-pulse"
            }
          >
            {getIcon()}
          </div>

          {/* Special glow effects */}
          {(toast.type === "brand" ||
            toast.type === "celebration" ||
            toast.type === "love" ||
            toast.type === "fire") && (
            <div
              className={`absolute -inset-2 opacity-30 animate-ping rounded-full ${
                toast.type === "brand"
                  ? "bg-gradient-to-r from-purple-400 to-pink-400"
                  : toast.type === "celebration"
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                  : toast.type === "love"
                  ? "bg-gradient-to-r from-pink-400 to-red-400"
                  : "bg-gradient-to-r from-orange-400 to-red-400"
              }`}
            ></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-5 mb-1 drop-shadow-sm">
            {toast.message}
          </p>
          {toast.description && (
            <p className="text-xs text-gray-700 leading-4 opacity-90 font-medium">
              {toast.description}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-2.5 rounded-2xl hover:bg-white/20 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm border border-white/10 hover:border-white/20"
          title="Close"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800 relative z-10 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
};

// Toast Provider Component
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultPosition = "top-right",
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback(
    (options: ToastOptions): void => {
      const id = `toast-${counterRef.current++}-${Date.now()}`;
      const newToast: ToastData = {
        id,
        type: options.type || "info",
        message: options.message,
        description: options.description,
        isVisible: true,
        duration: options.duration || defaultDuration,
        position: options.position || defaultPosition,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    [defaultDuration, defaultPosition]
  );

  const removeToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback(
    (message: string, description?: string): void => {
      showToast({ type: "success", message, description });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, description?: string): void => {
      showToast({ type: "error", message, description });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, description?: string): void => {
      showToast({ type: "warning", message, description });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, description?: string): void => {
      showToast({ type: "info", message, description });
    },
    [showToast]
  );

  const brand = useCallback(
    (message: string, description?: string): void => {
      showToast({ type: "brand", message, description });
    },
    [showToast]
  );

  const celebration = useCallback(
    (message: string, description?: string): void => {
      showToast({ type: "celebration", message, description });
    },
    [showToast]
  );

  const love = useCallback(
    (message: string, description?: string): void => {
      showToast({ type: "love", message, description });
    },
    [showToast]
  );

  const fire = useCallback(
    (message: string, description?: string): void => {
      showToast({ type: "fire", message, description });
    },
    [showToast]
  );

  const contextValue: ToastContextType = useMemo(
    () => ({
      showToast,
      success,
      error,
      warning,
      info,
      brand,
      celebration,
      love,
      fire,
    }),
    [showToast, success, error, warning, info, brand, celebration, love, fire]
  );

  // Set global function
  useEffect(() => {
    globalToastFunction = showToast;
    return () => {
      globalToastFunction = null;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </ToastContext.Provider>
  );
};
