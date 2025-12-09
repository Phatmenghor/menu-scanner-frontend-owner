import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectFilters,
  selectIsLoading,
  selectOperations,
  selectPagination,
  selectSubscriptionPlan,
  selectSubscriptionPlanContent,
  selectSubscriptionPlanState,
} from "../selectors/subscription-plan-selector";

export const useSubscriptionPlanState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const subscriptionPlanState = useAppSelector(selectSubscriptionPlanState);
  const subscriptionPlanData = useAppSelector(selectSubscriptionPlan);
  const subscriptionPlanContent = useAppSelector(selectSubscriptionPlanContent);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    subscriptionPlanState,
    subscriptionPlanData,
    subscriptionPlanContent,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
