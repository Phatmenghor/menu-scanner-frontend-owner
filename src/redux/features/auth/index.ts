import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
  selectUsers,
  selectUsersContent,
} from "./store/selectors/users-selectors";

export const useUsersStateManagement = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const userState = useAppSelector(selectUsers);
  const users = useAppSelector(selectUsersContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);

  return {
    userState,
    users,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
