import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  loggingMiddleware,
  authLoggingMiddleware,
  userLoggingMiddleware,
  errorLoggingMiddleware,
} from "./middleware";
import { reducers } from "./reducers";

/**
 * Redux Store Configuration
 * Centralized store setup with all reducers and middleware
 */
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if needed
        ignoredActions: ["users/fetchAll/pending"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["users.data"],
      },
    }).concat([
      authLoggingMiddleware,
      userLoggingMiddleware,
      errorLoggingMiddleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

// Export store as default (for your ClientProviders)
export default store;

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Also export as named export if needed elsewhere
export { store };
