import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
  selectUsers,
  selectUsersContent,
  selectUsersState,
  selectError,
} from "../selectors/users-selectors";

export const useUsersState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const userState = useAppSelector(selectUsersState);
  const usersData = useAppSelector(selectUsers);
  const usersContent = useAppSelector(selectUsersContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    userState,
    usersData,
    usersContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
