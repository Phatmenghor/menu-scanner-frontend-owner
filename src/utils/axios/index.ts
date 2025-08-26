import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken } from "../local-storage/token";
import { toast } from "sonner";

// Define types
type RequestMetadata = {
  startTime: number;
  requestId: string;
};

// Extend AxiosRequestConfig to include metadata
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: RequestMetadata;
  }
}

// Environment detection
const isBrowser = typeof window !== "undefined";
const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === "development";

// Colors for console output
const colors = {
  green: isBrowser ? "color: #4caf50" : "\x1b[32m",
  red: isBrowser ? "color: #f44336" : "\x1b[31m",
  yellow: isBrowser ? "color: #ff9800" : "\x1b[33m",
  blue: isBrowser ? "color: #2196f3" : "\x1b[34m",
  purple: isBrowser ? "color: #9c27b0" : "\x1b[35m",
  cyan: isBrowser ? "color: #00bcd4" : "\x1b[36m",
  reset: isBrowser ? "" : "\x1b[0m",
};

// Format timestamp for better readability
const formatTimestamp = (): string => {
  const now = new Date();
  return (
    now.toISOString().replace("T", " ").replace("Z", "") +
    ` [${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}]`
  );
};

// Generate unique request ID
const generateRequestId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
};

// Simple logger with request ID and improved timestamp
const logger = {
  log: (message: string, data?: unknown, requestId?: string): void => {
    // Only use development check for normal logs
    if (isDevelopment) {
      const timestamp = formatTimestamp();
      const logId = requestId ? `[${requestId}] ` : "";
      if (isBrowser) {
        console.log(
          `%c${timestamp} ${logId}${message}`,
          colors.blue,
          data || ""
        );
      } else {
        console.log(
          `${colors.blue}${timestamp} ${logId}${message}${colors.reset}`,
          data || ""
        );
      }
    }
  },

  success: (message: string, data?: unknown, requestId?: string): void => {
    // Only use development check for success logs
    if (isDevelopment) {
      const timestamp = formatTimestamp();
      const logId = requestId ? `[${requestId}] ` : "";
      if (isBrowser) {
        console.log(
          `%c${timestamp} ${logId}${message}`,
          colors.green,
          data || ""
        );
      } else {
        console.log(
          `${colors.green}${timestamp} ${logId}${message}${colors.reset}`,
          data || ""
        );
      }
    }
  },

  error: (message: string, data?: unknown, requestId?: string): void => {
    // Always log errors regardless of environment
    const timestamp = formatTimestamp();
    const logId = requestId ? `[${requestId}] ` : "";
    if (isBrowser) {
      console.log(`%c${timestamp} ${logId}${message}`, colors.red, data || "");
    } else {
      console.log(
        `${colors.red}${timestamp} ${logId}${message}${colors.reset}`,
        data || ""
      );
    }
  },

  warn: (message: string, data?: unknown, requestId?: string): void => {
    // Always log warnings regardless of environment
    const timestamp = formatTimestamp();
    const logId = requestId ? `[${requestId}] ` : "";
    if (isBrowser) {
      console.warn(
        `%c${timestamp} ${logId}${message}`,
        colors.yellow,
        data || ""
      );
    } else {
      console.warn(
        `${colors.yellow}${timestamp} ${logId}${message}${colors.reset}`,
        data || ""
      );
    }
  },

  // New method for request body logs specifically
  requestBody: (
    method: string,
    url: string,
    data: unknown,
    requestId?: string
  ): void => {
    // Always log request body logs regardless of environment
    const timestamp = formatTimestamp();
    const logId = requestId ? `[${requestId}] ` : "";
    const messagePrefix = `REQUEST BODY [${method.toUpperCase()}] ${url}:`;

    if (isBrowser) {
      console.group(`%c${timestamp} ${logId}${messagePrefix}`, colors.purple);

      // Log the raw body
      console.log("%cRequest payload:", colors.cyan, formatRequestData(data));

      // If it's an object, also log its structure separately
      if (data && typeof data === "object" && !Array.isArray(data)) {
        console.log("%cPayload structure:", colors.cyan);
        // Log each top-level property separately for better visibility
        Object.entries(data as Record<string, unknown>).forEach(
          ([key, value]) => {
            const valueType = Array.isArray(value)
              ? `Array[${(value as []).length}]`
              : value && typeof value === "object"
              ? "Object"
              : typeof value;
            console.log(`%c${key}: ${valueType}`, colors.cyan, value);
          }
        );
      }

      console.groupEnd();
    } else {
      // For server-side, use a simpler approach
      console.log(
        `${colors.purple}${timestamp} ${logId}${messagePrefix}${colors.reset}`
      );
      console.log(
        `${colors.cyan}Request payload:${colors.reset}`,
        formatRequestData(data)
      );
    }

    // Add to memory logs with detailed structure
    addLogEntry({
      timestamp: timestamp,
      requestId: requestId || "unknown",
      level: "request-body",
      message: `Request Body for ${method.toUpperCase()} ${url}`,
      data: formatRequestData(data),
    });
  },
};

