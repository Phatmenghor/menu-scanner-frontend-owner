import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectDistrict,
  selectDistrictContent,
  selectDistrictState,
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
} from "../selectors/district-selector";

export const useDistrictState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const districtState = useAppSelector(selectDistrictState);
  const districtData = useAppSelector(selectDistrict);
  const districtContent = useAppSelector(selectDistrictContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    districtState,
    districtData,
    districtContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
