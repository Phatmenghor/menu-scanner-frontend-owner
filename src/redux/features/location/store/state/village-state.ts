import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
  selectVillage,
  selectVillageContent,
  selectVillageState,
} from "../selectors/vaillage-selector";

export const useVillageState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const villageState = useAppSelector(selectVillageState);
  const villageData = useAppSelector(selectVillage);
  const villageContent = useAppSelector(selectVillageContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    villageState,
    villageData,
    villageContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
