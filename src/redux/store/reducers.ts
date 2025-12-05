/**
 * Store Reducers Configuration
 * Centralized configuration for all Redux reducers
 */

import authReducer from "../features/auth/slice/auth-slice";
import usersReducer from "../features/auth/slice/users-slice";

/**
 * Root reducer configuration
 * Add new feature reducers here
 */
export const reducers = {
  auth: authReducer,
  users: usersReducer,
};
