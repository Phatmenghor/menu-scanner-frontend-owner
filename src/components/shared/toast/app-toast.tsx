"use client";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Toast Types
export type ToastType = "success" | "error" | "warning" | "info" | "brand";

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

export interface ToastProps {
  type?: ToastType;
  message: string;
  description?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: ToastPosition;
}

export interface ToastData {
  id: number;
  type: ToastType;
  message: string;
  description?: string;
  isVisible: boolean;
  duration?: number;
  position?: ToastPosition;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  brand: (message: string, description?: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
}

interface ToastTypeConfig {
  type: ToastType;
  message: string;
  description: string;
  icon: string;
}

interface BrandColor {
  name: string;
  color: string;
  desc: string;
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

const Toast: React.FC<ToastProps> = ({
  type = "info",
  message,
  description,
  isVisible,
  onClose,
  duration = 5000,
  position = "top-right",
}) => {
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 50);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = (): string => {
    const baseStyles =
      "fixed z-50 flex items-start gap-4 p-5 rounded-2xl backdrop-blur-xl transition-all duration-500 ease-out transform max-w-sm shadow-2xl border overflow-hidden";

    const positionStyles: Record<ToastPosition, string> = {
      "top-right": "top-6 right-6",
      "top-left": "top-6 left-6",
      "bottom-right": "bottom-6 right-6",
      "bottom-left": "bottom-6 left-6",
      "top-center": "top-6 left-1/2 transform -translate-x-1/2",
      "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2",
    };

    const typeStyles: Record<ToastType, string> = {
      success:
        "bg-gradient-to-br from-emerald-50/90 to-green-100/80 border-emerald-200/60 shadow-emerald-500/20",
      error:
        "bg-gradient-to-br from-rose-50/90 to-red-100/80 border-rose-200/60 shadow-red-500/20",
      warning:
        "bg-gradient-to-br from-amber-50/90 to-yellow-100/80 border-amber-200/60 shadow-yellow-500/20",
      info: "bg-gradient-to-br from-sky-50/90 to-blue-100/80 border-sky-200/60 shadow-blue-500/20",
      brand:
        "bg-gradient-to-br from-pink-50/95 to-purple-100/90 border-pink-200/60 shadow-pink-500/25",
    };

    const visibilityStyles = isVisible
      ? "opacity-100 translate-y-0 scale-100 rotate-0"
      : "opacity-0 translate-y-8 scale-95 -rotate-2 pointer-events-none";

    return `${baseStyles} ${positionStyles[position]} ${typeStyles[type]} ${visibilityStyles}`;
  };

  const getIcon = (): JSX.Element => {
    const baseIconStyles = "w-6 h-6 flex-shrink-0 mt-0.5 drop-shadow-sm";

    const iconMap: Record<ToastType, JSX.Element> = {
      success: <CheckCircle className={`${baseIconStyles} text-emerald-600`} />,
      error: <AlertCircle className={`${baseIconStyles} text-rose-600`} />,
      warning: <AlertTriangle className={`${baseIconStyles} text-amber-600`} />,
      info: <Info className={`${baseIconStyles} text-sky-600`} />,
      brand: (
        <Sparkles
          className={`${baseIconStyles} text-pink-600`}
          style={{ color: "#A23469" }}
        />
      ),
    };

    return iconMap[type] || iconMap.info;
  };

  const getProgressBarColor = (): string => {
    const colorMap: Record<ToastType, string> = {
      success: "bg-gradient-to-r from-emerald-400 to-green-500",
      error: "bg-gradient-to-r from-rose-400 to-red-500",
      warning: "bg-gradient-to-r from-amber-400 to-yellow-500",
      info: "bg-gradient-to-r from-sky-400 to-blue-500",
      brand: "bg-gradient-to-r from-pink-400 to-purple-500",
    };

    return colorMap[type] || colorMap.info;
  };

  if (!isVisible) return null;

  return (
    <div className={getToastStyles()}>
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-30 animate-pulse">
        <div
          className={`absolute inset-0 rounded-2xl ${
            type === "brand"
              ? "bg-gradient-to-br from-pink-400/20 to-purple-400/20"
              : type === "success"
              ? "bg-gradient-to-br from-emerald-400/20 to-green-400/20"
              : type === "error"
              ? "bg-gradient-to-br from-rose-400/20 to-red-400/20"
              : type === "warning"
              ? "bg-gradient-to-br from-amber-400/20 to-yellow-400/20"
              : "bg-gradient-to-br from-sky-400/20 to-blue-400/20"
          }`}
        ></div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ease-linear ${getProgressBarColor()} shadow-lg`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4 w-full">
        <div className="relative">
          {getIcon()}
          {type === "brand" && (
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-ping"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-5 mb-1">
            {message}
          </p>
          {description && (
            <p className="text-xs text-gray-600 leading-4 opacity-90">
              {description}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          title="Close"
          className="flex-shrink-0 p-2 rounded-xl hover:bg-black/10 transition-all duration-200 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          <X className="w-4 h-4 text-gray-500 hover:text-gray-700 relative z-10 transition-colors duration-200" />
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

  const showToast = (options: ToastOptions): void => {
    const id = Date.now();
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
  };

  const closeToast = (id: number): void => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 500);
  };

  // Convenience methods
  const success = (message: string, description?: string): void => {
    showToast({ type: "success", message, description });
  };

  const error = (message: string, description?: string): void => {
    showToast({ type: "error", message, description });
  };

  const warning = (message: string, description?: string): void => {
    showToast({ type: "warning", message, description });
  };

  const info = (message: string, description?: string): void => {
    showToast({ type: "info", message, description });
  };

  const brand = (message: string, description?: string): void => {
    showToast({ type: "brand", message, description });
  };

  const contextValue: ToastContextType = {
    showToast,
    success,
    error,
    warning,
    info,
    brand,
  };

  // Set global function
  useEffect(() => {
    globalToastFunction = showToast;
    return () => {
      globalToastFunction = null;
    };
  }, []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Render all toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          description={toast.description}
          isVisible={toast.isVisible}
          onClose={() => closeToast(toast.id)}
          position={toast.position}
          duration={toast.duration}
        />
      ))}
    </ToastContext.Provider>
  );
};
