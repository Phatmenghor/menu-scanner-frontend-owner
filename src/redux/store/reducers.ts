/**
 * Store Reducers Configuration
 * Centralized configuration for all Redux reducers
 */

import authReducer from "../features/auth/store/slice/auth-slice";
import usersReducer from "../features/auth/store/slice/users-slice";
import businessOwnerReducer from "../features/auth/store/slice/business-owner-slice";

import businessReducer from "../features/master-data/store/slice/business-slice";
import exchangeRateReducer from "../features/master-data/store/slice/exchage-rate-slice";
import subscriptionPlanReducer from "../features/master-data/store/slice/subscription-plan-slice";
import paymentReducer from "../features/master-data/store/slice/payment-slice";
import subscriptionReducer from "../features/master-data/store/slice/subscription-slice";

import communeReducer from "../features/location/store/slice/commune-slice";
import provinceReducer from "../features/location/store/slice/province-slice";
import districtReducer from "../features/location/store/slice/district-slice";
import villageReducer from "../features/location/store/slice/village-slice";

import notificationReducer from "../features/notification/store/slice/notification-slice";

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
  payment: paymentReducer,
  subscription: subscriptionReducer,
  commune: communeReducer,
  province: provinceReducer,
  district: districtReducer,
  village: villageReducer,
  notification: notificationReducer,
  businessOwner: businessOwnerReducer,
};
