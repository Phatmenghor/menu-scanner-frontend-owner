// utils/apiWrapper.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createApiThunk = <ReturnType, ArgType = void>(
  typePrefix: string,
  apiCall: (arg: ArgType) => Promise<ReturnType>,
  options?: {
    transformResponse?: (data: any) => ReturnType;
    logError?: boolean;
  }
) => {
  return createAsyncThunk<ReturnType, ArgType>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        const response = await apiCall(arg);
        return options?.transformResponse
          ? options.transformResponse(response)
          : response;
      } catch (error: any) {
        // Custom error logging
        if (options?.logError !== false) {
          console.error(`Error in ${typePrefix}:`, error);
        }

        // Standardized error handling
        if (error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        }

        if (error.message) {
          return rejectWithValue(error.message);
        }

        return rejectWithValue("An unexpected error occurred");
      }
    }
  );
};
