import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./features/users";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Add other feature reducers here as you build them
// import { productReducer } from "./features/products";
// import { orderReducer } from "./features/orders";

const store = configureStore({
  reducer: {
    users: userReducer,
    // products: productReducer,
    // orders: orderReducer,
  },
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
    }),
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
