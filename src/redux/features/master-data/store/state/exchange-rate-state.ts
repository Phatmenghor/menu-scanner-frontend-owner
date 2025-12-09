import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectExchangeRate,
  selectExchangeRateContent,
  selectExchangeRateState,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
} from "../selectors/exchange-rate-selector";

export const useExchangeRateState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const exchangeRateState = useAppSelector(selectExchangeRateState);
  const exchangeRateData = useAppSelector(selectExchangeRate);
  const exchangeRateContent = useAppSelector(selectExchangeRateContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    exchangeRateState,
    exchangeRateData,
    exchangeRateContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
