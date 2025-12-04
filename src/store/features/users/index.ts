/**
 * Users Feature - Public API
 *
 * Import from this file to access the users feature:
 * import { useUsers, fetchUsers, setSearchFilter } from '@/store/features/users';
 */

import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectUserState,
  selectUsersContent,
  selectFilters,
  selectOperations,
  selectPagination,
} from "./selectors";

// Export types
export type {
  UserState,
  UserFilters,
  UserModel,
  CreateUserRequest,
  UpdateUserRequest,
} from "./types";

// Export thunks
export {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "./thunks";

// Export actions
export {
  setSearchFilter,
  setAccountStatusFilter,
  setRoleFilter,
  setPageNo,
  clearError,
  resetFilters,
  resetState,
} from "./slice";

// Export selectors
export {
  selectUserState,
  selectUsers,
  selectUsersContent,
  selectFilters,
  selectOperations,
  selectPagination,
} from "./selectors";

// Export reducer as default
export { default as userReducer } from "./slice";

/**
 * Custom hook to access users feature
 *
 * @example
 * const { users, isLoading, filters, operations, pagination, dispatch } = useUsers();
 */
export const useUsers = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserState);
  const users = useAppSelector(selectUsersContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);

  return {
    // State
    userState,
    users,
    isLoading: userState.isLoading,
    error: userState.error,

    // Filters
    filters,

    // Operations
    operations,
    isCreating: operations.isCreating,
    isUpdating: operations.isUpdating,
    isDeleting: operations.isDeleting,

    // Pagination
    pagination,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,

    // Dispatch
    dispatch,
  };
};
