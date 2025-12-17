import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectFilters,
  selectIsLoading,
  selectNotification,
  selectNotificationContent,
  selectNotificationState,
  selectOperations,
  selectPagination,
  selectUnReadCount,
  selectUnSeenCount,
} from "../selectors/notification-selector";

export const useNotificationState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const notificationState = useAppSelector(selectNotificationState);
  const notificationData = useAppSelector(selectNotification);
  const notificationContent = useAppSelector(selectNotificationContent);
  const unReadCount = useAppSelector(selectUnReadCount);
  const unSeenCount = useAppSelector(selectUnSeenCount);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    notificationState,
    notificationData,
    notificationContent,
    unReadCount,
    unSeenCount,
    isLoading,
    error,
    filters,
    operations,
    pagination,
    dispatch,
  };
};
