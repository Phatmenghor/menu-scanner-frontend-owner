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

// ============================================
// IMPROVED GLOBAL TOAST API
// ============================================

interface ToastHandler {
  (options: ToastOptions): void;
}

interface ToastQueue {
  handler: ToastHandler | null;
  queue: ToastOptions[];
}

const toastQueue: ToastQueue = {
  handler: null,
  queue: [],
};

// Process queued toasts when handler is available
const processQueue = () => {
  if (toastQueue.handler && toastQueue.queue.length > 0) {
    toastQueue.queue.forEach((options) => {
      toastQueue.handler!(options);
    });
    toastQueue.queue = [];
  }
};

// Show toast function (handles queueing)
const showToastPlease = (options: ToastOptions): void => {
  if (toastQueue.handler) {
    toastQueue.handler(options);
  } else {
    toastQueue.queue.push(options);
  }
};

// Clean, easy-to-use global toast object
export const showToast = {
  success: (message: string, description?: string): void => {
    showToastPlease({ type: "success", message, description });
  },

  error: (message: string, description?: string): void => {
    showToastPlease({ type: "error", message, description });
  },

  warning: (message: string, description?: string): void => {
    showToastPlease({ type: "warning", message, description });
  },

  info: (message: string, description?: string): void => {
    showToastPlease({ type: "info", message, description });
  },

  // Custom toast with all options
  custom: (options: ToastOptions): void => {
    showToastPlease(options);
  },

  // Alias for custom
  show: (options: ToastOptions): void => {
    showToastPlease(options);
  },
};

// ============================================
// INDIVIDUAL TOAST COMPONENT
// ============================================

const Toast: React.FC<{
  toast: ToastData;
  onClose: (id: string) => void;
}> = ({ toast: toastData, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (toastData.isVisible && toastData.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, toastData.duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toastData.isVisible, toastData.duration]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(toastData.id), 200);
  }, [toastData.id, onClose]);

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
      toastData.isVisible && !isExiting
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2";

    return `${baseStyles} ${positionStyles[toastData.position]} ${
      typeStyles[toastData.type]
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
    return iconMap[toastData.type] || iconMap.info;
  };

  return (
    <div className={getToastStyles()}>
      {/* Content */}
      {getIcon()}

      <div className="flex-1">
        <p className="font-medium text-gray-900">{toastData.message}</p>
        {toastData.description && (
          <p className="text-sm text-gray-600 mt-1">{toastData.description}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ============================================
// TOAST PROVIDER COMPONENT
// ============================================

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultPosition = "top-right",
  defaultDuration = 4000,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counterRef = useRef(0);

  const showToastInternal = useCallback(
    (options: ToastOptions): void => {
      const id = `toast-${counterRef.current++}-${Date.now()}`;
      const newToast: ToastData = {
        id,
        type: options.type || "info",
        message: options.message,
        description: options.description,
        isVisible: true,
        duration: options.duration ?? defaultDuration,
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
      showToastInternal({ type: "success", message, description });
    },
    [showToastInternal]
  );

  const error = useCallback(
    (message: string, description?: string): void => {
      showToastInternal({ type: "error", message, description });
    },
    [showToastInternal]
  );

  const warning = useCallback(
    (message: string, description?: string): void => {
      showToastInternal({ type: "warning", message, description });
    },
    [showToastInternal]
  );

  const info = useCallback(
    (message: string, description?: string): void => {
      showToastInternal({ type: "info", message, description });
    },
    [showToastInternal]
  );

  const contextValue: ToastContextType = useMemo(
    () => ({
      showToast: showToastInternal,
      success,
      error,
      warning,
      info,
    }),
    [showToastInternal, success, error, warning, info]
  );

  // Register global handler and process queue
  useEffect(() => {
    toastQueue.handler = showToastInternal;
    processQueue();

    return () => {
      toastQueue.handler = null;
    };
  }, [showToastInternal]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </ToastContext.Provider>
  );
};
