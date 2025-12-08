import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectBusiness,
  selectBusinessContent,
  selectBusinessState,
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
} from "../selectors/business-selector";

export const useBusinessState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const businessState = useAppSelector(selectBusinessState);
  const businessData = useAppSelector(selectBusiness);
  const businessContent = useAppSelector(selectBusinessContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    businessState,
    businessData,
    businessContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
