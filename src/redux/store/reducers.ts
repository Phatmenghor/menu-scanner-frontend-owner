/**
 * Store Reducers Configuration
 * Centralized configuration for all Redux reducers
 */

import authReducer from "../features/auth/store/slice/auth-slice";
import usersReducer from "../features/auth/store/slice/users-slice";
import businessReducer from "../features/master-data/store/slice/business-slice";
import exchangeRateReducer from "../features/master-data/store/slice/exchage-rate-slice";
import subscriptionPlanReducer from "../features/master-data/store/slice/subscription-plan-slice";

/**
 * Root reducer configuration
 * Add new feature reducers here
 */
export const reducers = {
  auth: authReducer,
  users: usersReducer,
  business: businessReducer,
  exchangeRate: exchangeRateReducer,
  subscriptionPlan: subscriptionPlanReducer,
};
