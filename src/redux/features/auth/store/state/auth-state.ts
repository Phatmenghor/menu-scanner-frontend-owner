/**
 * Auth State Hook
 */

import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectIsLoading,
  selectIsAuthenticated,
  selectUser,
  selectProfile,
  selectIsProfileLoading,
  selectUserFullName,
  selectUserEmail,
  selectUserProfileImage,
  selectUserRoles,
  selectAccessToken,
} from "../selectors/auth-selectors";

export const useAuthState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const isLoading = useAppSelector(selectIsLoading);
  const isProfileLoading = useAppSelector(selectIsProfileLoading);
  const error = useAppSelector(selectError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const profile = useAppSelector(selectProfile);
  const fullName = useAppSelector(selectUserFullName);
  const email = useAppSelector(selectUserEmail);
  const profileImage = useAppSelector(selectUserProfileImage);
  const roles = useAppSelector(selectUserRoles);
  const accessToken = useAppSelector(selectAccessToken);

  return {
    // Loading states
    isLoading,
    isProfileLoading,
    error,

    // Auth state
    isAuthenticated,
    user,
    profile,

    // User info
    fullName,
    email,
    profileImage,
    roles,
    accessToken,

    // Dispatch
    dispatch,
  };
};