// Enhanced function to safely truncate or format request data
const formatRequestData = (data: unknown): unknown => {
  if (!data) return undefined;

  try {
    const dataStr = JSON.stringify(data);
    // If data is large, provide better structured preview
    if (dataStr.length > 5000) {
      if (Array.isArray(data)) {
        const firstThree = data.slice(0, 3);
        // For arrays, also analyze the structure of first items
        const itemAnalysis = firstThree.map((item) => {
          if (typeof item === "object" && item !== null) {
            return {
              type: Array.isArray(item) ? "Array" : "Object",
              keys: Object.keys(item).length,
              properties:
                Object.keys(item).slice(0, 5).join(", ") +
                (Object.keys(item).length > 5 ? "..." : ""),
            };
          }
          return typeof item;
        });

        return {
          type: "Array",
          length: data.length,
          preview: firstThree,
          itemTypes: itemAnalysis,
          note: `Array truncated (${data.length} items total)`,
        };
      } else if (typeof data === "object" && data !== null) {
        const preview: Record<string, unknown> = {};
        const keys = Object.keys(data as Record<string, unknown>);
        const totalKeys = keys.length;
        const previewKeys = keys.slice(0, 5);

        // Create preview with first few properties
        previewKeys.forEach((key) => {
          preview[key] = (data as Record<string, unknown>)[key];
        });

        // Add analysis of property types
        const propertyTypes: Record<string, string> = {};
        keys.forEach((key) => {
          const value = (data as Record<string, unknown>)[key];
          if (Array.isArray(value)) {
            propertyTypes[key] = `Array[${value.length}]`;
          } else if (value && typeof value === "object") {
            propertyTypes[key] = `Object{${
              Object.keys(value as object).length
            } props}`;
          } else {
            propertyTypes[key] = typeof value;
          }
        });

        return {
          type: "Object",
          keys: totalKeys,
          preview,
          propertyTypes: Object.fromEntries(
            Object.entries(propertyTypes).slice(0, 10)
          ),
          note: `Object truncated (${totalKeys} properties total)`,
        };
      }
      return `[Large data: ${dataStr.length} characters]`;
    }
    return data;
  } catch (err) {
    return `[Unserializable data: ${(err as Error).message}]`;
  }
};

