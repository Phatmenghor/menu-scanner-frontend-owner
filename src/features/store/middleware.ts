/**
 * Redux Logging Middleware
 * Logs Redux actions and state changes
 * Can be easily disabled in production
 */

import { Middleware } from "@reduxjs/toolkit";

const isProduction = process.env.NODE_ENV === "production";
const enableLogging =
  process.env.NEXT_PUBLIC_REDUX_LOGGING === "true" || !isProduction;

/**
 * Redux logging middleware
 * Logs action types, payloads, and resulting state
 */
export const loggingMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    if (!enableLogging) {
      return next(action);
    }

    const previousState = storeAPI.getState();

    // Log action
    console.group(`📦 Redux Action: ${action.type}`);
    console.log("🔹 Action:", action);

    const result = next(action);

    const nextState = storeAPI.getState();

    // Log state changes
    console.log("📊 State Changed:", {
      previous: previousState,
      next: nextState,
    });
    console.groupEnd();

    return result;
  };

/**
 * Auth-specific logging middleware
 * Logs authentication-related actions
 */
export const authLoggingMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    if (!enableLogging) {
      return next(action);
    }

    const isAuthAction = action.type.startsWith("auth/");

    if (isAuthAction) {
      console.log("🔐 [AUTH]", action.type, action.payload);
    }

    return next(action);
  };

/**
 * User management logging middleware
 * Logs user CRUD operations
 */
export const userLoggingMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    if (!enableLogging) {
      return next(action);
    }

    const isUserAction = action.type.startsWith("users/");

    if (isUserAction) {
      const icons: { [key: string]: string } = {
        "users/fetchAll": "🔍",
        "users/fetchById": "🔎",
        "users/create": "➕",
        "users/update": "✏️",
        "users/delete": "🗑️",
        "users/toggleStatus": "🔄",
      };

      const icon = icons[action.type] || "👤";
      console.log(`${icon} [USERS]`, action.type, action.payload);
    }

    return next(action);
  };

/**
 * Error logging middleware
 * Logs all rejected/failed actions
 */
export const errorLoggingMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    if (!enableLogging) {
      return next(action);
    }

    const isRejectedAction = action.type.endsWith("/rejected");

    if (isRejectedAction) {
      console.error("❌ [ERROR]", action.type, action.payload);
    }

    return next(action);
  };
