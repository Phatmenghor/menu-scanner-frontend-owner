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
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// Toast Types
export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

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
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (toast.isVisible && toast.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, toast.duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toast.isVisible, toast.duration]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  }, [toast.id, onClose]);

  const getToastStyles = (): string => {
    const baseStyles =
      "fixed z-50 flex items-center gap-3 p-4 rounded-lg bg-white border shadow-lg transition-all duration-200 ease-out min-w-80 max-w-md";

    const positionStyles: Record<ToastPosition, string> = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
    };

    const typeStyles: Record<ToastType, string> = {
      success: "border-green-200 bg-green-50",
      error: "border-red-200 bg-red-50",
      warning: "border-orange-200 bg-orange-50",
      info: "border-blue-200 bg-blue-50",
    };

    const visibilityStyles =
      toast.isVisible && !isExiting
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2";

    return `${baseStyles} ${positionStyles[toast.position]} ${
      typeStyles[toast.type]
    } ${visibilityStyles}`;
  };

  const getIcon = (): JSX.Element => {
    const baseIconStyles = "w-5 h-5 flex-shrink-0";

    const iconMap: Record<ToastType, JSX.Element> = {
      success: <CheckCircle className={`${baseIconStyles} text-green-600`} />,
      error: <AlertCircle className={`${baseIconStyles} text-red-600`} />,
      warning: (
        <AlertTriangle className={`${baseIconStyles} text-orange-600`} />
      ),
      info: <Info className={`${baseIconStyles} text-blue-600`} />,
    };

    return iconMap[toast.type] || iconMap.info;
  };

  return (
    <div className={getToastStyles()}>
      {/* Content */}
      <div className="flex items-center gap-3 flex-1">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{toast.message}</p>
          {toast.description && (
            <p className="text-xs text-gray-600 mt-1">{toast.description}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-gray-100 transition-colors duration-150"
          title="Close"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// Toast Provider Component
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultPosition = "top-right",
  defaultDuration = 4000,
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

  const contextValue: ToastContextType = useMemo(
    () => ({
      showToast,
      success,
      error,
      warning,
      info,
    }),
    [showToast, success, error, warning, info]
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