// Create axios instances with enhanced request body logging
const createAxiosInstance = (requiresAuth = false): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor with enhanced request body logging
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      // Generate request ID and track start time
      const requestId = generateRequestId();
      config.metadata = {
        startTime: Date.now(),
        requestId,
      };

      // Add request ID to headers for tracing
      config.headers = config.headers || {};
      config.headers["X-Request-ID"] = requestId;

      // Handle authentication
      if (requiresAuth) {
        const token = getToken();

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          logger.warn(
            "No authentication token for protected route",
            undefined,
            requestId
          );
        }
      }

      // Always log basic request info
      logger.log(
        `Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          headers: Object.keys(config.headers).reduce((acc, key) => {
            // Don't log sensitive headers like Authorization
            if (key !== "Authorization") {
              acc[key] = config.headers[key];
            } else {
              acc[key] = "[REDACTED]";
            }
            return acc;
          }, {} as Record<string, unknown>),
        },
        requestId
      );

      // Enhanced request body logging
      if (config.data) {
        // Use the new dedicated request body logger
        logger.requestBody(
          config.method || "unknown",
          config.url || "unknown",
          config.data,
          requestId
        );

        // For mutation operations (POST, PUT, PATCH) log with higher visibility
        if (
          config.method &&
          ["post", "put", "patch", "delete"].includes(
            config.method.toLowerCase()
          )
        ) {
          // Add additional structured logging for mutation operations
          const dataSize = JSON.stringify(config.data).length;
          logger.warn(
            `Mutation operation: ${config.method.toUpperCase()} ${config.url}`,
            {
              payloadSize: `${dataSize} bytes`,
              contentType: config.headers["Content-Type"],
              requestId,
            },
            requestId
          );
        }
      } else {
        // Log when there's no request body but method typically has one
        if (
          config.method &&
          ["post", "put", "patch"].includes(config.method.toLowerCase())
        ) {
          logger.warn(
            `Empty request body for ${config.method.toUpperCase()} ${
              config.url
            }`,
            undefined,
            requestId
          );
        }
      }

      return config;
    },
    (error: unknown) => {
      // Log request setup errors
      logger.error("Request Setup Error:", (error as Error).message);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      // Get request metadata with ID
      const { startTime, requestId } = response.config.metadata || {
        startTime: Date.now(),
        requestId: "unknown",
      };

      // Calculate and log performance for successful requests
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Log status and duration with request ID
      logger.success(
        `Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
          size: JSON.stringify(response.data).length,
        },
        requestId
      );

      // Log response data if in development mode
      if (isDevelopment) {
        const dataSize = JSON.stringify(response.data).length;
        if (dataSize > 10000) {
          logger.log(`Response data (truncated):`, undefined, requestId);

          // Handle array data
          if (Array.isArray(response.data)) {
            logger.log(
              `Array with ${response.data.length} items. First 2 items:`,
              response.data.slice(0, 2),
              requestId
            );
          }
          // Handle object data
          else if (
            typeof response.data === "object" &&
            response.data !== null
          ) {
            const preview: Record<string, unknown> = {};
            const keys = Object.keys(response.data).slice(0, 5);

            keys.forEach((key) => {
              preview[key] = response.data[key];
            });

            if (Object.keys(response.data).length > 5) {
              preview["..."] = `${
                Object.keys(response.data).length - 5
              } more properties`;
            }

            logger.log(`Object data preview:`, preview, requestId);
          }
        } else {
          logger.log(`Response data:`, response.data, requestId);
        }
      }

      return response;
    },
    (error: unknown) => {
      const err = error as AxiosError;

      if (err.response?.status === 401) {
        toast.message(err.message);
        window.location.href = "/login";
      }
      // Get request ID from metadata
      const requestId = err.config?.metadata?.requestId || "unknown";

      // Log error with details and request ID
      const errorDetails = {
        method: err.config?.method?.toUpperCase(),
        url: err.config?.url,
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
      };

      logger.error(`API Error:`, errorDetails, requestId);

      // Enhanced error request body logging
      if (err.config?.data) {
        // Log with comprehensive details
        logger.error(
          `Request body for failed request:`,
          formatRequestData(err.config.data),
          requestId
        );

        // Add additional dedicated request body logging for errors
        logger.requestBody(
          err.config.method || "unknown",
          err.config.url || "unknown",
          err.config.data,
          `${requestId}-error` // Add error suffix to distinguish in logs
        );
      }

      // Always log response data for errors with enhanced details
      if (err.response?.data) {
        const errorResponseData = err.response.data;
        let formattedErrorData;

        // Try to extract error details more effectively
        if (
          typeof errorResponseData === "object" &&
          errorResponseData !== null
        ) {
          // Look for common error fields
          const errorMessage =
            (errorResponseData as { error?: { message?: string } }).error
              ?.message ||
            (errorResponseData as { message?: string }).message ||
            (errorResponseData as { error?: string; message?: string }).error ||
            JSON.stringify(errorResponseData);

          // Try to extract validation errors if present
          const validationErrors =
            (errorResponseData as { errors?: unknown }).errors ||
            (errorResponseData as { validationErrors?: unknown })
              .validationErrors ||
            (errorResponseData as { fieldErrors?: unknown }).fieldErrors;

          formattedErrorData = {
            errorMessage,
            ...(validationErrors ? { validationErrors } : {}),
            rawError: formatRequestData(errorResponseData),
          };
        } else {
          formattedErrorData = errorResponseData;
        }

        logger.error(`Error response data:`, formattedErrorData, requestId);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Store all logs for debugging
interface LogEntry {
  timestamp: string;
  requestId: string;
  level: string;
  message: string;
  data?: unknown;
}

const memoryLogs: LogEntry[] = [];

// Helper function to add a log entry
export function addLogEntry(entry: LogEntry): void {
  // Ensure we have a properly formatted timestamp
  if (!entry.timestamp) {
    entry.timestamp = formatTimestamp();
  }

  memoryLogs.push(entry);

  // Keep only last 200 logs in memory (increased from 100)
  if (memoryLogs.length > 200) {
    memoryLogs.shift();
  }
}

// Helper function to view all logs with improved formatting
export function viewLogs(filter?: string): void {
  let logsToDisplay = memoryLogs;

  // Apply filter if provided
  if (filter) {
    const lcFilter = filter.toLowerCase();
    logsToDisplay = memoryLogs.filter((log) => {
      return (
        log.requestId.toLowerCase().includes(lcFilter) ||
        log.level.toLowerCase().includes(lcFilter) ||
        log.message.toLowerCase().includes(lcFilter) ||
        (typeof log.data === "string" &&
          log.data.toLowerCase().includes(lcFilter))
      );
    });
  }

  console.table(
    logsToDisplay.map((log) => ({
      timestamp: log.timestamp,
      requestId: log.requestId,
      level: log.level,
      message: log.message,
      duration:
        log.data && typeof log.data === "object" && "duration" in log.data
          ? (log.data as { duration?: string }).duration
          : "N/A",
    }))
  );

  console.log(
    `Showing ${logsToDisplay.length} of ${memoryLogs.length} total logs.`
  );
}

// Helper function to view full log details including data
export function viewLogDetails(index: number): void {
  if (index >= 0 && index < memoryLogs.length) {
    console.log(`Log Details for entry #${index}:`, memoryLogs[index]);
  } else {
    console.log(`Invalid log index: ${index}`);
  }
}

// Helper function to find logs by request ID
export function findLogsByRequestId(requestId: string): LogEntry[] {
  return memoryLogs.filter((log) => log.requestId === requestId);
}

// Helper function to find request body logs specifically
export function findRequestBodyLogs(): LogEntry[] {
  return memoryLogs.filter((log) => log.level === "request-body");
}

// Helper to view all request body logs
export function viewRequestBodyLogs(): void {
  const requestBodyLogs = findRequestBodyLogs();
  console.log(`Found ${requestBodyLogs.length} request body logs:`);

  requestBodyLogs.forEach((log, index) => {
    console.group(`${index + 1}. ${log.message} [${log.requestId}]`);
    console.log("Timestamp:", log.timestamp);
    console.log("Body data:", log.data);
    console.groupEnd();
  });
}

// Export axios instances
export const axiosClientWithAuth = createAxiosInstance(true);
export const axiosClient = createAxiosInstance(false);

// Export logger and utilities
export { logger, formatRequestData };
