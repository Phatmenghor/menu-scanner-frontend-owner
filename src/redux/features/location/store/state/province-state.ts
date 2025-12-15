import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
  selectProvince,
  selectProvinceContent,
  selectProvinceState,
} from "../selectors/province-selector";

export const useProvinceState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const provinceState = useAppSelector(selectProvinceState);
  const provinceData = useAppSelector(selectProvince);
  const provinceContent = useAppSelector(selectProvinceContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    provinceState,
    provinceData,
    provinceContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
