import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectBusiness,
  selectBusinessContent,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
} from "../selectors/business-selector";

export const useBusinessState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const businesstate = useAppSelector(selectBusiness);
  const business = useAppSelector(selectBusinessContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);

  return {
    businesstate,
    business,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
