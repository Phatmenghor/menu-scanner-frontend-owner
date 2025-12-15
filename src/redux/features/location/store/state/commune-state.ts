import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectCommune,
  selectCommuneContent,
  selectCommuneState,
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
} from "../selectors/commune-selector";

export const useCommuneState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const communeState = useAppSelector(selectCommuneState);
  const communeData = useAppSelector(selectCommune);
  const communeContent = useAppSelector(selectCommuneContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    communeState,
    communeData,
    communeContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
