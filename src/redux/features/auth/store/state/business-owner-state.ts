import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectBusinessOwner,
  selectBusinessOwnerContent,
  selectBusinessOwnerState,
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
} from "../selectors/business-owner-selectors";

export const useBusinessOwnerState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const businessOwnerState = useAppSelector(selectBusinessOwnerState);
  const businessOwnerData = useAppSelector(selectBusinessOwner);
  const businessOwnerContent = useAppSelector(selectBusinessOwnerContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    businessOwnerState,
    businessOwnerData,
    businessOwnerContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
