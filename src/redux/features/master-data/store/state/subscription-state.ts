import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
  selectSubscription,
  selectSubscriptionContent,
  selectSubscriptionState,
} from "../selectors/subscription-selector";

export const useSubscriptionState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const subscriptionState = useAppSelector(selectSubscriptionState);
  const subscriptionData = useAppSelector(selectSubscription);
  const subscriptionContent = useAppSelector(selectSubscriptionContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    subscriptionState,
    subscriptionData,
    subscriptionContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
