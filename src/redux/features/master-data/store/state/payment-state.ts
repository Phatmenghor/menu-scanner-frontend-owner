import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
  selectPayment,
  selectPaymentContent,
  selectPaymentState,
} from "../selectors/payment-selector";
export const usePaymentState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const paymentState = useAppSelector(selectPaymentState);
  const paymentData = useAppSelector(selectPayment);
  const paymentContent = useAppSelector(selectPaymentContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    paymentState,
    paymentData,
    paymentContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
