import { useAppDispatch, useAppSelector } from "@/features/store";
import { selectError, selectIsLoading } from "../selectors/auth-selectors";

export const useAuthState = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    isLoading,
    error,
    dispatch,
  };
};
